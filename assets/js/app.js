// 九界修真世界 - 百科系统核心逻辑

// ==================== 全局状态 ====================
const state = {
    characters: [],
    systems: [],
    realms: [],
    storylines: [],
    currentCharacter: null,
    filters: {
        camp: 'all',
        search: ''
    }
};

// ==================== 人物数据 ====================
const charactersData = [
    {
        id: 'liulanglang',
        name: '刘浪浪',
        emoji: '🧙',
        avatar: 'assets/images/刘浪浪.png',
        camp: 'protagonist',
        campName: '主角团',
        identity: '苏易行转世 + 苏舟神识/一体双魂/AI脑机',
        personality: '智慧过人、重情重义、追求自由',
        abilities: ['宇宙能量操控', '一体双魂切换', 'AI辅助决策'],
        arc: '从凡人少年成长为九界守护者的历程',
        systems: ['能源体系', '灵根体系', '功法体系'],
        relations: [
            { id: 'heyi', name: '河一', type: 'brother' },
            { id: 'zhangleisheng', name: '张雷生', type: 'brother' },
            { id: 'gandafu', name: '甘道夫', type: 'brother' },
            { id: 'lingxi', name: '灵汐', type: 'lover' },
            { id: 'xuanchen', name: '玄宸', type: 'enemy' }
        ],
        stories: [
            '第1卷：觉醒于地球山村',
            '第6-10卷：横扫六国建立势力',
            '第15卷：揭露献祭阴谋'
        ]
    },
    {
        id: 'heyi',
        name: '河一',
        emoji: '🧔',
        avatar: 'assets/images/河一.png',
        camp: 'protagonist',
        campName: '主角团',
        identity: '界域风水师',
        personality: '稳重可靠、刚正不阿',
        abilities: ['界域感知', '风水布局', '封闭派→开放派转变'],
        arc: '从封闭派信徒到开放派领袖的思想转变',
        systems: ['势力分布体系', '能源体系'],
        storyPage: 'he-yi.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'brother' },
            { id: 'zhangleisheng', name: '张雷生', type: 'brother' },
            { id: 'gandafu', name: '甘道夫', type: 'brother' },
            { id: 'linqing', name: '林清', type: 'lover' },
            { id: 'bayan', name: '巴彦巨龙', type: 'ally' }
        ],
        stories: ['第11卷：修真初触', '第18卷：道心考验']
    },
    {
        id: 'zhangleisheng',
        name: '张雷生',
        emoji: '💰',
        camp: 'protagonist',
        campName: '主角团',
        identity: '商会巨擘',
        personality: '精明能干、善于交际',
        abilities: ['资源调配', '经济操控', '情报网络'],
        arc: '从商会少主到跨九界商业帝国掌门人',
        systems: ['经济体系', '势力分布体系'],
        storyPage: 'zhang-leisheng.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'brother' },
            { id: 'heyi', name: '河一', type: 'brother' },
            { id: 'gandafu', name: '甘道夫', type: 'brother' }
        ],
        stories: ['第8卷：兄弟聚义', '第20卷：商业帝国']
    },
    {
        id: 'lingxi',
        name: '灵汐',
        emoji: '👩‍⚕️',
        camp: 'love',
        campName: '爱情线',
        identity: '战国公主/医者/道侣',
        personality: '温柔善良、医术精湛',
        abilities: ['医术', '炼丹', '治愈'],
        arc: '从战国公主到刘浪浪道侣的成长之路',
        systems: ['天材地宝体系', '功法体系'],
        storyPage: 'ling-xi.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'lover' }
        ],
        stories: ['第5卷：初相遇', '第12卷：医者仁心']
    },
    {
        id: 'gandafu',
        name: '甘道夫',
        emoji: '⚔️',
        avatar: 'assets/images/甘道夫.png',
        camp: 'protagonist',
        campName: '主角团/兄弟团',
        identity: '甘承春，武当修道同学/修真界道门大佬',
        personality: '稳重可靠、行事沉稳、有担当',
        abilities: ['修界门', '守护道统', '道门秘法'],
        arc: '从对立到和解，与主角兄弟同心共护九界',
        systems: ['功法体系', '势力分布体系'],
        storyPage: 'gan-dao-fu.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'brother' },
            { id: 'heyi', name: '河一', type: 'brother' },
            { id: 'zhangleisheng', name: '张雷生', type: 'brother' },
            { id: 'tiandaolaoren', name: '天道老人', type: 'ally' }
        ],
        stories: ['第3卷：兄弟重聚', '第16卷：道门之争', '第22卷：和解同心']
    },
    {
        id: 'linqing',
        name: '林清',
        emoji: '❄️',
        avatar: 'assets/images/林清.png',
        camp: 'love',
        campName: '爱情线',
        identity: '河一的前世恋人，等待万年的守护者',
        personality: '外冷内热、情绪因功法反噬时冷时热',
        abilities: ['左手剑术', '冰心诀', '万年守候'],
        arc: '以冷漠掩饰深情，在测试中确认河一是否就是"那个人"',
        systems: ['功法体系', '灵根体系'],
        storyPage: 'lin-qing.html',
        relations: [
            { id: 'heyi', name: '河一', type: 'lover' },
            { id: 'liulanglang', name: '刘浪浪', type: 'ally' }
        ],
        stories: ['第7卷：平行相遇', '第14卷：羁绊加深', '隐藏卷：万年守候']
    },
    {
        id: 'xuanchen',
        name: '玄宸',
        emoji: '😈',
        avatar: 'assets/images/玄宸.png',
        camp: 'antagonist',
        campName: '反派阵营',
        identity: '九界之主 · 黑暗势力统治者',
        personality: '冷酷无情、野心勃勃、智谋深远',
        abilities: ['九界法则操控', '黑暗功法', '时空封锁'],
        arc: '从守护者堕落为统治者，最终被主角团击败',
        systems: ['势力分布体系', '黑暗体系', '功法体系'],
        storyPage: 'xuan-chen.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'enemy' },
            { id: 'heyi', name: '河一', type: 'enemy' },
            { id: 'tiandaolaoren', name: '天道老人', type: 'enemy' },
            { id: 'xueyan', name: '血衍', type: 'ally' }
        ],
        stories: ['第10卷：界主登场', '第17卷：黑暗崛起', '第22卷：最终决战']
    },
    {
        id: 'tiandaolaoren',
        name: '天道老人',
        emoji: '🔮',
        avatar: 'assets/images/天道老人.png',
        camp: 'mentor',
        campName: '神秘引路人',
        identity: '九界守护者 · 天道法则化身',
        personality: '神秘莫测、智慧超群、亦正亦邪',
        abilities: ['天道法则', '预言推演', '时空穿梭'],
        arc: '引导主角团，揭露九界真相',
        systems: ['功法体系', '能源体系', '灵根体系'],
        storyPage: 'tian-dao-lao-ren.html',
        relations: [
            { id: 'liulanglang', name: '刘浪浪', type: 'mentor' },
            { id: 'xuanchen', name: '玄宸', type: 'enemy' },
            { id: 'gandafu', name: '甘道夫', type: 'ally' }
        ],
        stories: ['第2卷：入梦点拨', '第28卷：天道真相', '隐藏卷：守护者']
    },
    {
        id: 'xueyan',
        name: '血衍',
        emoji: '🩸',
        camp: 'antagonist',
        campName: '反派',
        identity: '黑暗核心化身',
        personality: '冷酷无情、唯力量论',
        abilities: ['黑暗能量', '腐蚀心智', '虚空召唤'],
        arc: '作为黑暗面的代表，与主角终极对决',
        systems: ['黑暗核心', '能源体系'],
        relations: [
            { id: 'xuanchen', name: '玄宸', type: 'ally' },
            { id: 'liulanglang', name: '刘浪浪', type: 'enemy' }
        ],
        stories: ['第19卷：黑暗觉醒', '第30卷：终极对决']
    },
    {
        id: 'bayan',
        name: '巴彦巨龙',
        emoji: '🐉',
        avatar: 'assets/images/characters/bayan.png',
        camp: 'special',
        campName: '守护兽',
        identity: '墟界原生守护兽 · 河一坐骑',
        personality: '忠诚高傲、记忆碎片化、万年前即已存在',
        abilities: ['龙炎吐息（天火级）', '龙鳞护体（物理免疫70%）', '空间穿梭（百里瞬移）', '灵能感知（方圆千里）'],
        arc: '从万年沉睡中苏醒，认河一为主，守护九界',
        systems: ['能源体系', '功法体系'],
        relations: [
            { id: 'heyi', name: '河一', type: 'master' },
            { id: 'linqing', name: '林清', type: 'ally' }
        ],
        stories: ['第2卷：墟界深处苏醒', '后续：与河一共战九界']
    }
];

