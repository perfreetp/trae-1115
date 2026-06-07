const pageTitles = {
    dashboard: '统计看板',
    spaces: '空间台账',
    inspections: '巡查任务',
    hazards: '隐患清单',
    equipment: '设备状态',
    evacuation: '人员疏散',
    rectification: '整改跟踪',
    floorplan: '分区平面图',
    materials: '应急物资',
    drills: '演练记录',
    risk: '风险排名'
};

function renderDashboard() {
    const s = mockData.stats;
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl p-6 shadow-sm card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">地下空间总数</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">${s.totalSpaces}</p>
                            <p class="text-green-500 text-sm mt-2"><i class="fas fa-arrow-up"></i> 较上月 +1</p>
                        </div>
                        <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-building text-2xl text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">待处理隐患</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">${s.pendingHazards + s.processingHazards}</p>
                            <p class="text-red-500 text-sm mt-2"><i class="fas fa-exclamation-triangle"></i> ${s.pendingHazards} 个紧急</p>
                        </div>
                        <div class="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-2xl text-red-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">今日巡查任务</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">${s.todayInspections}</p>
                            <p class="text-blue-500 text-sm mt-2"><i class="fas fa-calendar-check"></i> 进行中</p>
                        </div>
                        <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-clipboard-list text-2xl text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm card-hover">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">设备正常率</p>
                            <p class="text-3xl font-bold text-gray-800 mt-1">${s.equipmentNormalRate}%</p>
                            <p class="text-yellow-500 text-sm mt-2"><i class="fas fa-arrow-down"></i> 较上周 -2%</p>
                        </div>
                        <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-cogs text-2xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">隐患类型分布</h3>
                    <canvas id="hazardTypeChart" height="250"></canvas>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">月度整改趋势</h3>
                    <canvas id="rectificationChart" height="250"></canvas>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-800">最新隐患</h3>
                        <a href="#hazards" class="text-blue-600 text-sm hover:underline">查看全部 <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                    <div class="space-y-3">
                        ${mockData.hazards.slice(0, 4).map(h => `
                            <div class="flex items-center justify-between p-3 rounded-lg priority-${h.level}">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                        <i class="fas fa-exclamation-circle text-${h.level === 'critical' ? 'red' : h.level === 'high' ? 'orange' : h.level === 'medium' ? 'blue' : 'green'}-500"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">${h.title}</p>
                                        <p class="text-xs text-gray-500">${h.space} · ${h.location}</p>
                                    </div>
                                </div>
                                <span class="badge ${h.status === 'pending' ? 'badge-danger' : h.status === 'processing' ? 'badge-warning' : 'badge-success'}">
                                    ${h.status === 'pending' ? '待处理' : h.status === 'processing' ? '处理中' : '已解决'}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-800">风险排名 TOP3</h3>
                        <a href="#risk" class="text-blue-600 text-sm hover:underline">全部 <i class="fas fa-arrow-right ml-1"></i></a>
                    </div>
                    <div class="space-y-4">
                        ${mockData.riskRanking.slice(0, 3).map(r => `
                            <div class="flex items-center space-x-3">
                                <div class="w-8 h-8 rounded-full ${r.rank === 1 ? 'bg-red-500' : r.rank === 2 ? 'bg-orange-500' : 'bg-yellow-500'} text-white flex items-center justify-center font-bold text-sm">
                                    ${r.rank}
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800 text-sm">${r.space}</p>
                                    <div class="flex items-center space-x-2 mt-1">
                                        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full ${r.level === 'critical' ? 'bg-red-500' : r.level === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}" style="width: ${r.riskScore}%"></div>
                                        </div>
                                        <span class="text-xs text-gray-500">${r.riskScore}分</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderSpaces() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部类型</option>
                        <option>商场</option>
                        <option>通道</option>
                        <option>车库</option>
                        <option>仓库</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部状态</option>
                        <option>正常</option>
                        <option>预警</option>
                        <option>异常</option>
                    </select>
                </div>
                <button onclick="showModal('addSpace')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>新增空间</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${mockData.spaces.map(space => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
                        <div class="h-32 bg-gradient-to-br ${space.type === '商场' ? 'from-blue-400 to-blue-600' : space.type === '通道' ? 'from-green-400 to-green-600' : space.type === '车库' ? 'from-purple-400 to-purple-600' : 'from-gray-400 to-gray-600'} relative">
                            <div class="absolute top-3 right-3">
                                <span class="badge ${space.status === 'normal' ? 'badge-success' : space.status === 'warning' ? 'badge-warning' : 'badge-danger'}">
                                    ${space.status === 'normal' ? '正常' : space.status === 'warning' ? '预警' : '异常'}
                                </span>
                            </div>
                            <div class="absolute bottom-3 left-3 text-white">
                                <p class="font-bold text-lg">${space.name}</p>
                                <p class="text-sm opacity-90">${space.type} · ${space.area}㎡</p>
                            </div>
                        </div>
                        <div class="p-4">
                            <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                    <p class="text-gray-500">楼层数</p>
                                    <p class="font-medium">${space.floors} 层</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">商户数</p>
                                    <p class="font-medium">${space.merchantCount} 家</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">最大容量</p>
                                    <p class="font-medium">${space.capacity} 人</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">风险等级</p>
                                    <p class="font-medium ${space.riskLevel === 'critical' ? 'text-red-600' : space.riskLevel === 'high' ? 'text-orange-600' : space.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}">
                                        ${space.riskLevel === 'critical' ? '极高' : space.riskLevel === 'high' ? '高' : space.riskLevel === 'medium' ? '中' : '低'}
                                    </p>
                                </div>
                            </div>
                            <div class="border-t pt-3">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2">
                                        <i class="fas fa-user text-gray-400"></i>
                                        <span class="text-sm text-gray-600">${space.manager}</span>
                                    </div>
                                    <span class="text-xs text-gray-400">上次巡查: ${space.lastInspection}</span>
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button onclick="showModal('spaceDetail', ${space.id})" class="flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    查看详情
                                </button>
                                <button onclick="showModal('editSpace', ${space.id})" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    <i class="fas fa-edit"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderInspections() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部类型</option>
                        <option>日常巡查</option>
                        <option>专项检查</option>
                        <option>综合检查</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部状态</option>
                        <option>待执行</option>
                        <option>进行中</option>
                        <option>已完成</option>
                    </select>
                </div>
                <button onclick="showModal('addInspection')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>新建任务</span>
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属空间</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">巡查员</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进度</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发现问题</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${mockData.inspections.map(ins => `
                            <tr class="table-row-hover">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="font-medium text-gray-900">${ins.title}</div>
                                    <div class="text-xs text-gray-500">${ins.startDate} ~ ${ins.endDate}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${ins.space}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="badge badge-info">${ins.type}</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${ins.inspector}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-24 progress-bar">
                                            <div class="progress-fill ${ins.completed === ins.items ? 'bg-green-500' : 'bg-blue-500'}" style="width: ${(ins.completed / ins.items * 100).toFixed(0)}%"></div>
                                        </div>
                                        <span class="text-xs text-gray-600">${ins.completed}/${ins.items}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="text-sm ${ins.issues > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}">${ins.issues} 个</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="badge ${ins.status === 'completed' ? 'badge-success' : ins.status === 'in_progress' ? 'badge-warning' : 'badge-secondary'}">
                                        ${ins.status === 'completed' ? '已完成' : ins.status === 'in_progress' ? '进行中' : '待执行'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                    <button onclick="showModal('inspectionDetail', ${ins.id})" class="text-blue-600 hover:text-blue-800 mr-3">详情</button>
                                    ${ins.status !== 'completed' ? '<button class="text-green-600 hover:text-green-800">执行</button>' : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderHazards() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部等级</option>
                        <option>极高</option>
                        <option>高</option>
                        <option>中</option>
                        <option>低</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部状态</option>
                        <option>待处理</option>
                        <option>处理中</option>
                        <option>待复查</option>
                        <option>已销项</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部类型</option>
                        <option>通道占用</option>
                        <option>消防设施</option>
                        <option>照明故障</option>
                        <option>监控设施</option>
                        <option>排水设施</option>
                    </select>
                </div>
                <button onclick="showModal('addHazard')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>登记隐患</span>
                </button>
            </div>

            <div class="grid grid-cols-4 gap-4">
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-skull-crossbones text-red-600"></i>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">${mockData.hazards.filter(h => h.level === 'critical').length}</p>
                            <p class="text-xs text-gray-500">极高风险</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-fire text-orange-600"></i>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">${mockData.hazards.filter(h => h.level === 'high').length}</p>
                            <p class="text-xs text-gray-500">高风险</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-exclamation text-yellow-600"></i>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">${mockData.hazards.filter(h => h.level === 'medium').length}</p>
                            <p class="text-xs text-gray-500">中风险</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-4 shadow-sm">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-info-circle text-green-600"></i>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">${mockData.hazards.filter(h => h.level === 'low').length}</p>
                            <p class="text-xs text-gray-500">低风险</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                ${mockData.hazards.map(h => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden priority-${h.level}">
                        <div class="p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center space-x-3 mb-2">
                                        <h4 class="font-semibold text-gray-800 text-lg">${h.title}</h4>
                                        <span class="badge ${h.level === 'critical' ? 'badge-danger' : h.level === 'high' ? 'badge-warning' : h.level === 'medium' ? 'badge-info' : 'badge-success'}">
                                            ${h.level === 'critical' ? '极高' : h.level === 'high' ? '高' : h.level === 'medium' ? '中' : '低'}
                                        </span>
                                        <span class="badge badge-secondary">${h.type}</span>
                                    </div>
                                    <p class="text-gray-600 mb-3">${h.description}</p>
                                    <div class="flex items-center space-x-6 text-sm text-gray-500">
                                        <span><i class="fas fa-map-marker-alt mr-1"></i> ${h.space} - ${h.location}</span>
                                        <span><i class="fas fa-user mr-1"></i> ${h.discoverer}</span>
                                        <span><i class="fas fa-calendar mr-1"></i> ${h.discoverDate}</span>
                                        <span><i class="fas fa-user-cog mr-1"></i> 处理人: ${h.handler}</span>
                                        <span><i class="fas fa-clock mr-1"></i> 截止: ${h.deadline}</span>
                                    </div>
                                </div>
                                <span class="badge ${h.status === 'pending' ? 'badge-danger' : h.status === 'processing' ? 'badge-warning' : h.status === 'resolved' ? 'badge-success' : 'badge-info'}">
                                    ${h.status === 'pending' ? '待处理' : h.status === 'processing' ? '处理中' : '已解决'}
                                </span>
                            </div>
                            <div class="mt-4 flex items-center space-x-3">
                                <button onclick="showModal('hazardDetail', ${h.id})" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    <i class="fas fa-eye mr-1"></i> 查看详情
                                </button>
                                <button onclick="showModal('assignHazard', ${h.id})" class="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition">
                                    <i class="fas fa-paper-plane mr-1"></i> 派单
                                </button>
                                ${h.status !== 'resolved' ? `
                                    <button onclick="showModal('uploadEvidence', ${h.id})" class="px-4 py-2 border border-green-300 text-green-600 rounded-lg text-sm hover:bg-green-50 transition">
                                        <i class="fas fa-camera mr-1"></i> 上传照片
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderEquipment() {
    const eq = mockData.equipment;
    return `
        <div class="space-y-6">
            <div class="flex border-b border-gray-200">
                <button class="equipment-tab active px-6 py-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600" data-tab="fireDoors">消防门</button>
                <button class="equipment-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="pumps">排水泵</button>
                <button class="equipment-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="lighting">照明系统</button>
                <button class="equipment-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700" data-tab="cameras">监控系统</button>
            </div>

            <div id="equipment-content">
                <div id="tab-fireDoors" class="equipment-panel">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">消防门总数</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">${eq.fireDoors.length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">正常</p>
                            <p class="text-2xl font-bold text-green-600 mt-1">${eq.fireDoors.filter(d => d.status === 'normal').length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">异常</p>
                            <p class="text-2xl font-bold text-yellow-600 mt-1">${eq.fireDoors.filter(d => d.status === 'warning').length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">故障</p>
                            <p class="text-2xl font-bold text-red-600 mt-1">${eq.fireDoors.filter(d => d.status === 'danger').length}</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属空间</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">上次检查</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">下次检查</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${eq.fireDoors.map(d => `
                                    <tr class="table-row-hover">
                                        <td class="px-6 py-4 font-medium text-gray-900">${d.name}</td>
                                        <td class="px-6 py-4 text-gray-600">${d.space}</td>
                                        <td class="px-6 py-4 text-gray-600">${d.location}</td>
                                        <td class="px-6 py-4">
                                            <span class="flex items-center">
                                                <span class="status-dot status-${d.status}"></span>
                                                ${d.status === 'normal' ? '正常' : d.status === 'warning' ? '异常' : '故障'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-gray-600">${d.lastCheck}</td>
                                        <td class="px-6 py-4 text-gray-600">${d.nextCheck}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="tab-pumps" class="equipment-panel hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">排水泵总数</p>
                            <p class="text-2xl font-bold text-gray-800 mt-1">${eq.pumps.length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">运行正常</p>
                            <p class="text-2xl font-bold text-green-600 mt-1">${eq.pumps.filter(p => p.status === 'normal').length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">需关注</p>
                            <p class="text-2xl font-bold text-yellow-600 mt-1">${eq.pumps.filter(p => p.status === 'warning').length}</p>
                        </div>
                        <div class="bg-white rounded-xl p-4 shadow-sm">
                            <p class="text-gray-500 text-sm">总运行时长</p>
                            <p class="text-2xl font-bold text-blue-600 mt-1">${eq.pumps.reduce((s, p) => s + p.runHours, 0)}h</p>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备名称</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">所属空间</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">位置</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">运行时长</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">上次检查</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${eq.pumps.map(p => `
                                    <tr class="table-row-hover">
                                        <td class="px-6 py-4 font-medium text-gray-900">${p.name}</td>
                                        <td class="px-6 py-4 text-gray-600">${p.space}</td>
                                        <td class="px-6 py-4 text-gray-600">${p.location}</td>
                                        <td class="px-6 py-4">
                                            <span class="flex items-center">
                                                <span class="status-dot status-${p.status}"></span>
                                                ${p.status === 'normal' ? '正常' : '异常'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-gray-600">${p.runHours} 小时</td>
                                        <td class="px-6 py-4 text-gray-600">${p.lastCheck}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="tab-lighting" class="equipment-panel hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${eq.lighting.map(l => `
                            <div class="bg-white rounded-xl p-6 shadow-sm">
                                <h4 class="font-semibold text-gray-800 mb-4">${l.area}</h4>
                                <div class="grid grid-cols-4 gap-4 mb-4">
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-gray-800">${l.total}</p>
                                        <p class="text-xs text-gray-500">总数</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-green-600">${l.normal}</p>
                                        <p class="text-xs text-gray-500">正常</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-yellow-600">${l.fault}</p>
                                        <p class="text-xs text-gray-500">故障</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-gray-600">${l.offline}</p>
                                        <p class="text-xs text-gray-500">离线</p>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill bg-green-500" style="width: ${(l.normal / l.total * 100).toFixed(0)}%"></div>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-right">正常率 ${(l.normal / l.total * 100).toFixed(1)}%</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div id="tab-cameras" class="equipment-panel hidden">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${eq.cameras.map(c => `
                            <div class="bg-white rounded-xl p-6 shadow-sm">
                                <h4 class="font-semibold text-gray-800 mb-4">${c.area}</h4>
                                <div class="grid grid-cols-4 gap-4 mb-4">
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-gray-800">${c.total}</p>
                                        <p class="text-xs text-gray-500">总数</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-green-600">${c.online}</p>
                                        <p class="text-xs text-gray-500">在线</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-gray-600">${c.offline}</p>
                                        <p class="text-xs text-gray-500">离线</p>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-2xl font-bold text-red-600">${c.blindSpots}</p>
                                        <p class="text-xs text-gray-500">盲区</p>
                                    </div>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill bg-blue-500" style="width: ${(c.online / c.total * 100).toFixed(0)}%"></div>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 text-right">在线率 ${(c.online / c.total * 100).toFixed(1)}%</p>
                                <button onclick="showModal('registerBlindSpot', '${c.area}')" class="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 transition">
                                    <i class="fas fa-plus mr-1"></i> 登记盲区
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderEvacuation() {
    const ev = mockData.evacuation;
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                ${ev.plans.map(p => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="h-2 ${p.status === 'normal' ? 'bg-green-500' : 'bg-yellow-500'}"></div>
                        <div class="p-5">
                            <div class="flex items-center justify-between mb-4">
                                <h4 class="font-semibold text-gray-800">${p.space}</h4>
                                <span class="badge ${p.status === 'normal' ? 'badge-success' : 'badge-warning'}">
                                    ${p.status === 'normal' ? '正常' : '预警'}
                                </span>
                            </div>
                            <div class="mb-4">
                                <div class="flex items-center justify-between text-sm mb-1">
                                    <span class="text-gray-500">实时人数</span>
                                    <span class="font-medium">${p.currentPeople} / ${p.capacity} 人</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill ${p.currentPeople / p.capacity > 0.8 ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${(p.currentPeople / p.capacity * 100).toFixed(0)}%"></div>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p class="text-xl font-bold text-blue-600">${p.exits}</p>
                                    <p class="text-xs text-gray-500">出口总数</p>
                                </div>
                                <div>
                                    <p class="text-xl font-bold text-green-600">${p.availableExits}</p>
                                    <p class="text-xs text-gray-500">可用出口</p>
                                </div>
                                <div>
                                    <p class="text-xl font-bold text-orange-600">${p.evacuationTime}分</p>
                                    <p class="text-xs text-gray-500">预计疏散</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">限流预警</h3>
                    <div class="space-y-4">
                        ${ev.limits.map(l => `
                            <div class="p-4 rounded-lg ${l.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-medium text-gray-800">${l.space}</span>
                                    <span class="badge ${l.status === 'warning' ? 'badge-warning' : 'badge-success'}">
                                        ${l.status === 'warning' ? '接近上限' : '正常'}
                                    </span>
                                </div>
                                <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                                    <div class="absolute left-0 top-0 h-full bg-yellow-300" style="width: ${(l.warningLimit / l.maxLimit * 100)}%"></div>
                                    <div class="absolute left-0 top-0 h-full ${l.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${(l.current / l.maxLimit * 100)}%"></div>
                                </div>
                                <div class="flex justify-between text-xs text-gray-500">
                                    <span>当前: ${l.current}人</span>
                                    <span>预警: ${l.warningLimit}人</span>
                                    <span>上限: ${l.maxLimit}人</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-gray-800">商户责任人</h3>
                        <button class="text-blue-600 text-sm hover:underline">管理</button>
                    </div>
                    <div class="space-y-3">
                        ${ev.merchants.map(m => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-store text-blue-600"></i>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-800">${m.name}</p>
                                        <p class="text-xs text-gray-500">${m.space} · ${m.employees}名员工</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-gray-800">${m.contact}</p>
                                    <p class="text-xs text-gray-500">${m.phone}</p>
                                    <p class="text-xs text-blue-600 mt-1">${m.evacuationRole}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderRectification() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部状态</option>
                        <option>待处理</option>
                        <option>处理中</option>
                        <option>待复查</option>
                        <option>已销项</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部等级</option>
                        <option>极高</option>
                        <option>高</option>
                        <option>中</option>
                    </select>
                </div>
                <div class="flex space-x-2">
                    <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                        <i class="fas fa-download mr-1"></i> 导出
                    </button>
                </div>
            </div>

            <div class="space-y-4">
                ${mockData.rectification.map(r => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-5 priority-${r.level}">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <div class="flex items-center space-x-3 mb-1">
                                        <h4 class="font-semibold text-gray-800">${r.hazard}</h4>
                                        <span class="badge ${r.level === 'critical' ? 'badge-danger' : 'badge-warning'}">
                                            ${r.level === 'critical' ? '极高' : '高'}
                                        </span>
                                        ${r.hasClosure ? `<span class="badge badge-danger"><i class="fas fa-ban mr-1"></i>${r.closureType}</span>` : ''}
                                    </div>
                                    <p class="text-sm text-gray-600">${r.space}</p>
                                </div>
                                <span class="badge ${r.status === 'pending' ? 'badge-secondary' : r.status === 'processing' ? 'badge-warning' : r.status === 'reviewing' ? 'badge-info' : 'badge-success'}">
                                    ${r.status === 'pending' ? '待处理' : r.status === 'processing' ? '处理中' : r.status === 'reviewing' ? '待复查' : '已销项'}
                                </span>
                            </div>
                            <div class="grid grid-cols-4 gap-4 mb-4 text-sm">
                                <div>
                                    <p class="text-gray-500">处理责任人</p>
                                    <p class="font-medium">${r.handler}</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">派单时间</p>
                                    <p class="font-medium">${r.assignDate}</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">截止时间</p>
                                    <p class="font-medium ${new Date(r.deadline) < new Date() ? 'text-red-600' : ''}">${r.deadline}</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">整改进度</p>
                                    <div class="flex items-center space-x-2">
                                        <div class="flex-1 progress-bar">
                                            <div class="progress-fill ${r.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}" style="width: ${r.progress}%"></div>
                                        </div>
                                        <span class="font-medium">${r.progress}%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="border-t pt-4">
                                <p class="text-sm font-medium text-gray-700 mb-2">整改跟踪</p>
                                <div class="space-y-2 max-h-32 overflow-y-auto">
                                    ${r.logs.map(log => `
                                        <div class="timeline-item">
                                            <div class="text-sm">
                                                <span class="font-medium text-gray-800">${log.action}</span>
                                                <span class="text-gray-500 ml-2">${log.operator}</span>
                                                <span class="text-gray-400 text-xs ml-2">${log.time}</span>
                                            </div>
                                            <p class="text-xs text-gray-600 mt-1">${log.remark}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button onclick="showModal('rectificationDetail', ${r.id})" class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    详情
                                </button>
                                ${r.status === 'pending' ? `
                                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                                        开始处理
                                    </button>
                                ` : ''}
                                ${r.status === 'processing' ? `
                                    <button onclick="showModal('updateProgress', ${r.id})" class="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm hover:bg-blue-50 transition">
                                        更新进度
                                    </button>
                                ` : ''}
                                ${r.status === 'reviewing' ? `
                                    <button class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
                                        <i class="fas fa-check mr-1"></i> 复查通过
                                    </button>
                                    <button class="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                                        <i class="fas fa-times mr-1"></i> 复查不通过
                                    </button>
                                ` : ''}
                                ${r.level === 'critical' && r.status !== 'closed' ? `
                                    <button onclick="showModal('suggestClosure', ${r.id})" class="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
                                        <i class="fas fa-exclamation-triangle mr-1"></i> 停业建议
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFloorplan() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>地下商场A区</option>
                        <option>地下车库B区</option>
                        <option>地铁换乘通道</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>B1层</option>
                        <option>B2层</option>
                        <option>B3层</option>
                    </select>
                </div>
                <div class="flex items-center space-x-2">
                    <button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="text-sm text-gray-600">100%</span>
                    <button class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 ml-2">
                        <i class="fas fa-download mr-1"></i> 导出图纸
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div class="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">分区平面图</h3>
                    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <svg viewBox="0 0 800 500" class="w-full h-auto">
                            <rect x="10" y="10" width="780" height="480" fill="#f9fafb" stroke="#d1d5db" stroke-width="2" rx="4"/>
                            
                            <rect x="30" y="30" width="200" height="180" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '服装区')"/>
                            <text x="130" y="120" text-anchor="middle" class="text-sm fill-gray-700 font-medium">服装区</text>
                            
                            <rect x="250" y="30" width="180" height="180" fill="#dcfce7" stroke="#22c55e" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '美食区')"/>
                            <text x="340" y="120" text-anchor="middle" class="text-sm fill-gray-700 font-medium">美食区</text>
                            
                            <rect x="450" y="30" width="200" height="180" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '超市区')"/>
                            <text x="550" y="120" text-anchor="middle" class="text-sm fill-gray-700 font-medium">超市区</text>
                            
                            <rect x="670" y="30" width="100" height="180" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '设备间')"/>
                            <text x="720" y="120" text-anchor="middle" class="text-sm fill-gray-700 font-medium">设备间</text>
                            
                            <rect x="30" y="230" width="320" height="60" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/>
                            <text x="190" y="268" text-anchor="middle" class="text-xs fill-gray-600">主通道 (宽6米)</text>
                            
                            <rect x="370" y="230" width="280" height="60" fill="#fee2e2" stroke="#ef4444" stroke-width="2" stroke-dasharray="5,3" class="floor-plan-area" onclick="showModal('blockedPassage')"/>
                            <text x="510" y="268" text-anchor="middle" class="text-xs fill-red-600 font-medium">通道占用!</text>
                            
                            <rect x="30" y="310" width="150" height="160" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '娱乐区')"/>
                            <text x="105" y="395" text-anchor="middle" class="text-sm fill-gray-700 font-medium">娱乐区</text>
                            
                            <rect x="200" y="310" width="150" height="160" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '百货区')"/>
                            <text x="275" y="395" text-anchor="middle" class="text-sm fill-gray-700 font-medium">百货区</text>
                            
                            <rect x="370" y="310" width="150" height="160" fill="#f3e8ff" stroke="#a855f7" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '数码区')"/>
                            <text x="445" y="395" text-anchor="middle" class="text-sm fill-gray-700 font-medium">数码区</text>
                            
                            <rect x="670" y="240" width="50" height="50" fill="#22c55e" stroke="#16a34a" stroke-width="2" class="floor-plan-area" rx="2" onclick="showModal('exitDetail', '1号出口')"/>
                            <text x="695" y="270" text-anchor="middle" class="text-xs fill-white font-bold">出口1</text>
                            
                            <rect x="720" y="240" width="50" height="50" fill="#ef4444" stroke="#dc2626" stroke-width="2" class="floor-plan-area" rx="2" onclick="showModal('exitDetail', '2号出口(堵塞)')"/>
                            <text x="745" y="270" text-anchor="middle" class="text-xs fill-white font-bold">出口2</text>
                            
                            <rect x="540" y="310" width="50" height="50" fill="#22c55e" stroke="#16a34a" stroke-width="2" class="floor-plan-area" rx="2" onclick="showModal('exitDetail', '3号出口')"/>
                            <text x="565" y="340" text-anchor="middle" class="text-xs fill-white font-bold">出口3</text>
                            
                            <rect x="600" y="310" width="170" height="160" fill="#f0f9ff" stroke="#0ea5e9" stroke-width="1.5" class="floor-plan-area" rx="2" onclick="showModal('areaDetail', '停车场入口')"/>
                            <text x="685" y="395" text-anchor="middle" class="text-sm fill-gray-700 font-medium">停车场入口</text>
                            
                            <circle cx="100" cy="470" r="6" fill="#3b82f6" class="floor-plan-area" onclick="showModal('cameraDetail', 'CAM-001')"/>
                            <circle cx="350" cy="470" r="6" fill="#3b82f6" class="floor-plan-area" onclick="showModal('cameraDetail', 'CAM-002')"/>
                            <circle cx="600" cy="470" r="6" fill="#ef4444" class="floor-plan-area" onclick="showModal('cameraDetail', 'CAM-003(离线)')"/>
                            
                            <circle cx="130" cy="260" r="5" fill="#22c55e"/>
                            <circle cx="340" cy="260" r="5" fill="#f59e0b"/>
                            <circle cx="550" cy="260" r="5" fill="#22c55e"/>
                        </svg>
                    </div>
                    
                    <div class="mt-4 flex flex-wrap gap-4 text-sm">
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-green-500 rounded"></div>
                            <span class="text-gray-600">正常区域</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                            <span class="text-gray-600">通道占用</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span class="text-gray-600">正常出口</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span class="text-gray-600">堵塞出口</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <span class="text-gray-600">在线监控</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span class="text-gray-600">离线监控</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white rounded-xl p-5 shadow-sm">
                        <h4 class="font-semibold text-gray-800 mb-3">通道占用记录</h4>
                        <div class="space-y-3">
                            <div class="p-3 bg-red-50 rounded-lg border border-red-100">
                                <p class="font-medium text-red-800 text-sm">主通道中段</p>
                                <p class="text-xs text-red-600 mt-1">商户货物堆放 · 约2米</p>
                                <p class="text-xs text-gray-500 mt-1">2024-01-15 发现</p>
                            </div>
                            <div class="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <p class="font-medium text-yellow-800 text-sm">美食区通道</p>
                                <p class="text-xs text-yellow-600 mt-1">餐椅占道 · 约1米</p>
                                <p class="text-xs text-gray-500 mt-1">2024-01-14 发现</p>
                            </div>
                        </div>
                        <button class="mt-3 w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600">
                            <i class="fas fa-plus mr-1"></i> 记录占用
                        </button>
                    </div>

                    <div class="bg-white rounded-xl p-5 shadow-sm">
                        <h4 class="font-semibold text-gray-800 mb-3">图例说明</h4>
                        <div class="space-y-2 text-sm">
                            <p class="text-gray-600"><i class="fas fa-circle text-xs text-blue-500 mr-2"></i>蓝色区域 - 商铺</p>
                            <p class="text-gray-600"><i class="fas fa-circle text-xs text-gray-400 mr-2"></i>灰色区域 - 通道</p>
                            <p class="text-gray-600"><i class="fas fa-circle text-xs text-green-500 mr-2"></i>绿色 - 安全出口</p>
                            <p class="text-gray-600"><i class="fas fa-circle text-xs text-red-500 mr-2"></i>红色 - 异常/堵塞</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderMaterials() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部分类</option>
                        <option>个人防护</option>
                        <option>消防器材</option>
                        <option>照明设备</option>
                        <option>通讯设备</option>
                        <option>医疗急救</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部空间</option>
                        <option>地下商场A区</option>
                        <option>地下车库B区</option>
                    </select>
                </div>
                <button onclick="showModal('addMaterial')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>新增物资</span>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${mockData.materials.map(m => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden card-hover">
                        <div class="p-5">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i class="fas ${m.category === '个人防护' ? 'fa-hard-hat' : m.category === '消防器材' ? 'fa-fire-extinguisher' : m.category === '照明设备' ? 'fa-lightbulb' : m.category === '通讯设备' ? 'fa-bullhorn' : 'fa-first-aid'} text-blue-600 text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800">${m.name}</h4>
                                        <p class="text-xs text-gray-500">${m.category}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                    <p class="text-gray-500">存放位置</p>
                                    <p class="font-medium">${m.space}</p>
                                </div>
                                <div>
                                    <p class="text-gray-500">上次盘点</p>
                                    <p class="font-medium">${m.lastCheck}</p>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="flex items-center justify-between text-sm mb-1">
                                    <span class="text-gray-500">库存状态</span>
                                    <span class="font-medium">${m.available} / ${m.total}</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill ${m.available / m.total > 0.8 ? 'bg-green-500' : m.available / m.total > 0.5 ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${(m.available / m.total * 100)}%"></div>
                                </div>
                            </div>
                            <p class="text-xs ${new Date(m.expiryDate) < new Date('2024-12-01') && m.expiryDate !== '-' ? 'text-red-600' : 'text-gray-500'}">
                                <i class="fas fa-calendar-alt mr-1"></i> 有效期: ${m.expiryDate}
                            </p>
                        </div>
                        <div class="border-t px-5 py-3 bg-gray-50 flex justify-between">
                            <button class="text-sm text-blue-600 hover:text-blue-800">盘点</button>
                            <button class="text-sm text-gray-600 hover:text-gray-800">领用</button>
                            <button class="text-sm text-green-600 hover:text-green-800">补充</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderDrills() {
    return `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部类型</option>
                        <option>消防疏散</option>
                        <option>防汛排涝</option>
                        <option>反恐应急</option>
                    </select>
                    <select class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>全部结果</option>
                        <option>通过</option>
                        <option>未通过</option>
                    </select>
                </div>
                <button onclick="showModal('addDrill')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                    <i class="fas fa-plus"></i>
                    <span>记录演练</span>
                </button>
            </div>

            <div class="space-y-4">
                ${mockData.drills.map(d => `
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="p-5">
                            <div class="flex items-start justify-between">
                                <div class="flex items-start space-x-4">
                                    <div class="w-14 h-14 bg-gradient-to-br ${d.type === '消防疏散' ? 'from-red-400 to-orange-500' : d.type === '防汛排涝' ? 'from-blue-400 to-cyan-500' : 'from-purple-400 to-pink-500'} rounded-xl flex items-center justify-center flex-shrink-0">
                                        <i class="fas ${d.type === '消防疏散' ? 'fa-fire' : d.type === '防汛排涝' ? 'fa-water' : 'fa-shield-alt'} text-white text-2xl"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-800 text-lg">${d.title}</h4>
                                        <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                            <span><i class="fas fa-map-marker-alt mr-1"></i> ${d.space}</span>
                                            <span><i class="fas fa-calendar mr-1"></i> ${d.date}</span>
                                            <span><i class="fas fa-user-friends mr-1"></i> ${d.participants}人参与</span>
                                            <span><i class="fas fa-clock mr-1"></i> 历时${d.duration}分钟</span>
                                        </div>
                                        <p class="text-gray-600 mt-3">${d.description}</p>
                                        <div class="flex items-center space-x-4 mt-3">
                                            <span class="badge badge-info">${d.type}</span>
                                            <span class="badge ${d.result === 'pass' ? 'badge-success' : 'badge-danger'}">
                                                ${d.result === 'pass' ? '演练通过' : '演练未通过'}
                                            </span>
                                            <span class="text-sm text-gray-500">组织单位: ${d.organizer}</span>
                                        </div>
                                    </div>
                                </div>
                                <button class="text-gray-400 hover:text-gray-600">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                            <div class="mt-4 flex space-x-2">
                                <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    <i class="fas fa-file-alt mr-1"></i> 查看报告
                                </button>
                                <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    <i class="fas fa-images mr-1"></i> 照片/视频
                                </button>
                                <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                                    <i class="fas fa-download mr-1"></i> 导出
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderRisk() {
    return `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">极高风险</p>
                            <p class="text-3xl font-bold text-red-600 mt-1">${mockData.riskRanking.filter(r => r.level === 'critical').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-skull-crossbones text-red-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">高风险</p>
                            <p class="text-3xl font-bold text-orange-600 mt-1">${mockData.riskRanking.filter(r => r.level === 'high').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">中风险</p>
                            <p class="text-3xl font-bold text-yellow-600 mt-1">${mockData.riskRanking.filter(r => r.level === 'medium').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-exclamation-circle text-yellow-600 text-xl"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 shadow-sm">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">低风险</p>
                            <p class="text-3xl font-bold text-green-600 mt-1">${mockData.riskRanking.filter(r => r.level === 'low').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <i class="fas fa-check-circle text-green-600 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-5 border-b">
                    <h3 class="font-semibold text-gray-800">风险排名</h3>
                </div>
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">排名</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">空间名称</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">风险等级</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">风险评分</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">隐患数量</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最新隐患</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">趋势</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${mockData.riskRanking.map(r => `
                            <tr class="table-row-hover">
                                <td class="px-6 py-4">
                                    <div class="w-8 h-8 rounded-full ${r.rank === 1 ? 'bg-red-500' : r.rank === 2 ? 'bg-orange-500' : r.rank === 3 ? 'bg-yellow-500' : 'bg-gray-300'} text-white flex items-center justify-center font-bold text-sm">
                                        ${r.rank}
                                    </div>
                                </td>
                                <td class="px-6 py-4 font-medium text-gray-900">${r.space}</td>
                                <td class="px-6 py-4 text-gray-600">${r.type}</td>
                                <td class="px-6 py-4">
                                    <span class="badge ${r.level === 'critical' ? 'badge-danger' : r.level === 'high' ? 'badge-warning' : r.level === 'medium' ? 'badge-info' : 'badge-success'}">
                                        ${r.level === 'critical' ? '极高' : r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '低'}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center space-x-2">
                                        <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full ${r.level === 'critical' ? 'bg-red-500' : r.level === 'high' ? 'bg-orange-500' : r.level === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}" style="width: ${r.riskScore}%"></div>
                                        </div>
                                        <span class="font-medium">${r.riskScore}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="${r.hazards > 3 ? 'text-red-600 font-medium' : 'text-gray-600'}">${r.hazards} 个</span>
                                </td>
                                <td class="px-6 py-4 text-gray-600">${r.lastHazardDate}</td>
                                <td class="px-6 py-4">
                                    <span class="flex items-center ${r.trend === 'up' ? 'text-red-600' : r.trend === 'down' ? 'text-green-600' : 'text-gray-500'}">
                                        <i class="fas fa-arrow-${r.trend === 'up' ? 'up' : r.trend === 'down' ? 'down' : 'right'} mr-1"></i>
                                        ${r.trend === 'up' ? '上升' : r.trend === 'down' ? '下降' : '平稳'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3">详情</button>
                                    <button class="text-green-600 hover:text-green-800">整改</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">风险评分分布</h3>
                    <canvas id="riskDistributionChart" height="250"></canvas>
                </div>
                <div class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="font-semibold text-gray-800 mb-4">风险趋势分析</h3>
                    <canvas id="riskTrendChart" height="250"></canvas>
                </div>
            </div>
        </div>
    `;
}