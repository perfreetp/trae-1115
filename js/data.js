const mockData = {
    spaces: [
        { id: 1, name: '地下商场A区', type: '商场', area: 2500, floors: 2, address: '人民路128号', manager: '张三', phone: '13800138001', status: 'normal', merchantCount: 35, capacity: 800, lastInspection: '2024-01-15', riskLevel: 'medium' },
        { id: 2, name: '地下通道1号', type: '通道', area: 800, floors: 1, address: '中山路与解放路交叉口', manager: '李四', phone: '13800138002', status: 'normal', merchantCount: 0, capacity: 200, lastInspection: '2024-01-16', riskLevel: 'low' },
        { id: 3, name: '地下车库B区', type: '车库', area: 5000, floors: 3, address: '建设路56号', manager: '王五', phone: '13800138003', status: 'warning', merchantCount: 0, capacity: 300, lastInspection: '2024-01-14', riskLevel: 'high' },
        { id: 4, name: '地下商场C区', type: '商场', area: 3200, floors: 2, address: '和平路88号', manager: '赵六', phone: '13800138004', status: 'normal', merchantCount: 48, capacity: 1000, lastInspection: '2024-01-15', riskLevel: 'medium' },
        { id: 5, name: '地铁换乘通道', type: '通道', area: 1200, floors: 1, address: '地铁站2号线', manager: '孙七', phone: '13800138005', status: 'danger', merchantCount: 2, capacity: 500, lastInspection: '2024-01-10', riskLevel: 'critical' },
        { id: 6, name: '地下物流中心', type: '仓库', area: 4500, floors: 1, address: '开发区工业园', manager: '周八', phone: '13800138006', status: 'normal', merchantCount: 0, capacity: 100, lastInspection: '2024-01-12', riskLevel: 'low' }
    ],

    inspections: [
        { id: 1, title: '月度安全巡查', space: '地下商场A区', type: '日常巡查', inspector: '张三', startDate: '2024-01-15', endDate: '2024-01-15', status: 'completed', items: 25, completed: 25, issues: 2 },
        { id: 2, title: '消防专项检查', space: '地下车库B区', type: '专项检查', inspector: '李四', startDate: '2024-01-16', endDate: '2024-01-16', status: 'in_progress', items: 30, completed: 18, issues: 4 },
        { id: 3, title: '节前安全大检查', space: '地下通道1号', type: '综合检查', inspector: '王五', startDate: '2024-01-17', endDate: '2024-01-18', status: 'pending', items: 40, completed: 0, issues: 0 },
        { id: 4, title: '排水系统检查', space: '地下商场C区', type: '专项检查', inspector: '赵六', startDate: '2024-01-14', endDate: '2024-01-14', status: 'completed', items: 15, completed: 15, issues: 1 },
        { id: 5, title: '监控系统排查', space: '地铁换乘通道', type: '专项检查', inspector: '孙七', startDate: '2024-01-10', endDate: '2024-01-11', status: 'completed', items: 20, completed: 20, issues: 6 }
    ],

    hazards: [
        { id: 1, title: '消防通道堵塞', space: '地下商场A区', location: 'A区3号出口', level: 'critical', type: '通道占用', discoverer: '张三', discoverDate: '2024-01-15', status: 'pending', handler: '物业王经理', deadline: '2024-01-17', description: '消防通道被商户堆放的货物堵塞，影响紧急疏散' },
        { id: 2, title: '应急照明故障', space: '地下车库B区', location: 'B2层西区', level: 'high', type: '照明故障', discoverer: '李四', discoverDate: '2024-01-16', status: 'processing', handler: '工程部', deadline: '2024-01-18', description: '多处应急照明灯不亮，需更换电池' },
        { id: 3, title: '消防门无法关闭', space: '地铁换乘通道', location: '换乘口2号门', level: 'critical', type: '消防设施', discoverer: '孙七', discoverDate: '2024-01-10', status: 'processing', handler: '消防维保单位', deadline: '2024-01-13', description: '防火门闭门器损坏，门无法自动关闭' },
        { id: 4, title: '监控盲区', space: '地下通道1号', location: '通道中段转角', level: 'medium', type: '监控设施', discoverer: '王五', discoverDate: '2024-01-12', status: 'pending', handler: '安保部门', deadline: '2024-01-20', description: '转角处存在监控盲区，约5米范围无覆盖' },
        { id: 5, title: '排水泵异常', space: '地下车库B区', location: 'B3层集水井', level: 'high', type: '排水设施', discoverer: '李四', discoverDate: '2024-01-16', status: 'resolved', handler: '工程部', deadline: '2024-01-17', description: '2号排水泵有异常噪音，需检修' },
        { id: 6, title: '消火栓被遮挡', space: '地下商场C区', location: 'C区美食街', level: 'high', type: '消防设施', discoverer: '赵六', discoverDate: '2024-01-14', status: 'resolved', handler: '商户管理部', deadline: '2024-01-15', description: '消火栓被广告牌遮挡，需立即移除' }
    ],

    equipment: {
        fireDoors: [
            { id: 1, name: 'A区1号消防门', space: '地下商场A区', location: '主通道东口', status: 'normal', lastCheck: '2024-01-15', nextCheck: '2024-02-15' },
            { id: 2, name: 'A区2号消防门', space: '地下商场A区', location: '主通道西口', status: 'normal', lastCheck: '2024-01-15', nextCheck: '2024-02-15' },
            { id: 3, name: 'B区1号消防门', space: '地下车库B区', location: 'B1层出口', status: 'warning', lastCheck: '2024-01-10', nextCheck: '2024-02-10' },
            { id: 4, name: '换乘通道1号门', space: '地铁换乘通道', location: '换乘口', status: 'danger', lastCheck: '2024-01-10', nextCheck: '2024-01-11' }
        ],
        pumps: [
            { id: 1, name: '1号排水泵', space: '地下商场A区', location: '集水井1', status: 'normal', lastCheck: '2024-01-15', runHours: 1250 },
            { id: 2, name: '2号排水泵', space: '地下车库B区', location: 'B3集水井', status: 'warning', lastCheck: '2024-01-16', runHours: 2100 },
            { id: 3, name: '3号排水泵', space: '地下车库B区', location: 'B3集水井', status: 'normal', lastCheck: '2024-01-16', runHours: 1800 },
            { id: 4, name: '4号排水泵', space: '地下商场C区', location: '南区集水井', status: 'normal', lastCheck: '2024-01-14', runHours: 950 }
        ],
        lighting: [
            { id: 1, area: '地下商场A区', total: 150, normal: 145, fault: 3, offline: 2 },
            { id: 2, area: '地下车库B区', total: 200, normal: 180, fault: 15, offline: 5 },
            { id: 3, area: '地下通道1号', total: 60, normal: 58, fault: 2, offline: 0 },
            { id: 4, area: '地铁换乘通道', total: 80, normal: 72, fault: 6, offline: 2 }
        ],
        cameras: [
            { id: 1, area: '地下商场A区', total: 45, online: 43, offline: 2, blindSpots: 1 },
            { id: 2, area: '地下车库B区', total: 60, online: 55, offline: 5, blindSpots: 3 },
            { id: 3, area: '地下通道1号', total: 12, online: 12, offline: 0, blindSpots: 1 },
            { id: 4, area: '地铁换乘通道', total: 25, online: 20, offline: 5, blindSpots: 4 }
        ]
    },

    evacuation: {
        plans: [
            { id: 1, space: '地下商场A区', capacity: 800, currentPeople: 450, exits: 6, availableExits: 5, evacuationTime: 8, status: 'normal' },
            { id: 2, space: '地下车库B区', capacity: 300, currentPeople: 80, exits: 4, availableExits: 4, evacuationTime: 5, status: 'normal' },
            { id: 3, space: '地铁换乘通道', capacity: 500, currentPeople: 320, exits: 3, availableExits: 2, evacuationTime: 10, status: 'warning' }
        ],
        limits: [
            { id: 1, space: '地下商场A区', maxLimit: 800, warningLimit: 640, current: 450, status: 'normal' },
            { id: 2, space: '地下商场C区', maxLimit: 1000, warningLimit: 800, current: 720, status: 'warning' },
            { id: 3, space: '地铁换乘通道', maxLimit: 500, warningLimit: 400, current: 320, status: 'normal' }
        ],
        merchants: [
            { id: 1, name: '永辉超市', space: '地下商场A区', contact: '陈经理', phone: '13900139001', employees: 45, evacuationRole: '区域引导员' },
            { id: 2, name: '麦当劳', space: '地下商场A区', contact: '吴店长', phone: '13900139002', employees: 20, evacuationRole: '急救员' },
            { id: 3, name: '优衣库', space: '地下商场C区', contact: '郑店长', phone: '13900139003', employees: 15, evacuationRole: '区域引导员' }
        ]
    },

    rectification: [
        { id: 1, hazard: '消防通道堵塞', space: '地下商场A区', level: 'critical', assignDate: '2024-01-15', handler: '物业王经理', deadline: '2024-01-17', progress: 0, status: 'pending', logs: [
            { time: '2024-01-15 10:30', action: '问题派单', operator: '系统', remark: '已派单给物业王经理' }
        ]},
        { id: 2, hazard: '应急照明故障', space: '地下车库B区', level: 'high', assignDate: '2024-01-16', handler: '工程部', deadline: '2024-01-18', progress: 40, status: 'processing', logs: [
            { time: '2024-01-16 09:00', action: '问题派单', operator: '系统', remark: '已派单给工程部' },
            { time: '2024-01-16 14:30', action: '现场勘察', operator: '李工', remark: '确认需要更换12组电池' },
            { time: '2024-01-17 10:00', action: '物资采购', operator: '李工', remark: '电池已下单，预计明日到货' }
        ]},
        { id: 3, hazard: '消防门无法关闭', space: '地铁换乘通道', level: 'critical', assignDate: '2024-01-10', handler: '消防维保单位', deadline: '2024-01-13', progress: 60, status: 'processing', logs: [
            { time: '2024-01-10 15:00', action: '问题派单', operator: '系统', remark: '已派单给消防维保单位' },
            { time: '2024-01-11 09:00', action: '现场处理', operator: '维保张工', remark: '已拆除损坏闭门器，新配件待到货' },
            { time: '2024-01-12 16:00', action: '配件到货', operator: '维保张工', remark: '新闭门器已到货，明日安装' }
        ], hasClosure: true, closureType: '临时管控'},
        { id: 4, hazard: '排水泵异常', space: '地下车库B区', level: 'high', assignDate: '2024-01-16', handler: '工程部', deadline: '2024-01-17', progress: 100, status: 'reviewing', logs: [
            { time: '2024-01-16 11:00', action: '问题派单', operator: '系统', remark: '已派单给工程部' },
            { time: '2024-01-16 15:30', action: '现场检修', operator: '王工', remark: '轴承磨损，已更换' },
            { time: '2024-01-17 09:00', action: '申请复查', operator: '王工', remark: '维修完成，申请复查' }
        ]},
        { id: 5, hazard: '消火栓被遮挡', space: '地下商场C区', level: 'high', assignDate: '2024-01-14', handler: '商户管理部', deadline: '2024-01-15', progress: 100, status: 'closed', logs: [
            { time: '2024-01-14 16:00', action: '问题派单', operator: '系统', remark: '已派单给商户管理部' },
            { time: '2024-01-14 17:30', action: '现场处理', operator: '刘主管', remark: '商户已移除广告牌' },
            { time: '2024-01-15 09:00', action: '复查通过', operator: '安检员', remark: '已确认整改完毕，予以销项' }
        ]}
    ],

    materials: [
        { id: 1, name: '防毒面具', category: '个人防护', space: '地下商场A区', total: 100, available: 85, lastCheck: '2024-01-10', expiryDate: '2025-06-01' },
        { id: 2, name: '手持扩音器', category: '通讯设备', space: '地下商场A区', total: 10, available: 10, lastCheck: '2024-01-10', expiryDate: '-' },
        { id: 3, name: '应急手电筒', category: '照明设备', space: '地下车库B区', total: 50, available: 45, lastCheck: '2024-01-12', expiryDate: '2024-12-01' },
        { id: 4, name: '急救箱', category: '医疗急救', space: '地下商场C区', total: 8, available: 8, lastCheck: '2024-01-08', expiryDate: '2024-08-15' },
        { id: 5, name: '灭火器(4kg)', category: '消防器材', space: '地铁换乘通道', total: 30, available: 28, lastCheck: '2024-01-05', expiryDate: '2025-03-01' }
    ],

    drills: [
        { id: 1, title: '2024年第一季度消防演练', space: '地下商场A区', type: '消防疏散', date: '2024-01-10', participants: 150, duration: 45, result: 'pass', organizer: '人防办', description: '模拟火灾场景，检验疏散预案可行性' },
        { id: 2, title: '防汛应急演练', space: '地下车库B区', type: '防汛排涝', date: '2024-01-05', participants: 30, duration: 60, result: 'pass', organizer: '物业', description: '模拟暴雨积水，检验排水泵运行及人员疏散' },
        { id: 3, title: '反恐防暴演练', space: '地铁换乘通道', type: '反恐应急', date: '2023-12-20', participants: 80, duration: 90, result: 'pass', organizer: '公安分局', description: '模拟突发暴力事件，检验安保应急响应' }
    ],

    riskRanking: [
        { rank: 1, space: '地铁换乘通道', type: '通道', riskScore: 92, level: 'critical', hazards: 6, lastHazardDate: '2024-01-10', trend: 'up' },
        { rank: 2, space: '地下车库B区', type: '车库', riskScore: 78, level: 'high', hazards: 5, lastHazardDate: '2024-01-16', trend: 'stable' },
        { rank: 3, space: '地下商场A区', type: '商场', riskScore: 65, level: 'medium', hazards: 4, lastHazardDate: '2024-01-15', trend: 'down' },
        { rank: 4, space: '地下商场C区', type: '商场', riskScore: 58, level: 'medium', hazards: 3, lastHazardDate: '2024-01-14', trend: 'stable' },
        { rank: 5, space: '地下通道1号', type: '通道', riskScore: 35, level: 'low', hazards: 1, lastHazardDate: '2024-01-12', trend: 'down' },
        { rank: 6, space: '地下物流中心', type: '仓库', riskScore: 22, level: 'low', hazards: 0, lastHazardDate: '-', trend: 'stable' }
    ],

    stats: {
        totalSpaces: 6,
        totalInspections: 5,
        pendingHazards: 3,
        processingHazards: 2,
        resolvedHazards: 2,
        todayInspections: 1,
        equipmentNormalRate: 89,
        rectificationRate: 67
    }
};