// ==================== 体系数据 ====================
const systemsData = [
    {
        id: 1,
        name: '能源体系',
        color: 'purple',
        description: '九类能量：五行基础+宇宙级，对应功法/灵根',
        details: '金、木、水、火、土为基础五行能量，加上宇宙级能量（暗能量、光能、虚空能等），构成完整的能量体系。',
        relatedCharacters: ['刘浪浪', '玄宸', '天道老人']
    },
    {
        id: 2,
        name: '灵根体系',
        color: 'blue',
        description: '灵根=能量吸收端口，五行俱全为顶级，多灵根>单灵根',
        details: '灵根是修真者吸收能量的端口。五行俱全为顶级灵根，多灵根优于单灵根，遵循相生相克规则。',
        relatedCharacters: ['刘浪浪', '天道老人']
    },
    {
        id: 3,
        name: '功法体系',
        color: 'teal',
        description: '功法=能量转化算法，通用/顶级功法，进阶路径',
        details: '功法是将吸收的能量转化为自身修为的算法。分通用功法和顶级功法，有明确的进阶路径。',
        relatedCharacters: ['刘浪浪', '甘承春', '灵汐']
    },
    {
        id: 4,
        name: '势力分布体系',
        color: 'amber',
        description: '七大区域：东方/南方/西方/北方/中央/海外/星际',
        details: '九界分为七大势力区域，每个区域有不同的资源、灵根偏好和势力格局。',
        relatedCharacters: ['河一', '张雷生', '玄宸']
    },
    {
        id: 5,
        name: '经济体系',
        color: 'coral',
        description: '玄石五级体系：凡→灵→真→神→星玄石',
        details: '玄石是修真界通用货币，分为五级：凡品、灵品、真品、神品、星品，形成完整的经济循环。',
        relatedCharacters: ['张雷生']
    },
    {
        id: 6,
        name: '黑暗核心设定',
        color: 'red',
        description: '灵根本源掠夺：截杀/抽源钉/夺灵大法',
        details: '通过截杀、抽源钉、夺灵大法等手段掠夺他人灵根的黑暗设定，是故事冲突的核心发动机。',
        relatedCharacters: ['玄宸', '血衍']
    },
    {
        id: 7,
        name: '天材地宝体系',
        color: 'green',
        description: '三种跨系宝药：安魂紫芝/五行均衡玉膏/续脉幽花',
        details: '三种跨系珍稀宝药：安魂紫芝、五行均衡玉膏、续脉幽花，用于平衡修炼中的各种问题。',
        relatedCharacters: ['甘承春', '灵汐']
    }
];

// ==================== 故事线数据 ====================
const storylineData = [
    {
        volume: 1,
        title: '觉醒',
        mainPlots: ['生存线：凡人出身', '地球背景'],
        subPlots: ['神秘觉醒'],
        characters: ['刘浪浪'],
        hook: '平凡少年突然发现自己与众不同'
    },
    {
        volume: 6,
        title: '兄弟聚义',
        mainPlots: ['生存线：兄弟聚首', '势力线：初建势力'],
        subPlots: ['河一、张雷生登场'],
        characters: ['刘浪浪', '河一', '张雷生'],
        hook: '三位主角正式聚义，开启宏图大业'
    },
    {
        volume: 10,
        title: '急流勇退',
        mainPlots: ['生存线：横扫六国', '人性线：功成身退'],
        subPlots: ['建立势力后选择隐退'],
        characters: ['刘浪浪', '张雷生'],
        hook: '爽点：功成名就急流勇退，开启修真之路'
    },
    {
        volume: 15,
        title: '献祭阴谋',
        mainPlots: ['回家线：揭露阴谋', '人性线：道心考验'],
        subPlots: ['发现修真界黑暗秘密'],
        characters: ['刘浪浪', '河一'],
        hook: '钩子：发现九界背后的献祭阴谋'
    },
    {
        volume: 20,
        title: '终极对决伏笔',
        mainPlots: ['生存线：兄弟对立', '回家线：地球信号'],
        subPlots: ['收到来自地球的求救信号'],
        characters: ['刘浪浪', '玄宸'],
        hook: '刚入修真界被追杀，却收到地球家人的信号'
    },
    {
        volume: 25,
        title: '灵气重构',
        mainPlots: ['生存线：重构灵气', '回家线：寻找罗布泊'],
        subPlots: ['揭开核战关联'],
        characters: ['刘浪浪', '玄宸'],
        hook: '寻找改变九界格局的关键'
    },
    {
        volume: 30,
        title: '双向圆满',
        mainPlots: ['回家线：救赎地球', '人性线：克服本性证道'],
        subPlots: ['治愈地球、人性救赎'],
        characters: ['刘浪浪', '灵汐'],
        hook: '主角与地球家人的双向圆满结局'
    }
];

