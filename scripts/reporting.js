// Reporting Module
const reportingModule = {
    currentReport: null,
    reportChart: null,
    
    init: function() {
        this.setupEventListeners();
        this.setDefaultDates();
    },
    
    setupEventListeners: function() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput && endDateInput) {
            // Set default dates (last 30 days)
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            
            startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
            endDateInput.value = today.toISOString().split('T')[0];
        }
    },
    
    setDefaultDates: function() {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        
        if (startDateInput) startDateInput.value = thirtyDaysAgo.toISOString().split('T')[0];
        if (endDateInput) endDateInput.value = today.toISOString().split('T')[0];
    },
    
    generateReport: function() {
        const reportType = document.getElementById('reportType')?.value || 'sla-performance';
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        
        console.log(`Generating ${reportType} report from ${startDate} to ${endDate}`);
        
        switch(reportType) {
            case 'sla-performance':
                this.generateSLAPerformanceReport();
                break;
            case 'ticket-summary':
                this.generateTicketSummaryReport();
                break;
            case 'technician':
                this.generateTechnicianReport();
                break;
        }
    },
    
    generateSLAPerformanceReport: function() {
        if (document.getElementById('reportChart')) {
            const ctx = document.getElementById('reportChart').getContext('2d');
            
            if (this.reportChart) {
                this.reportChart.destroy();
            }
            
            this.reportChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [
                        {
                            label: 'SLA Target (%)',
                            data: [95, 95, 95, 95],
                            backgroundColor: '#3b82f6',
                            borderColor: '#1e40af',
                            borderWidth: 1
                        },
                        {
                            label: 'SLA Achieved (%)',
                            data: [92, 93.5, 92.8, 94.2],
                            backgroundColor: '#10b981',
                            borderColor: '#059669',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'SLA Performance Report'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    },
    
    generateTicketSummaryReport: function() {
        if (document.getElementById('reportChart')) {
            const ctx = document.getElementById('reportChart').getContext('2d');
            
            if (this.reportChart) {
                this.reportChart.destroy();
            }
            
            this.reportChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Selesai', 'Dalam Proses', 'Baru', 'Menunggu'],
                    datasets: [{
                        data: [89, 24, 15, 14],
                        backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Ticket Status Summary'
                        }
                    }
                }
            });
        }
    },
    
    generateTechnicianReport: function() {
        if (document.getElementById('reportChart')) {
            const ctx = document.getElementById('reportChart').getContext('2d');
            
            if (this.reportChart) {
                this.reportChart.destroy();
            }
            
            this.reportChart = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: ['Budi Santoso', 'Siti Rahayu', 'Ahmad Fauzi', 'Rina Dewi', 'Joko Prasetyo'],
                    datasets: [
                        {
                            label: 'Resolved',
                            data: [45, 38, 32, 28, 42],
                            backgroundColor: '#10b981'
                        },
                        {
                            label: 'In Progress',
                            data: [5, 3, 2, 4, 3],
                            backgroundColor: '#f59e0b'
                        },
                        {
                            label: 'SLA Compliance',
                            data: [96.5, 94.2, 92.1, 95.8, 93.5],
                            backgroundColor: '#3b82f6'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Technician Performance Report'
                        }
                    }
                }
            });
        }
    },
    
    exportReport: function() {
        alert('Export ke PDF function - akan diintegrasikan dengan library seperti jsPDF');
    }
};

// Global functions untuk HTML onclick handlers
function generateReport() {
    reportingModule.generateReport();
}

function exportReport() {
    reportingModule.exportReport();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reportType')) {
        reportingModule.init();
    }
});
