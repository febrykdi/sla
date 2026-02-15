// SLA Monitoring Module
const slaMonitoring = {
    complianceData: [],
    statusData: [],
    
    init: function() {
        this.loadData();
        this.renderCharts();
        this.updateMetrics();
        setInterval(() => this.updateMetrics(), 60000); // Update setiap menit
    },
    
    loadData: function() {
        // Load data dari sample-data.js
        if (typeof sampleTickets !== 'undefined') {
            const tickets = sampleTickets;
            
            // Hitung compliance rate
            const compliant = tickets.filter(t => t.timeRemaining >= 0).length;
            const rate = (compliant / tickets.length) * 100;
            document.getElementById('complianceRate').innerText = rate.toFixed(1) + '%';
            
            // Hitung at-risk tickets
            const atRisk = tickets.filter(t => t.timeRemaining < 120 && t.timeRemaining >= 0).length;
            document.getElementById('atRiskCount').innerText = atRisk;
            
            // Hitung breaches
            const breaches = tickets.filter(t => t.timeRemaining < 0).length;
            document.getElementById('breachCount').innerText = breaches;
            
            // Hitung rata-rata response time
            const avgTime = tickets.reduce((sum, t) => sum + Math.abs(t.timeRemaining), 0) / tickets.length;
            document.getElementById('avgResponse').innerText = utils.formatTime(Math.round(avgTime));
        }
    },
    
    renderCharts: function() {
        // Compliance Trend Chart
        if (document.getElementById('complianceChart')) {
            const complianceCtx = document.getElementById('complianceChart').getContext('2d');
            new Chart(complianceCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'This Week'],
                    datasets: [{
                        label: 'Compliance Rate (%)',
                        data: [92, 93.5, 92.8, 94.2, 94.2],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            min: 90,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Status Distribution Chart
        if (document.getElementById('statusChart')) {
            const statusCtx = document.getElementById('statusChart').getContext('2d');
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Dalam Proses', 'Selesai', 'Baru', 'Menunggu'],
                    datasets: [{
                        data: [24, 89, 15, 14],
                        backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    },
    
    updateMetrics: function() {
        // Update real-time metrics
        this.loadData();
    }
};

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('complianceChart')) {
        slaMonitoring.init();
    }
});