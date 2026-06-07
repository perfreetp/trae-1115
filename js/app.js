let currentPage = 'dashboard';
let charts = {};
let currentEditingId = null;
let currentHazardId = null;

document.addEventListener('DOMContentLoaded', () => {
    initData();
    initNavigation();
    initToggleSidebar();
    initGlobalSearch();
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

function initGlobalSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.searchKeyword = e.target.value.trim();
            refreshCurrentPage();
        });
    }
}

function refreshCurrentPage() {
    loadPage(currentPage);
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

function applyFilter(page, field, value) {
    if (!currentFilters[page]) {
        currentFilters[page] = {};
    }
    currentFilters[page][field] = value === '' ? null : value;
    refreshCurrentPage();
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
                    labels: db.riskRanking.map(r => r.space),
                    datasets: [{
                        label: '风险评分',
                        data: db.riskRanking.map(r => r.riskScore),
                        backgroundColor: db.riskRanking.map(r => 
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
    
    currentEditingId = id;
    if (type === 'assignHazard' || type === 'uploadEvidence' || type === 'hazardDetail') {
        currentHazardId = id;
    }
    
    const modalConfigs = {
        addSpace: { title: '新增地下空间', content: getSpaceForm() },
        editSpace: { title: '编辑空间信息', content: getSpaceForm(id) },
        spaceDetail: { title: '空间详情', content: getSpaceDetail(id) },
        addInspection: { title: '新建巡查任务', content: getInspectionForm() },
        inspectionDetail: { title: '巡查任务详情', content: getInspectionDetail(id) },
        executeInspection: { title: '执行巡查任务', content: getInspectionExecuteForm(id) },
        addHazard: { title: '登记隐患', content: getHazardForm(null, id) },
        hazardDetail: { title: '隐患详情', content: getHazardDetail(id) },
        assignHazard: { title: '隐患派单', content: getAssignForm(id) },
        uploadEvidence: { title: '上传照片/视频', content: getUploadForm(id) },
        registerBlindSpot: { title: '登记监控盲区', content: getBlindSpotForm(id) },
        areaDetail: { title: `${id} - 区域详情`, content: getAreaDetail(id) },
        blockedPassage: { title: '通道占用详情', content: getBlockedPassageDetail() },
        exitDetail: { title: `${id} - 出口详情`, content: getExitDetail(id) },
        cameraDetail: { title: `${id} - 监控详情`, content: getCameraDetail(id) },
        rectificationDetail: { title: '整改进展详情', content: getRectificationDetail(id) },
        updateProgress: { title: '更新整改进度', content: getProgressForm(id) },
        rejectReview: { title: '复查不通过说明', content: getRejectReviewForm(id) },
        suggestClosure: { title: '停业建议', content: getClosureForm(id) },
        addMaterial: { title: '新增应急物资', content: getMaterialForm() },
        addDrill: { title: '记录演练', content: getDrillForm() },
        recordPassage: { title: '记录通道占用', content: getPassageRecordForm() }
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
    currentEditingId = null;
    currentHazardId = null;
}

function getSpaceForm(id = null) {
    const space = id ? db.spaces.find(s => s.id === id) : null;
    const formId = id ? 'editSpaceForm' : 'addSpaceForm';
    return `
        <form id="${formId}" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">空间名称</label>
                    <input type="text" name="name" value="${space?.name || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">空间类型</label>
                    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="商场" ${space?.type === '商场' ? 'selected' : ''}>商场</option>
                        <option value="通道" ${space?.type === '通道' ? 'selected' : ''}>通道</option>
                        <option value="车库" ${space?.type === '车库' ? 'selected' : ''}>车库</option>
                        <option value="仓库" ${space?.type === '仓库' ? 'selected' : ''}>仓库</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">面积(㎡)</label>
                    <input type="number" name="area" value="${space?.area || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">楼层数</label>
                    <input type="number" name="floors" value="${space?.floors || 1}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <input type="text" name="address" value="${space?.address || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">管理人</label>
                    <input type="text" name="manager" value="${space?.manager || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input type="tel" name="phone" value="${space?.phone || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">最大容纳人数</label>
                    <input type="number" name="capacity" value="${space?.capacity || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
                    <select name="riskLevel" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="low" ${space?.riskLevel === 'low' ? 'selected' : ''}>低</option>
                        <option value="medium" ${space?.riskLevel === 'medium' ? 'selected' : ''}>中</option>
                        <option value="high" ${space?.riskLevel === 'high' ? 'selected' : ''}>高</option>
                        <option value="critical" ${space?.riskLevel === 'critical' ? 'selected' : ''}>极高</option>
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="${id ? `saveSpaceEdit(${id})` : 'saveSpace()'}" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
            </div>
        </form>
    `;
}

function saveSpace() {
    const form = document.getElementById('addSpaceForm');
    const formData = new FormData(form);
    const space = {
        name: formData.get('name'),
        type: formData.get('type'),
        area: parseInt(formData.get('area')) || 0,
        floors: parseInt(formData.get('floors')) || 1,
        address: formData.get('address'),
        manager: formData.get('manager'),
        phone: formData.get('phone'),
        capacity: parseInt(formData.get('capacity')) || 0,
        riskLevel: formData.get('riskLevel'),
        merchantCount: 0,
        lastInspection: new Date().toISOString().split('T')[0]
    };
    
    addSpace(space);
    closeModal();
    refreshCurrentPage();
}

function saveSpaceEdit(id) {
    const form = document.getElementById('editSpaceForm');
    const formData = new FormData(form);
    const updates = {
        name: formData.get('name'),
        type: formData.get('type'),
        area: parseInt(formData.get('area')) || 0,
        floors: parseInt(formData.get('floors')) || 1,
        address: formData.get('address'),
        manager: formData.get('manager'),
        phone: formData.get('phone'),
        capacity: parseInt(formData.get('capacity')) || 0,
        riskLevel: formData.get('riskLevel')
    };
    
    updateSpace(id, updates);
    closeModal();
    refreshCurrentPage();
}

function getSpaceDetail(id) {
    const space = db.spaces.find(s => s.id === id);
    if (!space) return '<p>未找到空间信息</p>';
    return `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">空间类型</p><p class="font-medium">${space.type}</p></div>
                <div><p class="text-gray-500 text-sm">面积</p><p class="font-medium">${space.area}㎡</p></div>
                <div><p class="text-gray-500 text-sm">地址</p><p class="font-medium">${space.address}</p></div>
                <div><p class="text-gray-500 text-sm">管理人</p><p class="font-medium">${space.manager} (${space.phone})</p></div>
                <div><p class="text-gray-500 text-sm">商户数</p><p class="font-medium">${space.merchantCount || 0}家</p></div>
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
        <form id="addInspectionForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
                <input type="text" name="name" placeholder="请输入任务名称" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属空间</label>
                    <select name="space" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${db.spaces.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">巡查类型</label>
                    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="日常巡查">日常巡查</option>
                        <option value="专项检查">专项检查</option>
                        <option value="综合检查">综合检查</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">巡查员</label>
                    <input type="text" name="inspector" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">计划日期</label>
                    <input type="date" name="startDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="saveInspection()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">创建任务</button>
            </div>
        </form>
    `;
}

function saveInspection() {
    const form = document.getElementById('addInspectionForm');
    const formData = new FormData(form);
    const inspection = {
        name: formData.get('name'),
        space: formData.get('space'),
        type: formData.get('type'),
        inspector: formData.get('inspector'),
        startDate: formData.get('startDate'),
        items: 10,
        completed: 0,
        issues: 0,
        status: 'pending'
    };
    
    db.inspections.push(inspection);
    saveData();
    closeModal();
    refreshCurrentPage();
}

function getInspectionDetail(id) {
    const ins = db.inspections.find(i => i.id === id);
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

function executeInspection(id) {
    showModal('executeInspection', id);
}

function getInspectionExecuteForm(id) {
    const ins = db.inspections.find(i => i.id === id);
    if (!ins) return '<p>未找到任务信息</p>';
    
    const categoryLabels = {
        '消防门': { icon: 'fa-door-open', color: 'text-orange-500' },
        '排水泵': { icon: 'fa-water', color: 'text-blue-500' },
        '照明': { icon: 'fa-lightbulb', color: 'text-yellow-500' },
        '通道占用': { icon: 'fa-route', color: 'text-purple-500' },
        '监控盲区': { icon: 'fa-video', color: 'text-green-500' }
    };
    
    return `
        <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="font-medium text-blue-800">${ins.title}</h4>
                        <p class="text-sm text-blue-600">${ins.space} · ${ins.inspector}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-blue-600">${ins.completed}/${ins.items}</p>
                        <p class="text-xs text-blue-500">已完成检查项</p>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="progress-bar">
                        <div class="progress-fill ${ins.completed === ins.items ? 'bg-green-500' : 'bg-blue-500'}" style="width: ${(ins.completed / ins.items * 100)}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="max-h-80 overflow-y-auto space-y-3">
                ${ins.checkItems.map(item => `
                    <div class="border rounded-lg p-4 ${item.checked ? (item.result === '异常' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200') : 'bg-white'}">
                        <div class="flex items-start justify-between">
                            <div class="flex items-start space-x-3">
                                <input type="checkbox" 
                                    ${item.checked ? 'checked' : ''} 
                                    onchange="toggleCheckItem(${ins.id}, ${item.id}, this.checked)"
                                    class="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
                                <div>
                                    <div class="flex items-center space-x-2">
                                        <i class="fas ${categoryLabels[item.category]?.icon || 'fa-check'} ${categoryLabels[item.category]?.color || 'text-gray-500'}"></i>
                                        <span class="font-medium">${item.name}</span>
                                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${item.category}</span>
                                    </div>
                                    ${item.checked && item.result === '异常' ? `
                                        <p class="text-sm text-red-600 mt-1"><i class="fas fa-exclamation-triangle mr-1"></i>${item.remark || '发现异常'}</p>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="flex items-center space-x-2">
                                ${item.checked ? `
                                    <span class="text-sm px-2 py-1 rounded ${item.result === '异常' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                                        ${item.result}
                                    </span>
                                    ${item.result === '异常' ? `
                                        <button onclick="registerHazardFromCheck(${ins.id}, ${item.id})" class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                            <i class="fas fa-plus-circle mr-1"></i>登记隐患
                                        </button>
                                    ` : ''}
                                ` : `
                                    <div class="flex space-x-1">
                                        <button onclick="markCheckResult(${ins.id}, ${item.id}, '正常')" class="text-xs px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
                                            正常
                                        </button>
                                        <button onclick="markCheckResult(${ins.id}, ${item.id}, '异常')" class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                            异常
                                        </button>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="flex justify-between pt-4 border-t">
                <button onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">暂存退出</button>
                ${ins.completed === ins.items ? `
                    <button onclick="completeInspection(${ins.id})" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">完成巡查</button>
                ` : `
                    <span class="text-sm text-gray-500 flex items-center"><i class="fas fa-info-circle mr-1"></i>请完成所有检查项</span>
                `}
            </div>
        </div>
    `;
}

function toggleCheckItem(inspectionId, itemId, checked) {
    const result = checked ? '正常' : '';
    updateInspectionCheckItem(inspectionId, itemId, { checked: checked, result: result });
    showModal('executeInspection', inspectionId);
}

function markCheckResult(inspectionId, itemId, result) {
    updateInspectionCheckItem(inspectionId, itemId, { checked: true, result: result, remark: result === '异常' ? '检查发现异常' : '' });
    showModal('executeInspection', inspectionId);
}

function registerHazardFromCheck(inspectionId, itemId) {
    currentEditingId = { inspectionId, itemId };
    showModal('addHazard', { inspectionId, itemId });
}

function completeInspection(id) {
    const ins = db.inspections.find(i => i.id === id);
    if (ins) {
        ins.status = 'completed';
        ins.endDate = new Date().toISOString().split('T')[0];
        saveData();
    }
    closeModal();
    refreshCurrentPage();
}

function getHazardForm(id = null, fromInspection = null) {
    let prefill = {};
    if (fromInspection && typeof fromInspection === 'object') {
        const ins = db.inspections.find(i => i.id === fromInspection.inspectionId);
        const item = ins?.checkItems?.find(it => it.id === fromInspection.itemId);
        if (ins && item) {
            const typeMap = {
                '消防门': '消防设施',
                '排水泵': '排水设施',
                '照明': '照明故障',
                '通道占用': '通道占用',
                '监控盲区': '监控设施'
            };
            prefill = {
                title: item.name + ' - 异常',
                space: ins.space,
                type: typeMap[item.category] || '其他',
                discoverer: ins.inspector,
                location: item.name,
                description: item.remark || '巡查中发现异常',
                fromInspectionId: fromInspection.inspectionId
            };
        }
    }
    
    return `
        <form id="addHazardForm" class="space-y-4">
            ${prefill.fromInspectionId ? `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    <i class="fas fa-info-circle mr-2"></i>
                    来自巡查任务登记，已自动填充相关信息
                </div>
            ` : ''}
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">隐患标题</label>
                <input type="text" name="title" value="${prefill.title || ''}" placeholder="请简要描述隐患" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属空间</label>
                    <select name="space" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${db.spaces.map(s => `<option value="${s.name}" ${prefill.space === s.name ? 'selected' : ''}>${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">隐患类型</label>
                    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="通道占用" ${prefill.type === '通道占用' ? 'selected' : ''}>通道占用</option>
                        <option value="消防设施" ${prefill.type === '消防设施' ? 'selected' : ''}>消防设施</option>
                        <option value="照明故障" ${prefill.type === '照明故障' ? 'selected' : ''}>照明故障</option>
                        <option value="监控设施" ${prefill.type === '监控设施' ? 'selected' : ''}>监控设施</option>
                        <option value="排水设施" ${prefill.type === '排水设施' ? 'selected' : ''}>排水设施</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">风险等级</label>
                    <select name="level" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high" selected>高</option>
                        <option value="critical">极高</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">发现人</label>
                    <input type="text" name="discoverer" value="${prefill.discoverer || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">具体位置</label>
                <input type="text" name="location" value="${prefill.location || ''}" placeholder="如：A区3号出口附近" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                <textarea name="description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">${prefill.description || ''}</textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">上传照片/视频</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer" onclick="document.getElementById('hazardFileInput').click()">
                    <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                    <p class="text-sm text-gray-600">点击选择文件</p>
                    <p class="text-xs text-gray-400 mt-1">支持 JPG, PNG, MP4 格式</p>
                    <input type="file" id="hazardFileInput" multiple accept="image/*,video/*" class="hidden" onchange="handleHazardFiles(this.files)">
                </div>
                <div id="hazardFileList" class="mt-2 space-y-1"></div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="saveHazard(${prefill.fromInspectionId || 'null'})" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">提交登记</button>
            </div>
        </form>
    `;
}

let pendingHazardFiles = [];

function handleHazardFiles(files) {
    pendingHazardFiles = Array.from(files);
    const fileList = document.getElementById('hazardFileList');
    if (fileList) {
        fileList.innerHTML = pendingHazardFiles.map(f => `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <span><i class="fas ${f.type.startsWith('image') ? 'fa-image' : 'fa-video'} text-blue-500 mr-2"></i>${f.name}</span>
                <span class="text-gray-500">${(f.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        `).join('');
    }
}

function saveHazard(fromInspectionId = null) {
    const form = document.getElementById('addHazardForm');
    const formData = new FormData(form);
    
    const hazard = {
        title: formData.get('title'),
        space: formData.get('space'),
        type: formData.get('type'),
        level: formData.get('level'),
        discoverer: formData.get('discoverer') || '巡查员',
        location: formData.get('location'),
        description: formData.get('description'),
        discoverDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        handler: '待指派',
        deadline: '',
        attachments: pendingHazardFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
        fromInspectionId: fromInspectionId
    };
    
    const newHazard = addHazard(hazard);
    pendingHazardFiles = [];
    closeModal();
    refreshCurrentPage();
}

function getHazardDetail(id) {
    const h = db.hazards.find(x => x.id === id);
    if (!h) return '<p>未找到隐患信息</p>';
    
    const levelText = { critical: '极高', high: '高', medium: '中', low: '低' };
    const statusText = { pending: '待处理', processing: '处理中', resolved: '已解决' };
    
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3 flex-wrap gap-2">
                <span class="badge ${h.level === 'critical' ? 'badge-danger' : h.level === 'high' ? 'badge-warning' : 'badge-info'}">
                    ${levelText[h.level] || h.level}
                </span>
                <span class="badge badge-secondary">${h.type}</span>
                <span class="badge ${h.status === 'pending' ? 'badge-danger' : h.status === 'processing' ? 'badge-warning' : 'badge-success'}">
                    ${statusText[h.status] || h.status}
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
                <div><p class="text-gray-500 text-sm">截止日期</p><p class="font-medium">${h.deadline || '-'}</p></div>
            </div>
            ${h.attachments && h.attachments.length > 0 ? `
            <div class="border-t pt-4">
                <p class="text-sm font-medium mb-2">附件列表</p>
                <div class="space-y-2">
                    ${h.attachments.map(a => `
                        <div class="flex items-center p-2 bg-gray-50 rounded-lg">
                            <i class="fas ${a.type && a.type.startsWith('image') ? 'fa-image text-blue-500' : 'fa-video text-purple-500'} mr-3"></i>
                            <div class="flex-1">
                                <p class="text-sm font-medium">${a.name}</p>
                                <p class="text-xs text-gray-500">${a.size ? (a.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function getAssignForm(id) {
    const h = db.hazards.find(x => x.id === id);
    return `
        <form id="assignForm" class="space-y-4">
            <div class="p-3 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">隐患：${h?.title || ''}</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">指派处理人/部门</label>
                <select name="handler" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="物业王经理">物业王经理</option>
                    <option value="工程部">工程部</option>
                    <option value="安保部门">安保部门</option>
                    <option value="消防维保单位">消防维保单位</option>
                    <option value="商户管理部">商户管理部</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">整改期限</label>
                <input type="date" name="deadline" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">备注说明</label>
                <textarea name="remark" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入整改要求和说明"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="assignHazard('${id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">确认派单</button>
            </div>
        </form>
    `;
}

function assignHazard(id) {
    const form = document.getElementById('assignForm');
    const formData = new FormData(form);
    const handler = formData.get('handler');
    const deadline = formData.get('deadline');
    const remark = formData.get('remark') || '隐患已派单处理';
    
    const hazard = db.hazards.find(h => h.id === id);
    if (!hazard) return;
    
    updateHazard(id, {
        handler: handler,
        deadline: deadline,
        status: 'processing'
    });
    
    let rect = db.rectification.find(r => r.hazardId === id);
    if (rect) {
        updateRectification(rect.id, {
            handler: handler,
            deadline: deadline,
            status: 'processing'
        });
        addRectificationLog(rect.id, '派单', remark, handler);
    } else {
        const newRect = {
            id: generateId(db.rectification),
            hazardId: id,
            hazard: hazard.title,
            space: hazard.space,
            level: hazard.level,
            assignDate: new Date().toISOString().split('T')[0],
            handler: handler,
            deadline: deadline,
            progress: 0,
            status: 'processing',
            logs: [{
                time: new Date().toLocaleString('zh-CN'),
                action: '派单',
                operator: handler,
                remark: remark
            }]
        };
        db.rectification.push(newRect);
        saveData();
    }
    
    closeModal();
    refreshCurrentPage();
}

function getUploadForm(id) {
    return `
        <div class="space-y-4">
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer" onclick="document.getElementById('uploadFileInput').click()">
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                <p class="text-gray-600 mb-1">拖拽文件到此处，或点击选择</p>
                <p class="text-xs text-gray-400">支持 JPG, PNG, MP4 格式，单文件不超过 10MB</p>
                <input type="file" id="uploadFileInput" multiple accept="image/*,video/*" class="hidden" onchange="handleUploadFiles(this.files)">
            </div>
            <div id="uploadFileList" class="space-y-2"></div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="saveUploads('${id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">上传</button>
            </div>
        </div>
    `;
}

let pendingUploadFiles = [];

function handleUploadFiles(files) {
    pendingUploadFiles = Array.from(files);
    const fileList = document.getElementById('uploadFileList');
    if (fileList) {
        fileList.innerHTML = pendingUploadFiles.map(f => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <i class="fas ${f.type.startsWith('image') ? 'fa-image text-blue-500' : 'fa-video text-purple-500'}"></i>
                    <span class="text-sm">${f.name}</span>
                </div>
                <span class="text-xs text-gray-500">${(f.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
        `).join('');
    }
}

function saveUploads(hazardId) {
    const files = pendingUploadFiles.map(f => ({ name: f.name, type: f.type, size: f.size }));
    files.forEach(f => addAttachment(hazardId, f));
    pendingUploadFiles = [];
    closeModal();
    refreshCurrentPage();
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
    const nameStr = String(name || '');
    const isBlocked = nameStr.includes('堵塞');
    return `
        <div class="space-y-4">
            <div class="p-4 ${isBlocked ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'} rounded-lg">
                <p class="font-medium ${isBlocked ? 'text-red-800' : 'text-green-800'}">${nameStr}</p>
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
    const nameStr = String(name || '');
    const isOffline = nameStr.includes('离线');
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}"></div>
                <span class="font-medium">${nameStr}</span>
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
    const r = db.rectification.find(x => x.id === id);
    if (!r) return '<p>未找到信息</p>';
    
    const levelText = { critical: '极高', high: '高', medium: '中', low: '低' };
    const statusText = { pending: '待处理', processing: '处理中', reviewing: '待复查', resolved: '已销项' };
    
    return `
        <div class="space-y-4">
            <div class="flex items-center space-x-3 flex-wrap gap-2">
                <span class="badge ${r.level === 'critical' ? 'badge-danger' : r.level === 'high' ? 'badge-warning' : 'badge-info'}">${levelText[r.level] || r.level}</span>
                <span class="badge ${r.status === 'pending' ? 'badge-secondary' : r.status === 'processing' ? 'badge-warning' : r.status === 'reviewing' ? 'badge-info' : 'badge-success'}">
                    ${statusText[r.status] || r.status}
                </span>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div><p class="text-gray-500 text-sm">隐患</p><p class="font-medium">${r.hazard}</p></div>
                <div><p class="text-gray-500 text-sm">责任人</p><p class="font-medium">${r.handler}</p></div>
                <div><p class="text-gray-500 text-sm">当前进度</p><p class="font-medium">${r.progress || 0}%</p></div>
            </div>
            <div>
                <p class="text-gray-500 text-sm mb-2">整改跟踪记录</p>
                <div class="space-y-2">
                    ${(r.logs || []).map(log => `
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
    const r = db.rectification.find(x => x.id === id);
    const currentProgress = r?.progress || 0;
    return `
        <form id="progressForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">当前进度</label>
                <input type="range" name="progress" min="0" max="100" value="${currentProgress}" class="w-full" oninput="document.getElementById('progressValue').textContent = this.value + '%'">
                <div id="progressValue" class="text-center text-lg font-medium text-blue-600">${currentProgress}%</div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">进展说明</label>
                <textarea name="remark" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请描述当前整改进展..."></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="updateProgress('${id}')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">更新进度</button>
            </div>
        </form>
    `;
}

function updateProgress(id) {
    const form = document.getElementById('progressForm');
    const formData = new FormData(form);
    const progress = parseInt(formData.get('progress')) || 0;
    const remark = formData.get('remark') || '';
    
    updateRectification(id, { progress: progress });
    addRectificationLog(id, '更新进度', `进度更新至 ${progress}%。${remark}`, '当前用户');
    
    closeModal();
    refreshCurrentPage();
}

function startRectification(id) {
    updateRectification(id, { status: 'processing', progress: 5 });
    addRectificationLog(id, '开始处理', '已开始处理该隐患', '当前用户');
    refreshCurrentPage();
}

function submitReview(id) {
    updateRectification(id, { status: 'reviewing', progress: 100 });
    addRectificationLog(id, '提交复查', '整改完成，申请复查', '当前用户');
    refreshCurrentPage();
}

function approveReview(id) {
    updateRectification(id, { status: 'resolved', progress: 100 });
    addRectificationLog(id, '复查通过', '复查通过，隐患已销项', '复查人员');
    
    const r = db.rectification.find(x => x.id === id);
    if (r && r.hazardId) {
        updateHazard(r.hazardId, { status: 'resolved' });
    }
    
    closeModal();
    refreshCurrentPage();
}

function getRejectReviewForm(id) {
    return `
        <form id="rejectReviewForm" class="space-y-4">
            <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p class="font-medium text-orange-800"><i class="fas fa-exclamation-circle mr-2"></i>复查不通过</p>
                <p class="text-sm text-orange-600 mt-1">请填写不通过原因，整改将退回处理中状态</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">不通过原因 <span class="text-red-500">*</span></label>
                <textarea name="reason" rows="4" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请详细说明复查不通过的原因和需要继续整改的内容..." required></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="submitRejectReview('${id}')" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">确认不通过</button>
            </div>
        </form>
    `;
}

function submitRejectReview(id) {
    const form = document.getElementById('rejectReviewForm');
    const formData = new FormData(form);
    const reason = formData.get('reason');
    
    if (!reason || reason.trim() === '') {
        alert('请填写不通过原因');
        return;
    }
    
    const rect = db.rectification.find(x => x.id === id);
    const currentProgress = rect?.progress || 100;
    const fallbackProgress = Math.max(50, Math.floor(currentProgress * 0.8));
    
    updateRectification(id, { status: 'processing', progress: fallbackProgress });
    addRectificationLog(id, '复查不通过', `复查不通过，原因：${reason}，进度回退至 ${fallbackProgress}%`, '复查人员');
    
    if (rect && rect.hazardId) {
        updateHazard(rect.hazardId, { status: 'processing' });
    }
    
    closeModal();
    refreshCurrentPage();
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
        <form id="addMaterialForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">物资名称</label>
                    <input type="text" name="name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <select name="category" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="个人防护">个人防护</option>
                        <option value="消防器材">消防器材</option>
                        <option value="照明设备">照明设备</option>
                        <option value="通讯设备">通讯设备</option>
                        <option value="医疗急救">医疗急救</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">存放位置</label>
                    <select name="space" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${db.spaces.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">库存数量</label>
                    <input type="number" name="total" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">有效期</label>
                    <input type="date" name="expiryDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="saveMaterial()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">添加</button>
            </div>
        </form>
    `;
}

function saveMaterial() {
    const form = document.getElementById('addMaterialForm');
    const formData = new FormData(form);
    const material = {
        name: formData.get('name'),
        category: formData.get('category'),
        space: formData.get('space'),
        total: parseInt(formData.get('total')) || 0,
        available: parseInt(formData.get('total')) || 0,
        expiryDate: formData.get('expiryDate'),
        lastCheck: new Date().toISOString().split('T')[0]
    };
    
    addMaterial(material);
    closeModal();
    refreshCurrentPage();
}

function getDrillForm() {
    return `
        <form id="addDrillForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">演练名称</label>
                <input type="text" name="title" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练地点</label>
                    <select name="space" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        ${db.spaces.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练类型</label>
                    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="消防疏散">消防疏散</option>
                        <option value="防汛排涝">防汛排涝</option>
                        <option value="反恐应急">反恐应急</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练日期</label>
                    <input type="date" name="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">参与人数</label>
                    <input type="number" name="participants" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">组织单位</label>
                    <input type="text" name="organizer" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">演练结果</label>
                    <select name="result" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="通过">通过</option>
                        <option value="未通过">未通过</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">演练总结</label>
                <textarea name="description" rows="3" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="saveDrill()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
            </div>
        </form>
    `;
}

function saveDrill() {
    const form = document.getElementById('addDrillForm');
    const formData = new FormData(form);
    const resultText = formData.get('result');
    const resultMap = { '通过': 'pass', '未通过': 'fail' };
    const drill = {
        title: formData.get('title'),
        space: formData.get('space'),
        type: formData.get('type'),
        date: formData.get('date'),
        participants: parseInt(formData.get('participants')) || 0,
        organizer: formData.get('organizer'),
        result: resultMap[resultText] || 'pass',
        description: formData.get('description'),
        duration: 60
    };
    
    addDrill(drill);
    closeModal();
    refreshCurrentPage();
}

function zoomFloorPlan(delta) {
    const minZoom = 50;
    const maxZoom = 200;
    db.floorPlanZoom = Math.max(minZoom, Math.min(maxZoom, (db.floorPlanZoom || 100) + delta));
    saveData();
    refreshCurrentPage();
}

function getPassageRecordForm() {
    return `
        <form id="passageRecordForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">所属空间</label>
                <select name="space" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    ${db.spaces.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">通道位置</label>
                <input type="text" name="location" placeholder="如：A区主通道中段" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">占用类型</label>
                    <select name="type" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="货物堆放">货物堆放</option>
                        <option value="设备摆放">设备摆放</option>
                        <option value="施工围挡">施工围挡</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">占用宽度(米)</label>
                    <input type="number" name="width" step="0.1" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">责任单位/个人</label>
                <input type="text" name="responsible" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
                <textarea name="description" rows="2" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="请描述占用情况..."></textarea>
            </div>
            <div class="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button type="button" onclick="savePassageRecord()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存记录</button>
            </div>
        </form>
    `;
}

function savePassageRecord() {
    const form = document.getElementById('passageRecordForm');
    const formData = new FormData(form);
    const type = formData.get('type');
    const width = parseFloat(formData.get('width')) || 0;
    const responsible = formData.get('responsible') || '';
    const description = formData.get('description') || `${type}，约${width}米宽`;
    
    const record = {
        location: formData.get('location'),
        space: formData.get('space'),
        type: type,
        width: width,
        responsible: responsible,
        description: description,
        discoverDate: new Date().toISOString().split('T')[0],
        discoverer: '当前用户',
        status: 'pending'
    };
    
    addPassageRecord(record);
    closeModal();
    refreshCurrentPage();
}

function exportFloorPlan() {
    const svgContent = document.getElementById('floorPlanSvg');
    if (!svgContent) {
        alert('未找到图纸内容');
        return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svgContent);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `分区平面图_${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('图纸导出成功！已下载为 SVG 文件。');
}