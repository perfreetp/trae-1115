let currentPage = 'dashboard';
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initToggleSidebar();
    loadPage('dashboard');
});

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page && page !== currentPage) {
                loadPage(page);
            }
        });
    });
}

function initToggleSidebar() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('w-64');
        sidebar.classList.toggle('w-20');
        document.querySelectorAll('#sidebar span, #sidebar p').forEach(el => {
            el.classList.toggle('hidden');
        });
    });
}

function loadPage(page) {
    currentPage = page;
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    document.getElementById('pageTitle').textContent = pageTitles[page] || page;
    
    const content = document.getElementById('content');
    let html = '';
    
    switch(page) {
        case 'dashboard': html = renderDashboard(); break;
        case 'spaces': html = renderSpaces(); break;
        case 'inspections': html = renderInspections(); break;
        case 'hazards': html = renderHazards(); break;
        case 'equipment': html = renderEquipment(); break;
        case 'evacuation': html = renderEvacuation(); break;
        case 'rectification': html = renderRectification(); break;
        case 'floorplan': html = renderFloorplan(); break;
        case 'materials': html = renderMaterials(); break;
        case 'drills': html = renderDrills(); break;
        case 'risk': html = renderRisk(); break;
        default: html = renderDashboard();
    }
    
    content.innerHTML = html;
    
    initPageEvents(page);
    setTimeout(() => initCharts(page), 100);
}

function initPageEvents(page) {
    if (page === 'equipment') {
        document.querySelectorAll('.equipment-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                document.querySelectorAll('.equipment-tab').forEach(t => {
                    t.classList.remove('active', 'border-blue-600', 'text-blue-600');
                    t.classList.add('border-transparent', 'text-gray-500');
                });
                tab.classList.add('active', 'border-blue-600', 'text-blue-600');
                tab.classList.remove('border-transparent', 'text-gray-500');
                
                document.querySelectorAll('.equipment-panel').forEach(p => p.classList.add('hidden'));
                document.getElementById(`tab-${tabName}`).classList.remove('hidden');
            });
        });
    }
}

