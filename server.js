// 九界修真百科 - 用户授权系统后端
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 数据文件路径
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ADMINS_FILE = path.join(__dirname, 'data', 'admins.json');

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据文件
function initData() {
    // 初始化管理员
    if (!fs.existsSync(ADMINS_FILE)) {
        const hashedPassword = bcrypt.hashSync('HYH18800050565hd', 10);
        fs.writeFileSync(ADMINS_FILE, JSON.stringify([
            { id: 1, username: 'HE-1', password: hashedPassword, created_at: new Date().toISOString() }
        ], null, 2));
        console.log('默认管理员已创建: HE-1 / HYH18800050565hd');
    }

    // 初始化用户
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    }
}

initData();

// 数据操作函数
function readUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function readAdmins() {
    try {
        return JSON.parse(fs.readFileSync(ADMINS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function getNextId(arr) {
    return arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1;
}

// ============ 用户API ============

// 用户注册
app.post('/api/register', (req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        if (!username || !password) {
            return res.json({ success: false, message: '用户名和密码不能为空' });
        }

        if (username.length < 3 || username.length > 20) {
            return res.json({ success: false, message: '用户名长度需在3-20个字符之间' });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: '密码长度至少6位' });
        }

        const users = readUsers();

        // 检查用户名
        if (users.find(u => u.username === username)) {
            return res.json({ success: false, message: '用户名已存在' });
        }

        // 检查邮箱
        if (email && users.find(u => u.email === email)) {
            return res.json({ success: false, message: '邮箱已被注册' });
        }

        // 检查手机号
        if (phone && users.find(u => u.phone === phone)) {
            return res.json({ success: false, message: '手机号已被注册' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: getNextId(users),
            username,
            password: hashedPassword,
            email: email || null,
            phone: phone || null,
            status: 'pending',
            created_at: new Date().toISOString(),
            authorized_at: null,
            authorized_by: null
        };

        users.push(newUser);
        writeUsers(users);

        res.json({
            success: true,
            message: '注册成功！请等待管理员授权后登录',
            userId: newUser.id
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.json({ success: false, message: '注册失败，请稍后重试' });
    }
});

// 用户登录
app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ success: false, message: '用户名和密码不能为空' });
        }

        const users = readUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.json({ success: false, message: '用户名或密码错误' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.json({ success: false, message: '用户名或密码错误' });
        }

        if (user.status !== 'authorized') {
            return res.json({
                success: false,
                message: user.status === 'pending' ? '账号待审核中，请耐心等待管理员授权' : '账号已被拒绝，如需帮助请联系管理员',
                status: user.status
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json({ success: true, message: '登录成功！', user: userWithoutPassword });
    } catch (error) {
        console.error('登录错误:', error);
        res.json({ success: false, message: '登录失败，请稍后重试' });
    }
});

// 获取当前用户信息
app.get('/api/user', (req, res) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.json({ success: false, message: '未登录' });
    }

    const users = readUsers();
    const user = users.find(u => u.id === parseInt(userId));

    if (!user) {
        return res.json({ success: false, message: '用户不存在' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
});

// ============ 管理员API ============

// 管理员登录
app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ success: false, message: '用户名和密码不能为空' });
        }

        const admins = readAdmins();
        const admin = admins.find(a => a.username === username);

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.json({ success: false, message: '管理员用户名或密码错误' });
        }

        res.json({ success: true, message: '管理员登录成功！' });
    } catch (error) {
        console.error('管理员登录错误:', error);
        res.json({ success: false, message: '登录失败' });
    }
});

// 获取所有用户
app.get('/api/admin/users', (req, res) => {
    try {
        const users = readUsers();
        const usersWithoutPassword = users.map(({ password, ...user }) => user);

        res.json({
            success: true,
            users: usersWithoutPassword,
            pendingCount: users.filter(u => u.status === 'pending').length
        });
    } catch (error) {
        console.error('获取用户列表错误:', error);
        res.json({ success: false, message: '获取失败' });
    }
});

// 授权操作
app.post('/api/admin/authorize', (req, res) => {
    try {
        const { userId, action, adminUsername } = req.body;

        if (!userId || !action) {
            return res.json({ success: false, message: '参数不完整' });
        }

        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === parseInt(userId));

        if (userIndex === -1) {
            return res.json({ success: false, message: '用户不存在' });
        }

        const statusMap = { authorize: 'authorized', reject: 'rejected', reset: 'pending' };
        const newStatus = statusMap[action];

        if (!newStatus) {
            return res.json({ success: false, message: '无效的操作' });
        }

        users[userIndex].status = newStatus;
        users[userIndex].authorized_at = newStatus !== 'pending' ? new Date().toISOString() : null;
        users[userIndex].authorized_by = newStatus !== 'pending' ? (adminUsername || 'admin') : null;

        writeUsers(users);

        res.json({
            success: true,
            message: action === 'authorize' ? '用户已授权' : action === 'reject' ? '用户已被拒绝' : '用户已重置为待审核'
        });
    } catch (error) {
        console.error('授权操作错误:', error);
        res.json({ success: false, message: '操作失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║      九界修真百科 - 用户授权系统              ║
╠═══════════════════════════════════════════════╣
║  🌐 服务器地址: http://localhost:${PORT}        ║
║  👤 普通用户: http://localhost:${PORT}/login.html ║
║  🔐 管理后台: http://localhost:${PORT}/admin.html  ║
╠═══════════════════════════════════════════════╣
║  管理员账号: HE-1                            ║
║  管理员密码: HYH18800050565hd                 ║
╚═══════════════════════════════════════════════╝
    `);
});
