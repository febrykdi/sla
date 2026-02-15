// Master Data Module
const masterDataModule = {
    activeTab: 'services',
    
    init: function() {
        this.setupEventListeners();
        this.loadServices();
        this.loadTechnicians();
        this.loadPolicies();
    },
    
    setupEventListeners: function() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.tab-btn').textContent.trim().split('\n')[1] || 'services');
            });
        });
    },
    
    switchTab: function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });
        
        // Show selected tab
        const tabElement = document.getElementById(`${tabName}-tab`);
        if (tabElement) {
            tabElement.classList.remove('hidden');
        }
        
        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('border-blue-600', 'text-blue-600');
            btn.classList.add('border-transparent', 'text-gray-600');
        });
        
        // Set active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName.replace('-', ' '))) {
                btn.classList.add('border-blue-600', 'text-blue-600');
                btn.classList.remove('border-transparent', 'text-gray-600');
            }
        });
        
        this.activeTab = tabName;
    },
    
    loadServices: function() {
        const services = [
            { id: 1, name: "Network", slaHours: 24, priority: "high" },
            { id: 2, name: "Hardware", slaHours: 48, priority: "medium" },
            { id: 3, name: "Software", slaHours: 72, priority: "medium" },
            { id: 4, name: "Email", slaHours: 12, priority: "high" },
            { id: 5, name: "Server", slaHours: 4, priority: "critical" }
        ];
        
        const tbody = document.getElementById('servicesTable');
        if (tbody) {
            tbody.innerHTML = services.map(service => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">${service.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${service.slaHours} jam</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold 
                            ${service.priority === 'critical' ? 'bg-red-100 text-red-800' : 
                              service.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                              'bg-blue-100 text-blue-800'}">
                            ${service.priority}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                        <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    },
    
    loadTechnicians: function() {
        const technicians = [
            {
                id: 1,
                name: "Budi Santoso",
                email: "budi@sla.com",
                specialization: "Network",
                status: "active"
            },
            {
                id: 2,
                name: "Siti Rahayu",
                email: "siti@sla.com",
                specialization: "Software",
                status: "active"
            },
            {
                id: 3,
                name: "Ahmad Fauzi",
                email: "ahmad@sla.com",
                specialization: "Hardware",
                status: "active"
            },
            {
                id: 4,
                name: "Rina Dewi",
                email: "rina@sla.com",
                specialization: "Database",
                status: "inactive"
            },
            {
                id: 5,
                name: "Joko Prasetyo",
                email: "joko@sla.com",
                specialization: "Infrastructure",
                status: "active"
            }
        ];
        
        const tbody = document.getElementById('techniciansTable');
        if (tbody) {
            tbody.innerHTML = technicians.map(tech => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${tech.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${tech.email}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${tech.specialization}</td>
                    <td class="px-6 py-4 text-sm">
                        <span class="px-2 py-1 rounded-full text-xs font-semibold 
                            ${tech.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                            ${tech.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm">
                        <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                        <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    },
    
    loadPolicies: function() {
        const policies = [
            {
                id: 1,
                name: "Standard Response",
                description: "Waktu respons maksimal untuk semua tiket",
                target: "2 jam"
            },
            {
                id: 2,
                name: "Priority Response",
                description: "Waktu respons untuk tiket prioritas tinggi",
                target: "30 menit"
            },
            {
                id: 3,
                name: "Resolution Time",
                description: "Target waktu penyelesaian tiket",
                target: "24 jam"
            },
            {
                id: 4,
                name: "Critical Priority",
                description: "Waktu respons untuk tiket kritis",
                target: "15 menit"
            }
        ];
        
        const tbody = document.getElementById('policiesTable');
        if (tbody) {
            tbody.innerHTML = policies.map(policy => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">${policy.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${policy.description}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">${policy.target}</td>
                    <td class="px-6 py-4 text-sm">
                        <button class="text-blue-600 hover:text-blue-800 mr-2"><i class="fas fa-edit"></i></button>
                        <button class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    }
};

// Global function untuk tab switching
function switchTab(tabName) {
    masterDataModule.switchTab(tabName);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('servicesTable')) {
        masterDataModule.init();
    }
});