// ==================== 九界数据 ====================
const realmsData = [
    {
        id: 'manhuang',
        name: '蛮荒界',
        tier: '下三界',
        position: 1,
        ling_qi: '1%',
        time_flow: '1:1（标准时间）',
        limit: '结丹期',
        race: '人类为主',
        rule: '蛮荒法则',
        description: '九界的起点，灵气稀薄，凶兽横行。人类在城池中艰难求存，强者为尊的世界。',
        environment: ['莽荒大地，山脉连绵', '凶兽横行，最强可达结丹期', '灵气稀薄，修炼困难', '人类聚居于城池之中'],
        factions: ['万兽宗（最大宗门）', '各大家族（河家、谢家等）', '散修联盟'],
        locations: [
            {'name': '万兽城', 'desc': '蛮荒界最大城池，万兽宗所在地'},
            {'name': '边陲小镇', 'desc': '河一出生地'},
            {'name': '墟界入口', 'desc': '通往墟界的界门'}
        ],
        color: '#8B7355',
        icon: '🏔️'
    },
    {
        id: 'xu',
        name: '墟界',
        subtitle: '归墟',
        tier: '下三界',
        position: 2,
        ling_qi: '5%',
        time_flow: '1:3（蛮荒界1天=墟界3天）',
        limit: '元婴期',
        race: '人类、幽灵',
        rule: '废墟法则',
        description: '上古遗迹之地，废墟遍地，时空扭曲。隐藏着上古宝藏，也潜伏着未知危险。',
        environment: ['废墟遍地，残垣断壁', '上古文明的遗迹', '时空扭曲，有些区域时间倒流', '隐藏着上古宝藏'],
        factions: ['残魂渡（神秘组织）', '废墟行者公会', '各大探险队'],
        locations: [
            {'name': '墟界石碑', 'desc': '河一触发机关的地方'},
            {'name': '残魂渡', 'desc': '神秘的渡口，连接过去与未来'},
            {'name': '上古遗迹', 'desc': '隐藏宝藏和危险'}
        ],
        color: '#6B7B8D',
        icon: '🏚️'
    },
    {
        id: 'ling',
        name: '灵界',
        tier: '中三界',
        position: 3,
        ling_qi: '15%',
        time_flow: '1:5（蛮荒界1天=灵界5天）',
        limit: '化神期',
        race: '万灵共存',
        rule: '自然法则',
        description: '万灵共生的世界，山水相依，灵气充沛。人类、精怪、花草树木皆可修炼。',
        environment: ['山水相依，灵气充沛', '万灵共存：人类、精怪、花草树木皆可修炼', '四季如春，气候宜人'],
        factions: ['万灵盟（人类与精怪联盟）', '自然神殿', '灵植培育协会'],
        locations: [],
        color: '#4CAF50',
        icon: '🌿'
    },
    {
        id: 'yao',
        name: '妖界',
        tier: '中三界',
        position: 4,
        ling_qi: '20%',
        time_flow: '1:10（蛮荒界1年=妖界1年，但妖界1年=蛮荒界10年）',
        limit: '炼虚期',
        race: '妖族为主',
        rule: '血脉法则',
        description: '妖族统治的世界，山林密布，弱肉强食。人类是少数族群，血脉决定一切。',
        environment: ['蛮荒异域，山林密布', '妖族统治，人类是少数', '弱肉强食，法则残酷'],
        factions: ['万妖国', '妖盟', '妖族十大氏族'],
        locations: [],
        color: '#FF5722',
        icon: '🐺'
    },
    {
        id: 'mo',
        name: '魔界',
        tier: '中三界',
        position: 5,
        ling_qi: '25%',
        time_flow: '扭曲不定',
        limit: '大乘期',
        race: '魔族为主',
        rule: '心魔法则',
        description: '黑暗笼罩的世界，魔气弥漫。修炼魔功必须直面心魔，黑市交易盛行。',
        environment: ['黑暗笼罩，昼夜不分', '魔气弥漫，可侵蚀心智', '空间扭曲，方向感失效'],
        factions: ['魔道十宗', '心魔殿', '黑暗议会'],
        locations: [],
        color: '#9C27B0',
        icon: '😈'
    },
    {
        id: 'xian',
        name: '仙界',
        tier: '上三界',
        position: 6,
        ling_qi: '50%',
        time_flow: '1:30（蛮荒界1天=仙界1月）',
        limit: '大乘期',
        race: '仙族',
        rule: '仙道法则',
        description: '云端之上的仙境，灵气化液，仙山连绵。等级森严，仙道正宗。',
        environment: ['云端之上，仙山连绵', '灵气化液，随处可见灵泉', '美轮美奂，如同仙境'],
        factions: ['三十六洞天', '七十二福地', '仙庭'],
        locations: [],
        color: '#2196F3',
        icon: '☁️'
    },
    {
        id: 'sheng',
        name: '圣界',
        tier: '上三界',
        position: 7,
        ling_qi: '45%',
        time_flow: '1:90（蛮荒界1天=圣界3月）',
        limit: '大乘期',
        race: '圣族',
        rule: '光明法则',
        description: '光明普照的世界，圣殿林立，秩序井然。圣族血脉才能修炼最高圣法。',
        environment: ['光明普照，没有黑暗', '圣殿林立，秩序井然', '一草一木都蕴含圣光'],
        factions: ['圣庭', '圣光教会', '十二圣殿'],
        locations: [],
        color: '#FFC107',
        icon: '✨'
    },
    {
        id: 'xu2',
        name: '虚界',
        tier: '特殊界',
        position: 8,
        ling_qi: '未知',
        time_flow: '可正可逆',
        limit: '未知',
        race: '未知',
        rule: '时空法则',
        description: '不存在于任何地图上的时空夹缝，规则紊乱，物理法则失效。极度危险！',
        environment: ['不存在于任何地图上', '时空碎片漂浮', '规则紊乱，物理法则失效'],
        factions: [],
        locations: [],
        color: '#00BCD4',
        icon: '🌀'
    },
    {
        id: 'shiyuan',
        name: '始源界',
        tier: '最高界',
        position: 9,
        ling_qi: '100%（混沌灵气）',
        time_flow: '无时间概念',
        limit: '无上限',
        race: '混沌',
        rule: '混沌法则',
        description: '万物的终点，也是起点。混沌一片，无天无地。藏着宇宙起源的秘密，九界大劫的终点。',
        environment: ['混沌一片，无天无地', '万物的终点，也是起点', '据说一切生命都起源于此'],
        factions: [],
        locations: [],
        color: '#E91E63',
        icon: '🌌',
        mystery: ['为什么九界会定期"归尘"？', '始源界中有什么？', '谁能掌控始源界，谁就能掌控九界的命运。']
    }
];

// ==================== 九界层级结构 ====================
const realmHierarchyData = {
    nodes: [
        { id: 'manhuang', name: '蛮荒界', x: 400, y: 530, color: '#8B7355', icon: '🏔️' },
        { id: 'xu', name: '墟界', x: 460, y: 410, color: '#6B7B8D', icon: '🏚️' },
        { id: 'ling', name: '灵界', x: 540, y: 290, color: '#4CAF50', icon: '🌿' },
        { id: 'yao', name: '妖界', x: 340, y: 410, color: '#FF5722', icon: '🐺' },
        { id: 'mo', name: '魔界', x: 400, y: 290, color: '#9C27B0', icon: '😈' },
        { id: 'xian', name: '仙界', x: 280, y: 170, color: '#2196F3', icon: '☁️' },
        { id: 'sheng', name: '圣界', x: 260, y: 50, color: '#FFC107', icon: '✨' },
        { id: 'xu2', name: '虚界', x: 540, y: 170, color: '#00BCD4', icon: '🌀' },
        { id: 'shiyuan', name: '始源界', x: 400, y: 50, color: '#E91E63', icon: '🌌' }
    ],
    edges: [
        { from: 'manhuang', to: 'xu', label: '万兽城西郊' },
        { from: 'xu', to: 'ling', label: '残魂渡口' },
        { from: 'ling', to: 'yao', label: '万灵山' },
        { from: 'yao', to: 'mo', label: '十万大山' },
        { from: 'mo', to: 'xian', label: '心魔渊' },
        { from: 'xian', to: 'sheng', label: '三十六洞天' },
        { from: 'sheng', to: 'xu2', label: '光明圣山' },
        { from: 'xu2', to: 'shiyuan', label: '时空夹缝' }
    ]
};