function initCharts(page) {
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    if (page === 'dashboard') {
        const hazardCtx = document.getElementById('hazardTypeChart');
        if (hazardCtx) {
            charts.hazardType = new Chart(hazardCtx, {
                type: 'doughnut',
                data: {
                    labels: ['通道占用', '消防设施', '照明故障', '监控设施', '排水设施'],
                    datasets: [{
                        data: [2, 2, 1, 1, 1],
                        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
        
        const rectCtx = document.getElementById('rectificationChart');
        if (rectCtx) {
            charts.rectification = new Chart(rectCtx, {
                type: 'line',
                data: {
                    labels: ['8月', '9月', '10月', '11月', '12月', '1月'],
                    datasets: [
                        {
                            label: '新增隐患',
                            data: [12, 8, 15, 10, 7, 6],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: '完成整改',
                            data: [10, 9, 12, 11, 8, 4],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }
    
    if (page === 'risk') {
        const distCtx = document.getElementById('riskDistributionChart');
        if (distCtx) {
            charts.riskDistribution = new Chart(distCtx, {
                type: 'bar',
                data: {
                    labels: mockData.riskRanking.map(r => r.space),
                    datasets: [{
                        label: '风险评分',
                        data: mockData.riskRanking.map(r => r.riskScore),
                        backgroundColor: mockData.riskRanking.map(r => 
                            r.level === 'critical' ? '#ef4444' :
                            r.level === 'high' ? '#f59e0b' :
                            r.level === 'medium' ? '#3b82f6' : '#10b981'
                        )
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
        
        const trendCtx = document.getElementById('riskTrendChart');
        if (trendCtx) {
            charts.riskTrend = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                    datasets: [
                        {
                            label: '地铁换乘通道',
                            data: [85, 87, 89, 90, 91, 92, 92],
                            borderColor: '#ef4444',
                            tension: 0.3
                        },
                        {
                            label: '地下车库B区',
                            data: [75, 76, 78, 77, 78, 78, 78],
                            borderColor: '#f59e0b',
                            tension: 0.3
                        },
                        {
                            label: '地下商场A区',
                            data: [68, 67, 66, 66, 65, 65, 65],
                            borderColor: '#3b82f6',
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }
}

function showModal(type, id = null) {
    const container = document.getElementById('modalContainer');
    let title = '';
    let content = '';
    
    const modalConfigs = {
        addSpace: { title: '新增地下空间', content: getSpaceForm() },
        editSpace: { title: '编辑空间信息', content: getSpaceForm(id) },
        spaceDetail: { title: '空间详情', content: getSpaceDetail(id) },
        addInspection: { title: '新建巡查任务', content: getInspectionForm() },
        inspectionDetail: { title: '巡查任务详情', content: getInspectionDetail(id) },
        addHazard: { title: '登记隐患', content: getHazardForm() },
        hazardDetail: { title: '隐患详情', content: getHazardDetail(id) },
        assignHazard: { title: '隐患派单', content: getAssignForm(id) },
        uploadEvidence: { title: '上传照片/视频', content: getUploadForm() },
        registerBlindSpot: { title: '登记监控盲区', content: getBlindSpotForm(id) },
        areaDetail: { title: `${id} - 区域详情`, content: getAreaDetail(id) },
        blockedPassage: { title: '通道占用详情', content: getBlockedPassageDetail() },
        exitDetail: { title: `${id} - 出口详情`, content: getExitDetail(id) },
        cameraDetail: { title: `${id} - 监控详情`, content: getCameraDetail(id) },
        rectificationDetail: { title: '整改进展详情', content: getRectificationDetail(id) },
        updateProgress: { title: '更新整改进度', content: getProgressForm(id) },
        suggestClosure: { title: '停业建议', content: getClosureForm(id) },
        addMaterial: { title: '新增应急物资', content: getMaterialForm() },
        addDrill: { title: '记录演练', content: getDrillForm() }
    };
    
    const config = modalConfigs[type] || { title: '详情', content: '<p>内容加载中...</p>' };
    
    container.innerHTML = `
        <div class="modal-overlay" onclick="closeModal(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between p-5 border-b">
                    <h3 class="text-lg font-semibold text-gray-800">${config.title}</h3>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="p-5">
                    ${config.content}
                </div>
            </div>
        </div>
    `;
    container.classList.remove('hidden');
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('modalContainer').classList.add('hidden');
}

function getSpaceForm(id = null) {
    const space = id ? mockData.spaces.find(s => s.id === id) : null;
    return `
        <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">空间名称</label>
                    <input type="text" value="${space?.name || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">空间类型</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option ${space?.type === '商场' ? 'selected' : ''}>商场</option>
                        <option ${space?.type === '通道' ? 'selected' : ''}>通道</option>
                        <option ${space?.type === '车库' ? 'selected' : ''}>车库</option>
                        <option ${space?.type === '仓库' ? 'selected' : ''}>仓库</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">面积(㎡)</label>
                    <input type="number" value="${space?.area || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">楼层数</label>
                    <input type="number" value="${space?.floors || 1}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <input type="text" value="${space?.address || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">管理人</label>
                    <input type="text" value="${space?.manager || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input type="tel" value="${space?.phone || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">最大容纳人数</label>
                    <input type="number" value="${space?.capacity || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option ${space?.riskLevel === 'low' ? 'selected' : ''}>低</option>
                        <option ${space?.riskLevel === 'medium' ? 'selected' : ''}>中</option>
                        <option ${space?.riskLevel === 'high' ? 'selected' : ''}>高</option>
                        <option ${space?.riskLevel === 'critical' ? 'selected' : ''}>极高</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('保存成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
            </div>
        </form>
    `;
}

function getSpaceDetail(id) {
    const space = mockData.spaces.find(s => s.id === id);
    if (!space) return '<p>未找到空间信息</p>';
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">空间类型</p><p class="font-medium">${space.type}</p></div>
                <div><p class="text-gray-500 text-sm">面积</p><p class="font-medium">${space.area}㎡</p></div>
                <div><p class="text-gray-500 text-sm">地址</p><p class="font-medium">${space.address}</p></div>
                <div><p class="text-gray-500 text-sm">管理人</p><p class="font-medium">${space.manager} (${space.phone})</p></div>
                <div><p class="text-gray-500 text-sm">商户数</p><p class="font-medium">${space.merchantCount}家</p></div>
                <div><p class="text-gray-500 text-sm">最大容量</p><p class="font-medium">${space.capacity}人</p></div>
            </div>
            <div class="border-t pt-4">
                <h4 class="font-medium mb-3">最近巡查记录</h4>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between text-gray-600">
                        <span>月度安全巡查</span>
                        <span>${space.lastInspection}</span>
                        <span class="text-green-600">正常</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getInspectionForm() {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                <input type="text" placeholder="请输入任务名称" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属空间</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${mockData.spaces.map(s => `<option>${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">巡查类型</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>日常巡查</option>
                        <option>专项检查</option>
                        <option>综合检查</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">巡查员</label>
                    <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">计划日期</label>
                    <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('创建成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">创建任务</button>
            </div>
        </form>
    `;
}

function getInspectionDetail(id) {
    const ins = mockData.inspections.find(i => i.id === id);
    if (!ins) return '<p>未找到任务信息</p>';
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">所属空间</p><p class="font-medium">${ins.space}</p></div>
                <div><p class="text-gray-500 text-sm">巡查类型</p><p class="font-medium">${ins.type}</p></div>
                <div><p class="text-gray-500 text-sm">巡查员</p><p class="font-medium">${ins.inspector}</p></div>
                <div><p class="text-gray-500 text-sm">检查日期</p><p class="font-medium">${ins.startDate}</p></div>
            </div>
            <div class="border-t pt-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium">检查进度</span>
                    <span class="text-sm">${ins.completed}/${ins.items}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill bg-blue-500" style="width: ${(ins.completed / ins.items * 100)}%"></div>
                </div>
            </div>
            <div class="text-red-600 font-medium">发现问题: ${ins.issues}个</div>
        </div>
    `;
}

function getHazardForm() {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">隐患标题</label>
                <input type="text" placeholder="请简要描述隐患" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属空间</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${mockData.spaces.map(s => `<option>${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">隐患类型</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>通道占用</option>
                        <option>消防设施</option>
                        <option>照明故障</option>
                        <option>监控设施</option>
                        <option>排水设施</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>低</option>
                        <option>中</option>
                        <option>高</option>
                        <option>极高</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">发现人</label>
                    <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">具体位置</label>
                <input type="text" placeholder="如：A区3号出口附近" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">上传照片/视频</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600">点击或拖拽文件到此处上传</p>
                    <p class="text-xs text-gray-400 mt-1">支持 JPG, PNG, MP4 格式，单文件不超过 10MB</p>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('隐患登记成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">提交登记</button>
            </div>
        </form>
    `;
}

function getHazardDetail(id) {
    const h = mockData.hazards.find(x => x.id === id);
    if (!h) return '<p>未找到隐患信息</p>';
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <span class="badge ${h.level === 'critical' ? 'badge-danger' : h.level === 'high' ? 'badge-warning' : 'badge-info'}">
                    ${h.level === 'critical' ? '极高' : h.level === 'high' ? '高' : h.level === 'medium' ? '中' : '低'}
                </span>
                <span class="badge badge-secondary">${h.type}</span>
                <span class="badge ${h.status === 'pending' ? 'badge-danger' : h.status === 'processing' ? 'badge-warning' : 'badge-success'}">
                    ${h.status === 'pending' ? '待处理' : h.status === 'processing' ? '处理中' : '已解决'}
                </span>
            </div>
            <div>
                <p class="text-gray-500 text-sm">位置</p>
                <p class="font-medium">${h.space} - ${h.location}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm">描述</p>
                <p class="text-gray-700">${h.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">发现人</p><p class="font-medium">${h.discoverer}</p></div>
                <div><p class="text-gray-500 text-sm">发现日期</p><p class="font-medium">${h.discoverDate}</p></div>
                <div><p class="text-gray-500 text-sm">处理人</p><p class="font-medium">${h.handler}</p></div>
                <div><p class="text-gray-500 text-sm">截止日期</p><p class="font-medium">${h.deadline}</p></div>
            </div>
            <div class="border-t pt-4">
                <p class="text-sm font-medium mb-2">附件照片</p>
                <div class="grid grid-cols-4 gap-2">
                    <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>
                    <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getAssignForm(id) {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">指派处理人/部门</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>物业王经理</option>
                    <option>工程部</option>
                    <option>安保部门</option>
                    <option>消防维保单位</option>
                    <option>商户管理部</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">整改期限</label>
                <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">备注说明</label>
                <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入整改要求和说明"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('派单成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认派单</button>
            </div>
        </form>
    `;
}

function getUploadForm() {
    return `
        <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600 mb-1">拖拽文件到此处，或点击选择</p>
                <p class="text-xs text-gray-400">支持 JPG, PNG, MP4 格式，单文件不超过 10MB</p>
                <input type="file" multiple accept="image/*,video/*" class="hidden">
            </div>
            <div class="space-y-2">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-image text-blue-500"></i>
                        <span class="text-sm">photo_001.jpg</span>
                    </div>
                    <span class="text-xs text-gray-500">2.3 MB</span>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('上传成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">上传</button>
            </div>
        </div>
    `;
}

function getBlindSpotForm(area) {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">所属区域</label>
                <input type="text" value="${area}" readonly class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">盲区位置</label>
                <input type="text" placeholder="请描述具体位置" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">盲区范围</label>
                <input type="text" placeholder="如：约5米范围" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('盲区登记成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认登记</button>
            </div>
        </form>
    `;
}

function getAreaDetail(name) {
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">区域名称</p><p class="font-medium">${name}</p></div>
                <div><p class="text-gray-500 text-sm">状态</p><p class="font-medium text-green-600">正常</p></div>
            </div>
            <div>
                <p class="text-gray-500 text-sm mb-2">区域设备</p>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between"><span>监控摄像头</span><span class="text-green-600">3个 (全部在线)</span></div>
                    <div class="flex justify-between"><span>消防栓</span><span class="text-green-600">2个 (正常)</span></div>
                    <div class="flex justify-between"><span>应急照明</span><span class="text-green-600">8个 (全部正常)</span></div>
                </div>
            </div>
        </div>
    `;
}

function getBlockedPassageDetail() {
    return `
        <div class="space-y-4">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="font-medium text-red-800">主通道中段 - 通道占用</p>
                <p class="text-sm text-red-600 mt-1">商户货物堆放，占用宽度约2米，影响通行</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">发现时间</p><p class="font-medium">2024-01-15 10:30</p></div>
                <div><p class="text-gray-500 text-sm">发现人</p><p class="font-medium">巡查员张三</p></div>
            </div>
            <div>
                <p class="text-gray-500 text-sm mb-2">现场照片</p>
                <div class="grid grid-cols-3 gap-2">
                    <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <i class="fas fa-image text-gray-400"></i>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
                <button onclick="closeModal(); alert('已派发整改通知')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">立即整改</button>
            </div>
        </div>
    `;
}

function getExitDetail(name) {
    const isBlocked = name.includes('堵塞');
    return `
        <div class="space-y-4">
            <div class="p-4 ${isBlocked ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} rounded-lg">
                <p class="font-medium ${isBlocked ? 'text-red-800' : 'text-green-800'}">${name}</p>
                <p class="text-sm ${isBlocked ? 'text-red-600' : 'text-green-600'} mt-1">
                    ${isBlocked ? '出口被杂物堵塞，无法正常通行' : '出口畅通，可正常使用'}
                </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">出口宽度</p><p class="font-medium">1.8米</p></div>
                <div><p class="text-gray-500 text-sm">通往</p><p class="font-medium">地面广场</p></div>
            </div>
        </div>
    `;
}

function getCameraDetail(name) {
    const isOffline = name.includes('离线');
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}"></div>
                <span class="font-medium">${name}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">状态</p><p class="font-medium ${isOffline ? 'text-red-600' : 'text-green-600'}">${isOffline ? '离线' : '在线'}</p></div>
                <div><p class="text-gray-500 text-sm">位置</p><p class="font-medium">主通道南侧</p></div>
                <div><p class="text-gray-500 text-sm">IP地址</p><p class="font-medium">192.168.1.101</p></div>
                <div><p class="text-gray-500 text-sm">上次在线</p><p class="font-medium">${isOffline ? '2024-01-14 18:30' : '刚刚'}</p></div>
            </div>
            ${isOffline ? `
                <div class="flex justify-end space-x-3 pt-4 border-t">
                    <button onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
                    <button onclick="closeModal(); alert('已通知运维人员')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">报修</button>
                </div>
            ` : ''}
        </div>
    `;
}

function getRectificationDetail(id) {
    const r = mockData.rectification.find(x => x.id === id);
    if (!r) return '<p>未找到信息</p>';
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <span class="badge ${r.level === 'critical' ? 'badge-danger' : 'badge-warning'}">${r.level === 'critical' ? '极高' : '高'}</span>
                <span class="badge ${r.status === 'pending' ? 'badge-secondary' : r.status === 'processing' ? 'badge-warning' : r.status === 'reviewing' ? 'badge-info' : 'badge-success'}">
                    ${r.status === 'pending' ? '待处理' : r.status === 'processing' ? '处理中' : r.status === 'reviewing' ? '待复查' : '已销项'}
                </span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">隐患</p><p class="font-medium">${r.hazard}</p></div>
                <div><p class="text-gray-500 text-sm">责任人</p><p class="font-medium">${r.handler}</p></div>
            </div>
            <div>
                <p class="text-gray-500 text-sm mb-2">整改跟踪记录</p>
                <div class="space-y-2">
                    ${r.logs.map(log => `
                        <div class="timeline-item">
                            <div class="text-sm">
                                <span class="font-medium">${log.action}</span>
                                <span class="text-gray-500 ml-2">${log.operator}</span>
                                <span class="text-gray-400 text-xs ml-2">${log.time}</span>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">${log.remark}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function getProgressForm(id) {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">当前进度</label>
                <input type="range" min="0" max="100" value="60" class="w-full">
                <div class="text-center text-lg font-medium text-blue-600">60%</div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">进展说明</label>
                <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请描述当前整改进展..."></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">上传现场照片</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500 cursor-pointer hover:border-blue-500">
                    <i class="fas fa-plus mr-1"></i> 添加照片
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('进度更新成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">更新进度</button>
            </div>
        </form>
    `;
}

function getClosureForm(id) {
    return `
        <form class="space-y-4">
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="font-medium text-red-800"><i class="fas fa-exclamation-triangle mr-2"></i>停业建议</p>
                <p class="text-sm text-red-600 mt-1">该隐患风险等级极高，建议立即停业整改，直至隐患消除</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">停业范围</label>
                <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>局部停业（隐患区域）</option>
                    <option>整层停业</option>
                    <option>全面停业</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">建议理由</label>
                <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('停业建议已提交')" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">提交建议</button>
            </div>
        </form>
    `;
}

function getMaterialForm() {
    return `
        <form class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">物资名称</label>
                    <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>个人防护</option>
                        <option>消防器材</option>
                        <option>照明设备</option>
                        <option>通讯设备</option>
                        <option>医疗急救</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">存放位置</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${mockData.spaces.map(s => `<option>${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">库存数量</label>
                    <input type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">有效期</label>
                    <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('物资添加成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">添加</button>
            </div>
        </form>
    `;
}

function getDrillForm() {
    return `
        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">演练名称</label>
                <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练地点</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${mockData.spaces.map(s => `<option>${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练类型</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>消防疏散</option>
                        <option>防汛排涝</option>
                        <option>反恐应急</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练日期</label>
                    <input type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">参与人数</label>
                    <input type="number" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">组织单位</label>
                    <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练结果</label>
                    <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>通过</option>
                        <option>未通过</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">演练总结</label>
                <textarea rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="closeModal(); alert('演练记录保存成功')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
            </div>
        </form>
    `;
}