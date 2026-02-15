// Dashboard module with role-based views
const dashboardData = {
    metrics: {
        overall: {
            slaPercentage: 94.2,
            avgResponseTime: '2.4 jam',
            avgResolutionTime: '18.5 jam',
            customerSatisfaction: 4.2
        },
        daily: {
            ticketsCreated: 24,
            ticketsResolved: 22,
            ticketsOverdue: 2,
            escalationCount: 1
        },
        monthly: {
            slaTarget: 95,
            slaAchieved: 94.2,
            totalTickets: 342,
            resolvedTickets: 332,
            overdueTickets: 10
        }
    },
    
    alerts: [
        {
            id: 1,
            type: 'warning',
            title: 'SLA Akan Melebihi Batas',
            message: '3 tiket mendekati waktu SLA deadline',
            time: '2 jam lalu',
            priority: 'medium'
        },
        {
            id: 2,
            type: 'critical',
            title: 'SLA Terlambat',
            message: 'Tiket #TKT-2023-087 telah melewati deadline',
            time: '1 jam lalu',
            priority: 'high'
        },
        {
            id: 3,
            type: 'info',
            title: 'Performa Bulanan',
            message: 'SLA bulan ini mencapai 94.2%, naik 1.3% dari bulan lalu',
            time: '1 hari lalu',
            priority: 'low'
        }
    ],
    
    recentActivities: [
        {
            id: 1,
            user: 'Budi Santoso',
            action: 'mengupdate tiket',
            ticketId: 'TKT-2023-087',
            status: 'Dalam Proses',
            time: '10 menit lalu',
            icon: 'fa-ticket-alt'
        },
        {
            id: 2,
            user: 'Siti Rahayu',
            action: 'menyelesaikan tiket',
            ticketId: 'TKT-2023-086',
            status: 'Selesai',
            time: '1 jam lalu',
            icon: 'fa-check-circle'
        },
        {
            id: 3,
            user: 'Rina Dewi',
            action: 'membuat tiket baru',
            ticketId: 'TKT-2023-088',
            category: 'Network Issue',
            time: '2 jam lalu',
            icon: 'fa-plus-circle'
        }
    ]
};

function initDashboard() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Load user-specific dashboard
    loadUserDashboard(user.role);
    
    // Load metrics
    loadDashboardMetrics();
    
    // Load alerts
    loadAlerts();
    
    // Load recent activities
    loadRecentActivities();
    
    // Initialize charts
    initDashboardCharts();
    
    // Update real-time data
    updateRealTimeData();
    
    // Setup dashboard filters
    setupDashboardFilters();
}

function loadUserDashboard(role) {
    // Update welcome message
    const welcomeElement = document.getElementById('welcomeMessage');
    if (welcomeElement) {
        const user = getCurrentUser();
        const time = new Date().getHours();
        let greeting = '';
        
        if (time < 12) greeting = 'Selamat Pagi';
        else if (time < 18) greeting = 'Selamat Siang';
        else greeting = 'Selamat Malam';
        
        welcomeElement.innerHTML = `
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">${greeting}, ${user.name}!</h1>
            <p class="text-gray-600 mt-1">Berikut adalah ringkasan performa SLA hari ini</p>
        `;
    }
    
    // Show/hide elements based on role
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const teknisiOnlyElements = document.querySelectorAll('.teknisi-only');
    const marketingOnlyElements = document.querySelectorAll('.marketing-only');
    
    if (role === 'admin') {
        adminOnlyElements.forEach(el => el.classList.remove('hidden'));
    } else if (role === 'teknisi') {
        teknisiOnlyElements.forEach(el => el.classList.remove('hidden'));
    } else if (role === 'marketing') {
        marketingOnlyElements.forEach(el => el.classList.remove('hidden'));
    }
}

function loadDashboardMetrics() {
    // Overall metrics
    document.getElementById('slaPercentage').textContent = dashboardData.metrics.overall.slaPercentage + '%';
    document.getElementById('avgResponseTime').textContent = dashboardData.metrics.overall.avgResponseTime;
    document.getElementById('avgResolutionTime').textContent = dashboardData.metrics.overall.avgResolutionTime;
    document.getElementById('customerSatisfaction').textContent = dashboardData.metrics.overall.customerSatisfaction + '/5';
    
    // Daily metrics
    document.getElementById('ticketsCreated').textContent = dashboardData.metrics.daily.ticketsCreated;
    document.getElementById('ticketsResolved').textContent = dashboardData.metrics.daily.ticketsResolved;
    document.getElementById('ticketsOverdue').textContent = dashboardData.metrics.daily.ticketsOverdue;
    document.getElementById('escalationCount').textContent = dashboardData.metrics.daily.escalationCount;
    
    // Monthly metrics
    const slaAchievement = document.getElementById('slaAchievement');
    if (slaAchievement) {
        const percentage = dashboardData.metrics.monthly.slaAchieved;
        const target = dashboardData.metrics.monthly.slaTarget;
        const difference = percentage - target;
        
        slaAchievement.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-2xl font-bold">${percentage}%</span>
                <span class="text-sm ${difference >= 0 ? 'text-green-600' : 'text-red-600'}">
                    ${difference >= 0 ? '+' : ''}${difference.toFixed(1)}%
                </span>
            </div>
            <p class="text-gray-600 text-sm mt-1">Dari target ${target}%</p>
        `;
    }
}

function loadAlerts() {
    const alertsContainer = document.getElementById('alertsContainer');
    if (!alertsContainer) return;
    
    alertsContainer.innerHTML = '';
    
    dashboardData.alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `p-4 rounded-lg border-l-4 ${
            alert.type === 'critical' ? 'border-red-500 bg-red-50' :
            alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
        }`;
        
        alertElement.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas ${
                        alert.type === 'critical' ? 'fa-exclamation-triangle text-red-500' :
                        alert.type === 'warning' ? 'fa-exclamation-circle text-yellow-500' :
                        'fa-info-circle text-blue-500'
                    } text-lg"></i>
                </div>
                <div class="ml-3 flex-1">
                    <div class="flex justify-between">
                        <h4 class="text-sm font-medium ${alert.type === 'critical' ? 'text-red-800' : alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}">
                            ${alert.title}
                        </h4>
                        <span class="text-xs text-gray-500">${alert.time}</span>
                    </div>
                    <p class="mt-1 text-sm ${alert.type === 'critical' ? 'text-red-700' : alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'}">
                        ${alert.message}
                    </p>
                    ${alert.priority === 'high' ? 
                        '<span class="inline-block mt-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">PRIORITAS TINGGI</span>' : 
                        ''}
                </div>
            </div>
        `;
        
        alertsContainer.appendChild(alertElement);
    });
}