function renderRealmHierarchy() {
    let svg = document.getElementById('realm-hierarchy-svg');
    if (!svg) {
        const realmsSection = document.getElementById('realms');
        const realmsContainer = document.getElementById('realms-container');
        if (!realmsSection || !realmsContainer) return;
        const wrapper = document.createElement('div');
        wrapper.id = 'realm-hierarchy-wrapper';
        wrapper.className = 'mb-12';
        wrapper.innerHTML = `
            <h3 class="text-xl font-bold text-center mb-4" style="color: #64ffda;">九界立体层级结构</h3>
            <p class="text-center mb-6" style="color: #8892b0; font-size: 14px;">点击任意界域查看详情，连线表示界门连通方向</p>
            <div class="flex justify-center">
                <div class="w-full" style="
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 0.5px solid rgba(255, 255, 255, 0.18);
            border-radius: 32px;
            padding: 32px;
            box-shadow: 
                inset 0 1px 1px rgba(255, 255, 255, 0.15),
                inset 0 -1px 1px rgba(0, 0, 0, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.25);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        " onmouseover="this.style.transform='translateY(-5px) scale(1.01)'; this.style.boxShadow='inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.1), 0 15px 40px rgba(0,0,0,0.35), 0 0 30px #8B735520';" onmouseout="this.style.transform=''; this.style.boxShadow='inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.25)';">
                    <svg id="realm-hierarchy-svg" viewBox="0 0 800 600" class="w-full" style="max-height: 460px; background: transparent;"></svg>
                </div>
            </div>`;
        realmsSection.insertBefore(wrapper, realmsContainer);
        return renderRealmHierarchy();
    }

    svg.innerHTML = '';

    // 绘制连线（界门）
    realmHierarchyData.edges.forEach(edge => {
        const fromNode = realmHierarchyData.nodes.find(n => n.id === edge.from);
        const toNode = realmHierarchyData.nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromNode.x);
        line.setAttribute('y1', fromNode.y);
        line.setAttribute('x2', toNode.x);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('stroke', '#667eea');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        line.setAttribute('opacity', '0.6');
        svg.appendChild(line);

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY - 6);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#8892b0');
        text.setAttribute('font-size', '9');
        text.textContent = edge.label;
        svg.appendChild(text);
    });

    // 绘制节点
    realmHierarchyData.nodes.forEach(node => {
        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', node.x);
        glow.setAttribute('cy', node.y);
        glow.setAttribute('r', '38');
        glow.setAttribute('fill', node.color);
        glow.setAttribute('opacity', '0.2');
        svg.appendChild(glow);

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', '30');
        circle.setAttribute('fill', node.color);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        circle.style.cursor = 'pointer';
        circle.addEventListener('click', () => showRealmFromHierarchy(node.id));
        circle.addEventListener('mouseenter', function() { this.setAttribute('r', '35'); });
        circle.addEventListener('mouseleave', function() { this.setAttribute('r', '30'); });
        svg.appendChild(circle);

        const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        iconText.setAttribute('x', node.x);
        iconText.setAttribute('y', node.y - 4);
        iconText.setAttribute('text-anchor', 'middle');
        iconText.setAttribute('fill', '#fff');
        iconText.setAttribute('font-size', '14');
        iconText.style.cursor = 'pointer';
        iconText.addEventListener('click', () => showRealmFromHierarchy(node.id));
        iconText.textContent = node.icon;
        svg.appendChild(iconText);

        const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        nameText.setAttribute('x', node.x);
        nameText.setAttribute('y', node.y + 18);
        nameText.setAttribute('text-anchor', 'middle');
        nameText.setAttribute('fill', '#e0e0e0');
        nameText.setAttribute('font-size', '11');
        nameText.setAttribute('font-weight', 'bold');
        nameText.style.cursor = 'pointer';
        nameText.addEventListener('click', () => showRealmFromHierarchy(node.id));
        nameText.textContent = node.name;
        svg.appendChild(nameText);
    });
}

function showRealmFromHierarchy(realmId) {
    const target = document.getElementById('realm-detail-' + realmId);
    if (!target) return;
    target.closest('.realm-card').scrollIntoView({ behavior: 'smooth' });
    target.classList.remove('hidden');
}

// ==================== 核心功能 ====================

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    state.characters = charactersData;
    state.systems = systemsData;
    state.realms = realmsData;
    state.storylines = storylineData;
    
    renderCharacters();
    renderSystems();
    renderRealms();
    renderStorylines();
    renderRealmHierarchy();
    initSearch();
    initFilters();
    
    console.log('九界修真百科系统初始化完成');
});

// 滚动到指定区块
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 渲染人物卡牌
function renderCharacters() {
    const container = document.querySelector('#characters .grid');
    if (!container) return;
    
    const filtered = state.characters.filter(char => {
        const matchCamp = state.filters.camp === 'all' || char.camp === state.filters.camp;
        const matchSearch = char.name.includes(state.filters.search) || 
                            char.identity.includes(state.filters.search);
        return matchCamp && matchSearch;
    });
    
    container.innerHTML = filtered.map(char => `
        <div class="character-card" 
             onclick="${char.storyPage ? `window.location.href='${char.storyPage}'` : `showCharacterDetail('${char.id}')`}"
             style="cursor: pointer;">
        <div class="h-48 flex items-center justify-center" style="background: linear-gradient(135deg, ${getCampColor(char.camp)});">
            ${char.avatar 
                ? `<img src="${char.avatar}" alt="${char.name}" class="w-32 h-auto rounded-xl object-contain" style="box-shadow: 0 8px 24px rgba(0,0,0,0.3); max-height: 140px;">`
                : `<span class="text-4xl">${char.emoji}</span>`
            }
            </div>
            <div class="p-3">
                <h3 class="font-bold text-lg" style="color: #ccd6f6;">${char.name}</h3>
                <p class="text-sm" style="color: #8892b0;">${char.campName}</p>
                ${char.storyPage ? '<p class="text-xs mt-1" style="color: #64ffda;">📖 点击查看故事</p>' : ''}
            </div>
        </div>
    `).join('');
}

// 获取阵营颜色
function getCampColor(camp) {
    const colors = {
        protagonist: 'rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)',
        antagonist: 'rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2)',
        love: 'rgba(236, 72, 153, 0.2), rgba(159, 42, 99, 0.2)',
        special: 'rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.2)',
        neutral: 'rgba(245, 158, 11, 0.2), rgba(202, 138, 4, 0.2)'
    };
    return colors[camp] || colors.special;
}

