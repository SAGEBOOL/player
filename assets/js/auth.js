// 前端存储工具库 - 使用 localStorage 代替后端 API
const AUTH_KEYS = {
    USERS: '9jie_users',
    ADMINS: '9jie_admins',
    CURRENT_USER: '9jie_current_user'
};

// 安全 Base64 编码（支持 Unicode/中文）
function safeBtoa(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// 安全 Base64 解码（支持 Unicode/中文）
function safeAtob(str) {
    return decodeURIComponent(escape(atob(str)));
}

const bcrypt = {
    hashSync: function(password, salt) {
        // 简单哈希（浏览器环境用 btoa 代替 bcrypt）
        return safeBtoa(password + salt);
    },
    compareSync: function(password, hash) {
        return safeBtoa(password + '10') === hash;
    }
};

// ========== 用户操作 ==========
function getUsers() {
    const data = localStorage.getItem(AUTH_KEYS.USERS);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error('Failed to parse users data:', e);
        localStorage.removeItem(AUTH_KEYS.USERS);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

// ========== 管理员操作 ==========
function getAdmins() {
    const data = localStorage.getItem(AUTH_KEYS.ADMINS);
    if (!data) {
        // 初始化管理员
        const admins = [
            {
                id: 1,
                username: 'HE-1',
                password: safeBtoa('HYH18800050565hd'),
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                username: 'LIU',
                password: safeBtoa('LIU20260514-1'),
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                username: 'GAN',
                password: safeBtoa('GAN20260514-2'),
                created_at: new Date().toISOString()
            }
        ];
        saveAdmins(admins);
        return admins;
    }
    return JSON.parse(data);
}

function saveAdmins(admins) {
    localStorage.setItem(AUTH_KEYS.ADMINS, JSON.stringify(admins));
}

// ========== 注册 ==========
function registerUser(username, password, email, phone) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }
    if (username.length < 3 || username.length > 20) {
        return { success: false, message: '用户名长度需在3-20个字符之间' };
    }
    if (password.length < 6) {
        return { success: false, message: '密码长度至少6位' };
    }

    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return { success: false, message: '用户名已存在' };
    }
    if (email && users.find(u => u.email === email)) {
        return { success: false, message: '邮箱已被注册' };
    }
    if (phone && users.find(u => u.phone === phone)) {
        return { success: false, message: '手机号已被注册' };
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username,
        password: safeBtoa(password),  // 安全编码（支持中文密码）
        email: email || null,
        phone: phone || null,
        status: 'authorized',  // 默认授权
        created_at: new Date().toISOString(),
        authorized_at: new Date().toISOString(),
        authorized_by: 'system',
        login_count: 0,
        last_login: null,
        page_views: {}
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true, message: '注册成功！已自动授权', userId: newUser.id };
}

// ========== 登录 ==========
function loginUser(username, password) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }

    const users = getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return { success: false, message: '用户名或密码错误' };
    }

    // 密码比对（支持新旧编码向后兼容）
    let passwordMatch = false;
    if (user.password === safeBtoa(password)) {
        passwordMatch = true;
    } else if (user.password === btoa(password)) {
        // 旧编码兼容：如果匹配成功，更新为新编码
        passwordMatch = true;
        user.password = safeBtoa(password);
        saveUsers(users);
    }

    if (!passwordMatch) {
        return { success: false, message: '用户名或密码错误' };
    }

    if (user.status !== 'authorized') {
        return {
            success: false,
            message: user.status === 'pending' ? '账号待审核中' : '账号已被拒绝',
            status: user.status
        };
    }

    // 保存登录状态
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));

    // 更新登录次数和最后登录时间
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].login_count = (users[userIndex].login_count || 0) + 1;
        users[userIndex].last_login = new Date().toISOString();
        saveUsers(users);
    }

    return { success: true, message: '登录成功！', user: userWithoutPassword };
}

// ========== 管理员登录 ==========
function loginAdmin(username, password) {
    if (!username || !password) {
        return { success: false, message: '用户名和密码不能为空' };
    }

    const admins = getAdmins();
    const admin = admins.find(a => a.username === username);

    if (!admin) {
        return { success: false, message: '管理员用户名或密码错误' };
    }

    // 密码比对（支持新旧编码向后兼容）
    let passwordMatch = false;
    if (admin.password === safeBtoa(password)) {
        passwordMatch = true;
    } else if (admin.password === btoa(password)) {
        // 旧编码兼容：如果匹配成功，更新为新编码
        passwordMatch = true;
        admin.password = safeBtoa(password);
        saveAdmins(admins);
    }

    if (!passwordMatch) {
        return { success: false, message: '管理员用户名或密码错误' };
    }

    localStorage.setItem('9jie_admin_logged_in', 'true');
    return { success: true, message: '管理员登录成功！' };
}

// ========== 获取当前用户 ==========
function getCurrentUser() {
    const data = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
}

// ========== 退出登录 ==========
function logoutUser() {
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
}

// ========== 管理员操作 ==========
function getAdminUserList() {
    const users = getUsers();
    return {
        success: true,
        users: users.map(({ password, ...user }) => user),
        pendingCount: users.filter(u => u.status === 'pending').length
    };
}

// ========== 用户统计功能 ==========
// 追踪页面访问
function trackPageView(pagePath) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return;

    // 初始化 page_views 如果不存在
    if (!users[userIndex].page_views) {
        users[userIndex].page_views = {};
    }

    // 递增页面访问次数
    const path = pagePath || window.location.pathname;
    users[userIndex].page_views[path] = (users[userIndex].page_views[path] || 0) + 1;

    saveUsers(users);

    // 同步更新 CURRENT_USER 中的 page_views
    const updatedUser = { ...users[userIndex] };
    delete updatedUser.password;
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
}

// 获取页面访问统计（供管理后台使用）
function getPageStats() {
    const users = getUsers();
    const pageStats = {};
    let totalLogins = 0;
    let activeToday = 0;

    const today = new Date().toISOString().split('T')[0];

    users.forEach(user => {
        // 统计总登录次数
        totalLogins += (user.login_count || 0);

        // 统计今日活跃用户
        if (user.last_login && user.last_login.startsWith(today)) {
            activeToday++;
        }

        // 统计页面访问
        if (user.page_views) {
            Object.entries(user.page_views).forEach(([page, count]) => {
                pageStats[page] = (pageStats[page] || 0) + count;
            });
        }
    });

    return {
        success: true,
        totalLogins,
        activeToday,
        pageStats
    };
}

// 自动追踪当前页面访问（页面加载时调用）
function autoTrackPageView() {
    // 延迟执行，确保用户数据已加载
    setTimeout(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            trackPageView();
        }
    }, 500);
}

// 页面加载时自动追踪
if (typeof window !== 'undefined') {
    window.addEventListener('load', autoTrackPageView);
    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'complete') {
        autoTrackPageView();
    }
}

// ========== 初始化默认管理员 ==========
getAdmins();