function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    if (!activitiesContainer) return;
    
    activitiesContainer.innerHTML = '';
    
    dashboardData.recentActivities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-start py-3 border-b border-gray-100 last:border-0';
        
        activityElement.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="fas ${activity.icon} text-blue-600"></i>
            </div>
            <div class="ml-3 flex-1">
                <p class="text-sm">
                    <span class="font-medium">${activity.user}</span> ${activity.action}
                    ${activity.ticketId ? `<span class="font-medium">${activity.ticketId}</span>` : ''}
                    ${activity.status ? `menjadi <span class="font-medium">${activity.status}</span>` : ''}
                    ${activity.category ? `dengan kategori <span class="font-medium">${activity.category}</span>` : ''}
                </p>
                <p class="text-xs text-gray-500 mt-1">${activity.time}</p>
            </div>
        `;
        
        activitiesContainer.appendChild(activityElement);
    });
}

function initDashboardCharts() {
    // SLA Trend Chart
    const slaTrendCtx = document.getElementById('slaTrendChart');
    if (slaTrendCtx) {
        const slaTrendChart = new Chart(slaTrendCtx, {
            type: 'line',
            data: {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                datasets: [{
                    label: 'SLA Aktual (%)',
                    data: [91.5, 92.8, 93.2, 94.2],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }, {
                    label: 'Target SLA (%)',
                    data: [92, 92, 92, 92],
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0
                }]
            },
            options: getChartOptions('Trend SLA Bulanan', '%')
        });
    }
    
    // Ticket Status Chart
    const ticketStatusCtx = document.getElementById('ticketStatusChart');
    if (ticketStatusCtx) {
        const ticketStatusChart = new Chart(ticketStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Baru', 'Dalam Proses', 'Menunggu Part', 'Selesai', 'Ditutup'],
                datasets: [{
                    data: [8, 6, 4, 14, 3],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(245, 158, 11)',
                        'rgb(249, 115, 22)',
                        'rgb(16, 185, 129)',
                        'rgb(107, 114, 128)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Distribusi Status Tiket'
                    }
                }
            }
        });
    }
    
    // Team Performance Chart
    const teamPerfCtx = document.getElementById('teamPerformanceChart');
    if (teamPerfCtx) {
        const teamPerfChart = new Chart(teamPerfCtx, {
            type: 'bar',
            data: {
                labels: ['Tim A', 'Tim B', 'Tim C', 'Tim D'],
                datasets: [{
                    label: 'SLA Terpenuhi (%)',
                    data: [96.5, 92.1, 88.7, 97.2],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                }, {
                    label: 'Target (%)',
                    data: [92, 92, 92, 92],
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    type: 'line',
                    fill: false
                }]
            },
            options: getChartOptions('Performa Tim', '%')
        });
    }
}

function getChartOptions(title, unit = '') {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title
            }
        },
        scales: unit.includes('%') ? {
            y: {
                beginAtZero: false,
                min: 80,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + unit;
                    }
                }
            }
        } : {}
    };
}

function updateRealTimeData() {
    // Simulate real-time updates
    setInterval(() => {
        // Update ticket counters
        const ticketsCreated = document.getElementById('ticketsCreated');
        const ticketsResolved = document.getElementById('ticketsResolved');
        
        if (ticketsCreated) {
            const current = parseInt(ticketsCreated.textContent);
            if (Math.random() > 0.7) { // 30% chance to update
                ticketsCreated.textContent = current + 1;
            }
        }
        
        if (ticketsResolved) {
            const current = parseInt(ticketsResolved.textContent);
            if (Math.random() > 0.8) { // 20% chance to update
                ticketsResolved.textContent = current + 1;
            }
        }
    }, 30000); // Update every 30 seconds
}

function setupDashboardFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const teamFilter = document.getElementById('teamFilter');
    
    if (periodFilter) {
        periodFilter.addEventListener('change', function(e) {
            console.log('Period filter changed to:', e.target.value);
            // In real app, this would reload data based on period
        });
    }
    
    if (teamFilter) {
        teamFilter.addEventListener('change', function(e) {
            console.log('Team filter changed to:', e.target.value);
            // In real app, this would reload data based on team
        });
    }
}

// Export for use in other modules
window.dashboardModule = {
    initDashboard,
    loadDashboardMetrics,
    getCurrentUser
};