// 显示人物详情
function showCharacterDetail(charId) {
    const char = state.characters.find(c => c.id === charId);
    if (!char) return;
    
    state.currentCharacter = char;
    
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    // 设置标题（支持头像图片）
    if (char.avatar) {
        title.innerHTML = `<img src="${char.avatar}" alt="${char.name}" class="w-16 h-auto rounded-xl inline-block mr-2 align-middle" style="box-shadow: 0 4px 12px rgba(0,0,0,0.3);"> ${char.name}`;
    } else {
        title.textContent = `${char.emoji} ${char.name}`;
    }
    content.innerHTML = `
        <div class="space-y-6" style="color: #ccd6f6;">
            <!-- 基本信息 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">基本信息</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <span class="text-sm" style="color: #8892b0;">阵营</span>
                        <p class="font-medium" style="color: #e0e0e0;">${char.campName}</p>
                    </div>
                    <div>
                        <span class="text-sm" style="color: #8892b0;">身份</span>
                        <p class="font-medium" style="color: #e0e0e0;">${char.identity}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <span class="text-sm" style="color: #8892b0;">性格</span>
                    <p style="color: #ccd6f6;">${char.personality}</p>
                </div>
            </div>
            
            <!-- 能力 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">核心能力</h3>
                <div class="flex flex-wrap gap-2">
                    ${char.abilities.map(a => `<span class="px-3 py-1 rounded-full text-sm" style="background: rgba(139, 92, 246, 0.2); color: #a78bfa;">${a}</span>`).join('')}
                </div>
            </div>
            
            <!-- 人物弧光 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">人物弧光</h3>
                <p style="color: #ccd6f6;">${char.arc}</p>
            </div>
            
            <!-- 体系位置 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">在体系中的位置</h3>
                <div class="flex flex-wrap gap-2">
                    ${char.systems.map(s => `<span class="px-3 py-1 rounded-full text-sm" style="background: rgba(96, 165, 250, 0.2); color: #60a5fa;">${s}</span>`).join('')}
                </div>
            </div>
            
            <!-- 关系图谱 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">人物关系图谱</h3>
                <div id="relationship-graph" class="mb-4">
                    ${renderMiniGraph(char)}
                </div>
                <div class="space-y-2">
                    ${char.relations.map(r => `
                        <div class="flex items-center justify-between p-2 rounded-lg" style="background: rgba(255, 255, 255, 0.05);">
                            <span class="cursor-pointer font-medium" style="color: #60a5fa;" onclick="showCharacterDetail('${r.id}')">${r.name}</span>
                            <span class="px-2 py-1 text-xs rounded ${
                                r.type === 'brother' ? 'relation-brother' :
                                r.type === 'enemy' ? 'relation-enemy' :
                                r.type === 'lover' ? 'relation-lover' :
                                r.type === 'mentor' ? 'relation-mentor' :
                                'relation-ally'
                            }">${
                                r.type === 'brother' ? '兄弟' :
                                r.type === 'enemy' ? '宿敌' :
                                r.type === 'lover' ? '道侣' :
                                r.type === 'mentor' ? '导师' : '盟友'
                            }</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 相关剧情 -->
            <div class="p-4 rounded-xl" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">相关剧情</h3>
                <ul class="list-disc list-inside space-y-1">
                    ${char.stories.map(s => `<li style="color: #8892b0;">${s}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');

    // 初始化关系图谱拖拽交互
    requestAnimationFrame(() => {
        const svg = document.getElementById('relationGraphSvg');
        if (svg) initGraphDrag(svg);
    });
}

// ==================== 关系图谱拖拽交互 ====================
let graphDrag = {
    active: false,
    nodeIndex: -1,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    moved: false
};

function getSVGCoordinates(svg, clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function handleGraphNodeClick(event, charId) {
    if (graphDrag.moved) {
        event.stopPropagation();
        return;
    }
    showCharacterDetail(charId);
}

function initGraphDrag(svg) {
    if (!svg || svg._dragInited) return;
    svg._dragInited = true;

    svg.addEventListener('mousedown', (e) => {
        const node = e.target.closest('.graph-node');
        if (!node) return;

        const coords = getSVGCoordinates(svg, e.clientX, e.clientY);
        graphDrag = {
            active: true,
            nodeIndex: parseInt(node.dataset.index),
            startX: coords.x,
            startY: coords.y,
            currentX: parseFloat(node.dataset.ox),
            currentY: parseFloat(node.dataset.oy),
            moved: false
        };

        node.style.cursor = 'grabbing';
        e.preventDefault();
    });

    svg.addEventListener('mousemove', (e) => {
        if (!graphDrag.active) return;

        const coords = getSVGCoordinates(svg, e.clientX, e.clientY);
        const dx = coords.x - graphDrag.startX;
        const dy = coords.y - graphDrag.startY;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            graphDrag.moved = true;
        }

        const newX = graphDrag.currentX + dx;
        const newY = graphDrag.currentY + dy;
        const idx = graphDrag.nodeIndex;

        // 更新节点 transform
        const node = svg.querySelector(`.graph-node[data-index="${idx}"]`);
        if (node) {
            node.setAttribute('transform', `translate(${dx}, ${dy})`);
        }

        // 更新连线终点
        const centerX = 160, centerY = 110;
        const lineGlow = svg.querySelector(`.graph-line-glow[data-line-index="${idx}"]`);
        const lineDash = svg.querySelector(`.graph-line-dash[data-line-index="${idx}"]`);
        if (lineGlow) { lineGlow.setAttribute('x2', newX); lineGlow.setAttribute('y2', newY); }
        if (lineDash) { lineDash.setAttribute('x2', newX); lineDash.setAttribute('y2', newY); }

        // 更新图标位置
        const midX = (centerX + newX) / 2;
        const midY = (centerY + newY) / 2;
        const iconBg = svg.querySelector(`.graph-icon-bg[data-icon-index="${idx}"]`);
        const iconText = svg.querySelector(`.graph-icon-text[data-icon-index="${idx}"]`);
        if (iconBg) { iconBg.setAttribute('cx', midX); iconBg.setAttribute('cy', midY); }
        if (iconText) { iconText.setAttribute('x', midX); iconText.setAttribute('y', midY + 1.8); }
    });

    svg.addEventListener('mouseup', () => {
        if (!graphDrag.active) return;
        graphDrag.active = false;

        const node = svg.querySelector(`.graph-node[data-index="${graphDrag.nodeIndex}"]`);
        if (node) {
            node.style.cursor = 'grab';
            // 固化 transform 到实际坐标
            if (graphDrag.moved) {
                const transform = node.getAttribute('transform');
                const match = transform && transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    const finalX = graphDrag.currentX + parseFloat(match[1]);
                    const finalY = graphDrag.currentY + parseFloat(match[2]);
                    node.dataset.ox = finalX;
                    node.dataset.oy = finalY;
                    node.removeAttribute('transform');

                    // 更新内部子元素坐标
                    const circles = node.querySelectorAll('circle');
                    const text = node.querySelector('text');
                    circles.forEach(c => {
                        c.setAttribute('cx', finalX);
                        c.setAttribute('cy', finalY);
                    });
                    if (text) {
                        const name = text.textContent;
                        const textY = finalY + (name.length <= 2 ? 3.5 : 2.8);
                        text.setAttribute('x', finalX);
                        text.setAttribute('y', textY);
                    }
                }
            }
        }
    });

    svg.addEventListener('mouseleave', () => {
        if (graphDrag.active) {
            svg.dispatchEvent(new Event('mouseup'));
        }
    });
}

// 渲染迷你关系图谱
function renderMiniGraph(char) {
    const relCount = char.relations.length;
    if (relCount === 0) return '<p class="text-center" style="color: #8892b0;">暂无关系数据</p>';

    const canvasWidth = 320;
    const canvasHeight = 220;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const centerRadius = 26;
    const nodeRadius = 22;

    const minRadius = Math.min(70, (Math.min(canvasWidth, canvasHeight) / 2) - nodeRadius - 20);
    const maxRadius = Math.min(100, (Math.min(canvasWidth, canvasHeight) / 2) - nodeRadius - 10);
    const radiusStep = relCount > 1 ? (maxRadius - minRadius) / (relCount - 1) : 0;

    const svgFilters = `
        <defs>
            <filter id="frostedGlass" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                    values="1 0 0 0 0.1
                            0 1 0 0 0.1
                            0 0 1 0 0.15
                            0 0 0 0.85 0" result="frosted"/>
                <feComposite in="SourceGraphic" in2="frosted" operator="over"/>
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
    `;

    let svg = `<svg id="relationGraphSvg" viewBox="0 0 ${canvasWidth} ${canvasHeight}" class="w-full" style="min-height: 220px; max-height: 260px; user-select: none;">${svgFilters}`;

    // 预计算所有外围节点位置
    const positions = char.relations.map((rel, index) => {
        const angle = (index / relCount) * Math.PI * 2 - Math.PI / 2;
        const baseR = minRadius + index * radiusStep;
        const variation = (index % 2 === 0 ? 6 : -4);
        const radius = baseR + variation;
        return {
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius * 0.92,
            rel: rel,
            color: getRelationColor(rel.type)
        };
    });

    // 绘制关系线 + 图标
    positions.forEach((pos, index) => {
        const midX = (centerX + pos.x) / 2;
        const midY = (centerY + pos.y) / 2;
        const icon = getRelationIcon(pos.rel.type);

        svg += `<line class="graph-line graph-line-glow" data-line-index="${index}"
                    x1="${centerX}" y1="${centerY}" x2="${pos.x}" y2="${pos.y}"
                    stroke="${pos.color}" stroke-width="3" opacity="0.15" filter="url(#glow)"/>`;
        svg += `<line class="graph-line graph-line-dash" data-line-index="${index}"
                    x1="${centerX}" y1="${centerY}" x2="${pos.x}" y2="${pos.y}"
                    stroke="${pos.color}" stroke-width="1.5" opacity="0.6"
                    stroke-dasharray="4,3" stroke-linecap="round"/>`;
        svg += `<circle class="graph-icon-bg" data-icon-index="${index}"
                    cx="${midX}" cy="${midY}" r="5.5" fill="rgba(0,0,0,0.7)" stroke="${pos.color}" stroke-width="1"/>`;
        svg += `<text class="graph-icon-text" data-icon-index="${index}"
                    x="${midX}" y="${midY + 1.8}" text-anchor="middle" font-size="5.5" fill="${pos.color}">${icon}</text>`;
    });

    // 绘制外围节点（可拖拽 + 可点击）
    positions.forEach((pos, index) => {
        const name = pos.rel.name;
        const fontSize = name.length <= 2 ? 10 : 8;
        const textY = pos.y + (name.length <= 2 ? 3.5 : 2.8);
        const targetChar = charactersData.find(c => c.id === pos.rel.id);
        const clickAction = targetChar ? `onclick="handleGraphNodeClick(event, '${pos.rel.id}')"` : '';

        svg += `<g class="graph-node" data-index="${index}" data-char-id="${pos.rel.id}" data-ox="${pos.x}" data-oy="${pos.y}" style="cursor: grab;">
            <circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" fill="${pos.color}" filter="url(#frostedGlass)" opacity="0.85"/>
            <circle cx="${pos.x}" cy="${pos.y}" r="${nodeRadius}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
            <text x="${pos.x}" y="${textY}" text-anchor="middle" font-size="${fontSize}" fill="white" font-weight="600" ${clickAction}>${name}</text>
        </g>`;
    });

    // 中心节点（主角）
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius + 3}" fill="rgba(102,126,234,0.2)" filter="url(#glow)"/>`;
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius}" fill="#667eea" filter="url(#frostedGlass)" opacity="0.95"/>`;
    svg += `<circle cx="${centerX}" cy="${centerY}" r="${centerRadius}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/>`;

    const centerName = char.name;
    const centerFontSize = centerName.length <= 2 ? 12 : 10;
    const centerTextY = centerY + (centerName.length <= 2 ? 4 : 3);
    svg += `<text x="${centerX}" y="${centerTextY}" text-anchor="middle" font-size="${centerFontSize}" fill="white" font-weight="bold">${centerName}</text>`;

    svg += '</svg>';
    return svg;
}

// 获取点划线类型
function getDashType(type) {
    const dashTypes = {
        brother: '4,3',      // 兄弟 - 长虚线
        enemy: '2,2',        // 敌人 - 短密集虚线
        lover: '2,2,6,2',    // 道侣 - 点划线
        mentor: '1,2',        // 导师 - 点线
        ally: '3,2'          // 盟友 - 中等虚线
    };
    return dashTypes[type] || '4,3';
}

// 获取关系图标
function getRelationIcon(type) {
    const icons = {
        brother: '👥',
        enemy: '⚔',
        lover: '♥',
        mentor: '★',
        ally: '◆'
    };
    return icons[type] || '●';
}

// 获取关系颜色
function getRelationColor(type) {
    const colors = {
        brother: '#3B82F6',
        enemy: '#EF4444',
        lover: '#EC4899',
        mentor: '#8B5CF6',
        ally: '#10B981'
    };
    return colors[type] || '#6B7280';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('character-modal').classList.add('hidden');
    state.currentCharacter = null;
}

// 点击弹窗背景关闭
document.getElementById('character-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'character-modal') {
        closeModal();
    }
});

// 渲染体系图
function renderSystems() {
    const container = document.querySelector('#systems .space-y-6');
    if (!container) return;
    
    const colors = [
        { bg: 'rgba(139, 92, 246, 0.2)', border: '#a78bfa', text: '#a78bfa' },
        { bg: 'rgba(96, 165, 250, 0.2)', border: '#60a5fa', text: '#60a5fa' },
        { bg: 'rgba(52, 211, 153, 0.2)', border: '#34d399', text: '#34d399' },
        { bg: 'rgba(251, 191, 36, 0.2)', border: '#fbbf24', text: '#fbbf24' },
        { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#f97316' },
        { bg: 'rgba(248, 113, 113, 0.2)', border: '#f87171', text: '#f87171' },
        { bg: 'rgba(74, 222, 128, 0.2)', border: '#4ade80', text: '#4ade80' }
    ];
    
    container.innerHTML = `
        <div class="rounded-xl p-6" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px);">
            <h3 class="text-xl font-semibold mb-4" style="color: #ccd6f6;">七层递进结构</h3>
            <div class="flex flex-col space-y-4">
                ${state.systems.map((sys, index) => {
                    const c = colors[index] || colors[0];
                    return `
                    <div class="system-layer flex items-center p-4 rounded-lg cursor-pointer" 
                         style="background: ${c.bg}; border-left: 4px solid ${c.border};"
                         onclick="showSystemDetail(${sys.id})">
                        <span class="w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4" 
                              style="background: ${c.border}; color: #1a1a2e;">${index + 1}</span>
                        <div class="flex-1">
                            <h4 class="font-bold" style="color: ${c.text};">${sys.name}</h4>
                            <p class="text-sm" style="color: #8892b0;">${sys.description}</p>
                        </div>
                        <span style="color: ${c.border};">→</span>
                    </div>
                `}).join('')}
            </div>
        </div>
        
        <!-- 灵根测试入口 -->
        <div class="rounded-xl p-6 text-white" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));">
            <h3 class="text-xl font-semibold mb-2">🧪 灵根测试</h3>
            <p class="mb-4 opacity-90">根据设定测试你的灵根属性</p>
            <button onclick="startLinggenTest()" class="px-6 py-2 rounded-full font-bold" style="background: rgba(100, 255, 218, 0.9); color: #1a1a2e;">
                开始测试 →
            </button>
        </div>
    `;
}

// 显示体系详情
function showSystemDetail(sysId) {
    const sys = state.systems.find(s => s.id === sysId);
    if (!sys) return;
    
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = sys.name;
    title.style.color = '#64ffda';
    content.innerHTML = `
        <div class="space-y-6">
            <div class="rounded-xl p-4" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">体系说明</h3>
                <p style="color: #ccd6f6;">${sys.details}</p>
            </div>
            
            <div class="rounded-xl p-4" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
                <h3 class="font-bold text-lg mb-2" style="color: #64ffda;">相关人物</h3>
                <div class="flex flex-wrap gap-2">
                    ${sys.relatedCharacters.map(c => `
                        <span class="px-3 py-1 rounded-full text-sm cursor-pointer" 
                              style="background: rgba(96, 165, 250, 0.2); color: #60a5fa;"
                              onclick="showCharacterDetail('${getCharId(c)}')">${c}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// 根据名字获取角色ID
function getCharId(name) {
    const char = state.characters.find(c => c.name === name);
    return char ? char.id : '';
}

// 渲染故事线
function renderStorylines() {
    const container = document.querySelector('#story .space-y-4');
    if (!container) return;
    
    // 渲染三条主线
    const mainPlots = [
        { id: 'survival', name: '生存+势力线', color: 'red', plot: '凡人建势力→统战国→修真探九界→九界守护者' },
        { id: 'home', name: '回家+救赎线', color: 'blue', plot: '寻罗布泊之眼→揭核战关联→救地球家人→治愈地球' },
        { id: 'humanity', name: '人性+道线', color: 'green', plot: '人性黑暗与光辉→修仙即修心→克服本性证道' }
    ];
    
    const storySection = document.querySelector('#story');
    
    // 插入时间轴
    const timelineHTML = `
        <div class="rounded-xl p-6 mb-8" style="background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.1);">
            <h3 class="text-xl font-semibold mb-6" style="color: #64ffda;">📅 30卷时间轴</h3>
            <div class="timeline-container">
                ${state.storylines.map(s => `
                    <div class="timeline-item" style="background: rgba(255, 255, 255, 0.06);">
                        <div class="flex justify-between items-start mb-2">
                            <span class="px-3 py-1 rounded-full text-sm font-bold" style="background: ${getPlotBg(s)}; color: ${getPlotColor(s)};">
                                第${s.volume}卷
                            </span>
                            <span class="text-sm" style="color: #8892b0;">${s.title}</span>
                        </div>
                        <h4 class="font-bold mb-2" style="color: #ccd6f6;">${s.title}</h4>
                        <p class="text-sm mb-2" style="color: #8892b0;">${s.mainPlots.join(' | ')}</p>
                        <p class="text-sm" style="color: #ff9f1c;">🎣 钩子：${s.hook}</p>
                        <div class="mt-2">
                            ${s.characters.map(c => `
                                <span class="inline-block px-2 py-0.5 rounded text-xs mr-1" style="background: rgba(255, 255, 255, 0.1); color: #8892b0;">${c}</span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    storySection.insertAdjacentHTML('afterbegin', timelineHTML);
}

// 渲染九界
function renderRealms() {
    const container = document.getElementById('realms-container');
    if (!container) return;
    
    container.innerHTML = state.realms.map((realm, index) => `
        <div class="realm-card" style="
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 0.5px solid rgba(255, 255, 255, 0.18);
            border-radius: 32px;
            padding: 32px;
            box-shadow: 
                inset 0 1px 1px rgba(255, 255, 255, 0.15),
                inset 0 -1px 1px rgba(0, 0, 0, 0.1),
                0 8px 32px rgba(0, 0, 0, 0.25);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        " onmouseover="this.style.transform='translateY(-5px) scale(1.01)'; this.style.boxShadow='inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.1), 0 15px 40px rgba(0,0,0,0.35), 0 0 30px ${realm.color}40';"
           onmouseout="this.style.transform=''; this.style.boxShadow='inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.25)';"
           onclick="toggleRealmDetail('${realm.id}')">
            
            <!-- 界的层级标签 -->
            <div class="flex justify-between items-start mb-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold" style="background: rgba(255,255,255,0.1); color: #8892b0;">
                    ${realm.tier}
                </span>
                <span class="text-3xl">${realm.icon}</span>
            </div>
            
            <!-- 界名与序号 -->
            <div class="flex items-center mb-3">
                <span class="text-4xl font-bold mr-3" style="color: ${realm.color};">${realm.position}</span>
                <div>
                    <h3 class="text-xl font-bold" style="color: #ccd6f6;">${realm.name}</h3>
                    ${realm.subtitle ? `<p class="text-sm" style="color: #8892b0;">${realm.subtitle}</p>` : ''}
                </div>
            </div>
            
            <!-- 核心属性 -->
            <div class="space-y-2 mb-4 text-sm">
                <div class="flex justify-between">
                    <span style="color: #8892b0;">灵气浓度</span>
                    <span style="color: #64ffda; font-weight: 600;">${realm.ling_qi}</span>
                </div>
                <div class="flex justify-between">
                    <span style="color: #8892b0;">时间流速</span>
                    <span style="color: #ccd6f6; font-size: 0.85rem;">${realm.time_flow}</span>
                </div>
                <div class="flex justify-between">
                    <span style="color: #8892b0;">修炼上限</span>
                    <span style="color: #ff9f1c; font-weight: 600;">${realm.limit}</span>
                </div>
                <div class="flex justify-between">
                    <span style="color: #8892b0;">主要种族</span>
                    <span style="color: #ccd6f6;">${realm.race}</span>
                </div>
                <div class="flex justify-between">
                    <span style="color: #8892b0;">核心法则</span>
                    <span style="color: ${realm.color}; font-weight: 600;">${realm.rule}</span>
                </div>
            </div>
            
            <!-- 描述 -->
            <p class="text-sm mb-4" style="color: #8892b0; line-height: 1.6;">${realm.description}</p>
            
            <!-- 展开详情按钮 -->
            <div class="text-center">
                <span class="text-xs" style="color: #64ffda; opacity: 0.8;">点击查看详情 →</span>
            </div>
            
            <!-- 详情区域（默认隐藏） -->
            <div id="realm-detail-${realm.id}" class="hidden mt-4 pt-4" style="border-top: 0.5px solid rgba(255, 255, 255, 0.1);">
                ${realm.environment.length > 0 ? `
                    <div class="mb-3">
                        <h4 class="text-sm font-bold mb-2" style="color: #64ffda;">🌍 环境特征</h4>
                        ${realm.environment.map(e => `
                            <p class="text-xs mb-1" style="color: #8892b0;">• ${e}</p>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${realm.factions.length > 0 ? `
                    <div class="mb-3">
                        <h4 class="text-sm font-bold mb-2" style="color: #64ffda;">⚔️ 主要势力</h4>
                        ${realm.factions.map(f => `
                            <span class="inline-block px-2 py-1 rounded-lg text-xs mr-1 mb-1" style="background: rgba(255,255,255,0.08); color: #ccd6f6;">${f}</span>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${realm.locations.length > 0 ? `
                    <div class="mb-3">
                        <h4 class="text-sm font-bold mb-2" style="color: #64ffda;">📍 重要地点</h4>
                        ${realm.locations.map(l => `
                            <div class="mb-2 p-2 rounded-lg" style="background: rgba(255,255,255,0.06);">
                                <p class="text-xs font-bold" style="color: #ccd6f6;">${l.name}</p>
                                <p class="text-xs" style="color: #8892b0;">${l.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${realm.mystery ? `
                    <div class="mt-3 p-3 rounded-lg" style="background: rgba(233, 30, 99, 0.1); border: 0.5px solid rgba(233, 30, 99, 0.3);">
                        <h4 class="text-sm font-bold mb-2" style="color: #e91e63;">🔮 终极之谜</h4>
                        ${realm.mystery.map(m => `
                            <p class="text-xs mb-1" style="color: #f48fb1;">${m}</p>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// 切换九界详情显示
function toggleRealmDetail(realmId) {
    const detail = document.getElementById('realm-detail-' + realmId);
    if (detail) {
        detail.classList.toggle('hidden');
    }
}

// 获取剧情颜色
function getPlotColor(story) {
    if (story.mainPlots.some(p => p.includes('生存线') || p.includes('势力线'))) return '#f87171';
    if (story.mainPlots.some(p => p.includes('回家线'))) return '#60a5fa';
    if (story.mainPlots.some(p => p.includes('人性线'))) return '#4ade80';
    return '#8892b0';
}

// 获取剧情背景色
function getPlotBg(story) {
    if (story.mainPlots.some(p => p.includes('生存线') || p.includes('势力线'))) return 'rgba(248, 113, 113, 0.2)';
    if (story.mainPlots.some(p => p.includes('回家线'))) return 'rgba(96, 165, 250, 0.2)';
    if (story.mainPlots.some(p => p.includes('人性线'))) return 'rgba(74, 222, 128, 0.2)';
    return 'rgba(136, 155, 176, 0.2)';
}

// 初始化搜索
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.filters.search = e.target.value;
            renderCharacters();
        });
    }
}

// 初始化筛选
function initFilters() {
    // 筛选按钮逻辑
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filters.camp = btn.dataset.camp;
            renderCharacters();
        });
    });
}

// 灵根测试
function startLinggenTest() {
    const modal = document.getElementById('character-modal');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = '🧪 灵根测试';
    content.innerHTML = `
        <div id="test-container" class="space-y-6">
            <div class="bg-purple-50/80 backdrop-blur-sm rounded-xl p-4">
                <p class="text-center text-lg mb-4">问题 1/5：你更擅长吸收哪种能量？</p>
                <div class="grid grid-cols-2 gap-3">
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-purple-200 hover:border-purple-500 transition" onclick="answerTest('木')">🪵 木能 - 生命成长</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-red-200 hover:border-red-500 transition" onclick="answerTest('火')">🔥 火能 - 热烈爆发</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-gray-200 hover:border-gray-500 transition" onclick="answerTest('金')">⚔️ 金能 - 锐利坚硬</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-blue-200 hover:border-blue-500 transition" onclick="answerTest('水')">💧 水能 - 灵活适应</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-yellow-200 hover:border-yellow-500 transition" onclick="answerTest('土')">🏔️ 土能 - 稳重厚重</button>
                    <button class="p-3 bg-white/90 rounded-lg border-2 border-indigo-200 hover:border-indigo-500 transition col-span-2" onclick="answerTest('宇宙')">✨ 宇宙能 - 超越五行</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    
    window.testAnswers = [];
}

function answerTest(element) {
    window.testAnswers.push(element);
    
    const questions = [
        '你更擅长吸收哪种能量？',
        '你的修炼风格更倾向于？',
        '面对强敌你会？',
        '你的终极目标是？',
        '你的心性更接近？'
    ];
    
    const options = [
        ['木', '火', '金', '水', '土', '宇宙'],
        ['稳扎稳打', '爆发输出', '以柔克刚', '灵活多变', '厚积薄发', '超越常规'],
        ['正面硬刚', '智取周旋', '防守反击', '寻找队友', '战略撤退', '打破规则'],
        ['成为至强者', '守护重要的人', '探究真理', '逍遥自在', '拯救苍生', '超越一切'],
        ['刚正不阿', '热血冲动', '冷静理智', '圆滑世故', '淡泊名利', '叛逆不羁']
    ];
    
    if (window.testAnswers.length < 5) {
        const container = document.getElementById('test-container');
        const qIndex = window.testAnswers.length;
        const colorClass = ['purple', 'blue', 'teal', 'amber', 'green'][qIndex];
        
        container.innerHTML = `
            <div class="bg-${colorClass}-50/80 backdrop-blur-sm rounded-xl p-4">
                <p class="text-center text-lg mb-4">问题 ${qIndex + 1}/5：${questions[qIndex]}</p>
                <div class="grid grid-cols-2 gap-3">
                    ${options[qIndex].map(opt => `
                        <button class="p-3 bg-white/90 rounded-lg border-2 border-${colorClass}-200 hover:border-${colorClass}-500 transition"
                                onclick="answerTest('${opt}')">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        showTestResult();
    }
}

function showTestResult() {
    const container = document.getElementById('test-container');
    
    // 分析答案
    const counts = { '木': 0, '火': 0, '金': 0, '水': 0, '土': 0, '宇宙': 0 };
    window.testAnswers.forEach(a => counts[a] = (counts[a] || 0) + 1);
    
    const elements = Object.entries(counts)
        .filter(([k, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([k]) => k);
    
    let result = '';
    let description = '';
    let grade = '';
    
    if (elements.includes('宇宙')) {
        result = '五灵根圆满 + 宇宙根';
        description = '传说中超越五行的完美灵根，注定成为改变九界格局的存在！';
        grade = '传说级';
    } else if (elements.length === 5) {
        result = '五灵根俱全';
        description = '五行均衡，万法皆通，是顶级修炼天才！';
        grade = '史诗级';
    } else if (elements.length >= 3) {
        result = elements.join('') + '多灵根';
        description = `拥有${elements.join('、')}灵根，修炼潜力优异！`;
        grade = '稀有级';
    } else {
        result = elements.join('') + '灵根';
        description = `擅长${elements.join('和')}能量的修炼！`;
        grade = '普通级';
    }
    
    container.innerHTML = `
        <div class="text-center">
            <div class="linggen-result mb-6">
                <p class="text-sm opacity-80 mb-2">你的灵根类型</p>
                <p class="text-3xl font-bold mb-4">${result}</p>
                <p class="text-sm opacity-80">评级：${grade}</p>
            </div>
            
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-left">
                <h4 class="font-bold mb-2">灵根分析</h4>
                <p class="text-gray-700">${description}</p>
                
                <h4 class="font-bold mt-4 mb-2">建议修炼方向</h4>
                <p class="text-gray-700">
                    ${elements.includes('木') ? '• 木能修炼：偏向生命恢复和成长型功法<br>' : ''}
                    ${elements.includes('火') ? '• 火能修炼：偏向爆发攻击型功法<br>' : ''}
                    ${elements.includes('金') ? '• 金能修炼：偏向锐利攻击型功法<br>' : ''}
                    ${elements.includes('水') ? '• 水能修炼：偏向灵活适应型功法<br>' : ''}
                    ${elements.includes('土') ? '• 土能修炼：偏向防御持久型功法<br>' : ''}
                    ${elements.includes('宇宙') ? '• 宇宙能修炼：超越五行，探索未知领域<br>' : ''}
                </p>
            </div>
            
            <button onclick="closeModal()" class="mt-6 px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition">
                关闭
            </button>
        </div>
    `;
    
    window.testAnswers = [];
}

// ESC键关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});