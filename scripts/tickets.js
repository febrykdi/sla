// Tickets Management Module
const ticketsModule = {
    tickets: [],
    currentFilter: {},
    
    init: function() {
        this.loadTickets();
        this.setupEventListeners();
        this.renderTicketsTable();
    },
    
    loadTickets: function() {
        // Sample tickets data
        this.tickets = [
            {
                id: 'TKT-2023-087',
                subject: 'Jaringan down di lantai 3',
                reporter: 'Rina Dewi (Marketing)',
                department: 'Marketing',
                priority: 'high',
                technician: 'Budi Santoso',
                status: 'in_progress',
                created: '2023-10-15T09:30:00',
                slaDeadline: '2023-10-16T12:00:00',
                category: 'Network',
                description: 'Seluruh jaringan di lantai 3 marketing tidak dapat terkoneksi ke internet sejak pagi ini.',
                attachments: 2,
                comments: 5,
                timeRemaining: 120 // in minutes
            },
            {
                id: 'TKT-2023-086',
                subject: 'Install software accounting baru',
                reporter: 'Ahmad Fauzi (Marketing)',
                department: 'Marketing',
                priority: 'medium',
                technician: 'Siti Rahayu',
                status: 'resolved',
                created: '2023-10-14T14:20:00',
                slaDeadline: '2023-10-17T14:20:00',
                category: 'Software',
                description: 'Perlu install software accounting versi terbaru untuk 5 komputer di departemen marketing.',
                attachments: 1,
                comments: 3,
                timeRemaining: 0
            },
            {
                id: 'TKT-2023-085',
                subject: 'Printer tidak berfungsi',
                reporter: 'Joko Prasetyo (HR)',
                department: 'HR',
                priority: 'low',
                technician: 'Ahmad Fauzi',
                status: 'pending',
                created: '2023-10-14T11:15:00',
                slaDeadline: '2023-10-15T16:00:00',
                category: 'Hardware',
                description: 'Printer di ruang HR tidak bisa mencetak, menunjukkan error paper jam.',
                attachments: 0,
                comments: 2,
                timeRemaining: -45 // overdue
            },
            {
                id: 'TKT-2023-084',
                subject: 'Server lambat respons',
                reporter: 'IT Department',
                department: 'IT',
                priority: 'high',
                technician: 'Tim Server',
                status: 'in_progress',
                created: '2023-10-13T15:45:00',
                slaDeadline: '2023-10-16T09:00:00',
                category: 'Server',
                description: 'Server utama mengalami penurunan performa yang signifikan selama peak hours.',
                attachments: 3,
                comments: 8,
                timeRemaining: 320
            },
            {
                id: 'TKT-2023-083',
                subject: 'Email tidak terkirim',
                reporter: 'Sari Utami (Sales)',
                department: 'Sales',
                priority: 'medium',
                technician: 'Budi Santoso',
                status: 'new',
                created: '2023-10-13T10:00:00',
                slaDeadline: '2023-10-16T10:00:00',
                category: 'Email',
                description: 'Email dengan attachment besar tidak dapat dikirim ke client luar negeri.',
                attachments: 1,
                comments: 1,
                timeRemaining: 420
            }
        ];
    },
    
    setupEventListeners: function() {
        // Filter toggle
        const filterBtn = document.getElementById('filterBtn');
        const filterBar = document.getElementById('filterBar');
        
        if (filterBtn && filterBar) {
            filterBtn.addEventListener('click', () => {
                filterBar.classList.toggle('hidden');
            });
        }
        
        // Create ticket button
        const createTicketBtn = document.getElementById('createTicketBtn');
        if (createTicketBtn) {
            createTicketBtn.addEventListener('click', () => {
                this.showCreateTicketModal();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportTickets();
            });
        }
    },
    
    renderTicketsTable: function() {
        const tableBody = document.getElementById('ticketsTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.tickets.forEach(ticket => {
            const row = document.createElement('tr');
            
            // Priority styling
            const priorityClass = {
                high: 'bg-red-100 text-red-800',
                medium: 'bg-yellow-100 text-yellow-800',
                low: 'bg-green-100 text-green-800'
            }[ticket.priority] || 'bg-gray-100 text-gray-800';
            
            // Status styling
            const statusClass = {
                new: 'bg-blue-100 text-blue-800',
                in_progress: 'bg-yellow-100 text-yellow-800',
                pending: 'bg-orange-100 text-orange-800',
                resolved: 'bg-green-100 text-green-800',
                closed: 'bg-gray-100 text-gray-800'
            }[ticket.status] || 'bg-gray-100 text-gray-800';
            
            // Status text
            const statusText = {
                new: 'Baru',
                in_progress: 'Dalam Proses',
                pending: 'Menunggu',
                resolved: 'Selesai',
                closed: 'Ditutup'
            }[ticket.status] || ticket.status;
            
            // Time remaining styling
            let timeRemainingHtml = '';
            if (ticket.timeRemaining < 0) {
                timeRemainingHtml = `<span class="text-red-600 font-medium">Terlambat ${Math.abs(ticket.timeRemaining)}m</span>`;
            } else if (ticket.timeRemaining < 60) {
                timeRemainingHtml = `<span class="text-orange-600 font-medium">${ticket.timeRemaining}m</span>`;
            } else {
                const hours = Math.floor(ticket.timeRemaining / 60);
                const minutes = ticket.timeRemaining % 60;
                timeRemainingHtml = `<span class="text-green-600 font-medium">${hours}j ${minutes}m</span>`;
            }
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="rounded border-gray-300">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium text-gray-900">${ticket.id}</div>
                    <div class="text-sm text-gray-500">${this.formatDate(ticket.created)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium text-gray-900">${ticket.subject}</div>
                    <div class="text-sm text-gray-500">${ticket.category}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium">${ticket.reporter.split(' (')[0]}</div>
                    <div class="text-sm text-gray-500">${ticket.department}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${priorityClass}">
                        ${ticket.priority === 'high' ? 'Tinggi' : ticket.priority === 'medium' ? 'Sedang' : 'Rendah'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="font-medium">${ticket.technician}</div>
                    <div class="text-sm text-gray-500">${ticket.status === 'new' ? 'Belum ditugaskan' : 'Ditugaskan'}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${timeRemainingHtml}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="ticketsModule.viewTicket('${ticket.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="ticketsModule.editTicket('${ticket.id}')" class="text-green-600 hover:text-green-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="ticketsModule.assignTicket('${ticket.id}')" class="text-purple-600 hover:text-purple-900">
                        <i class="fas fa-user-plus"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    },
    
    showCreateTicketModal: function() {
        const modal = document.getElementById('createTicketModal');
        if (!modal) return;
        
        const user = getCurrentUser();
        
        modal.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Buat Tiket Baru</h2>
                    <button onclick="this.closest('#createTicketModal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form id="ticketForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Subjek *</label>
                            <input type="text" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                            <select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Pilih Kategori</option>
                                <option value="network">Jaringan</option>
                                <option value="hardware">Hardware</option>
                                <option value="software">Software</option>
                                <option value="email">Email</option>
                                <option value="server">Server</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Prioritas *</label>
                            <select required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Pilih Prioritas</option>
                                <option value="low">Rendah (SLA: 7 hari)</option>
                                <option value="medium">Sedang (SLA: 3 hari)</option>
                                <option value="high">Tinggi (SLA: 1 hari)</option>
                                <option value="critical">Kritis (SLA: 4 jam)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Pelapor</label>
                            <input type="text" value="${user ? user.name : ''}" readonly class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
                            <textarea required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Jelaskan masalah atau permintaan secara detail..."></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Lampiran</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <i class="fas fa-cloud-upload-alt text-gray-400 text-2xl mb-2"></i>
                                <p class="text-sm text-gray-600">Drag & drop file atau <span class="text-blue-600 cursor-pointer">browse</span></p>
                                <p class="text-xs text-gray-500 mt-1">Max. 10MB per file</p>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tugaskan ke</label>
                            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Pilih Teknisi</option>
                                <option value="1">Budi Santoso (Network)</option>
                                <option value="2">Siti Rahayu (Software)</option>
                                <option value="3">Ahmad Fauzi (Hardware)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="mt-8 flex justify-end space-x-3">
                        <button type="button" onclick="this.closest('#createTicketModal').classList.add('hidden')" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-plus mr-2"></i> Buat Tiket
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Handle form submission
        const form = document.getElementById('ticketForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createNewTicket(form);
            });
        }
    },
    
    createNewTicket: function(form) {
        const formData = new FormData(form);
        const ticketData = {
            id: 'TKT-' + new Date().getFullYear() + '-' + (this.tickets.length + 1001),
            subject: formData.get('subject') || '',
            category: formData.get('category') || '',
            priority: formData.get('priority') || 'medium',
            description: formData.get('description') || '',
            created: new Date().toISOString(),
            status: 'new',
            timeRemaining: 1440, // 24 hours in minutes
            reporter: getCurrentUser()?.name || 'Unknown'
        };
        
        // Add to tickets array
        this.tickets.unshift(ticketData);
        
        // Update table
        this.renderTicketsTable();
        
        // Close modal
        document.getElementById('createTicketModal').classList.add('hidden');
        
        // Show success message
        showAlert('success', `Tiket ${ticketData.id} berhasil dibuat!`);
        
        // Log activity
        this.logActivity(`Tiket ${ticketData.id} dibuat`, 'create');
    },
    
    viewTicket: function(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        // In real app, this would open a detailed view
        const details = `
ID: ${ticket.id}
Subjek: ${ticket.subject}
Pelapor: ${ticket.reporter}
Kategori: ${ticket.category}
Prioritas: ${ticket.priority}
Status: ${ticket.status}
Dibuat: ${this.formatDate(ticket.created)}
Deskripsi: ${ticket.description}
        `;
        
        alert(details);
    },
    
    editTicket: function(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        const newStatus = prompt(
            `Edit status untuk tiket ${ticketId}:\n\nStatus saat ini: ${ticket.status}\n\nPilih status baru:\n1. Baru\n2. Dalam Proses\n3. Menunggu\n4. Selesai\n5. Ditutup\n\nMasukkan angka pilihan:`,
            ['new', 'in_progress', 'pending', 'resolved', 'closed'].indexOf(ticket.status) + 1
        );
        
        if (newStatus) {
            const statusMap = ['new', 'in_progress', 'pending', 'resolved', 'closed'];
            const newStatusValue = statusMap[parseInt(newStatus) - 1];
            
            if (newStatusValue) {
                ticket.status = newStatusValue;
                this.renderTicketsTable();
                showAlert('success', `Status tiket ${ticketId} berhasil diubah`);
                this.logActivity(`Status tiket ${ticketId} diubah ke ${newStatusValue}`, 'update');
            }
        }
    },
    
    assignTicket: function(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        
        const technicians = ['Budi Santoso', 'Siti Rahayu', 'Ahmad Fauzi', 'Rina Dewi', 'Joko Prasetyo'];
        const currentIndex = technicians.indexOf(ticket.technician);
        
        let assignment = prompt(
            `Tugaskan tiket ${ticketId} ke teknisi:\n\nTeknisi saat ini: ${ticket.technician || 'Belum ditugaskan'}\n\nPilih teknisi:\n${technicians.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nMasukkan angka pilihan:`,
            currentIndex >= 0 ? currentIndex + 1 : 1
        );
        
        if (assignment) {
            const techIndex = parseInt(assignment) - 1;
            if (techIndex >= 0 && techIndex < technicians.length) {
                ticket.technician = technicians[techIndex];
                if (ticket.status === 'new') {
                    ticket.status = 'in_progress';
                }
                this.renderTicketsTable();
                showAlert('success', `Tiket ${ticketId} berhasil ditugaskan ke ${ticket.technician}`);
                this.logActivity(`Tiket ${ticketId} ditugaskan ke ${ticket.technician}`, 'assignment');
            }
        }
    },
    
    exportTickets: function() {
        // In real app, this would generate CSV/Excel file
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        showAlert('success', 'Data tiket berhasil dieksport');
        this.logActivity('Data tiket dieksport', 'export');
    },
    
    generateCSV: function() {
        const headers = ['ID Tiket', 'Subjek', 'Pelapor', 'Prioritas', 'Status', 'Teknisi', 'Dibuat', 'Sisa Waktu'];
        const rows = this.tickets.map(ticket => [
            ticket.id,
            ticket.subject,
            ticket.reporter,
            ticket.priority,
            ticket.status,
            ticket.technician || 'Belum ditugaskan',
            this.formatDate(ticket.created),
            ticket.timeRemaining + ' menit'
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    },
    
    logActivity: function(action, type) {
        const activities = JSON.parse(localStorage.getItem('ticketActivities') || '[]');
        const user = getCurrentUser();
        
        activities.unshift({
            action,
            type,
            user: user?.name || 'System',
            timestamp: new Date().toISOString(),
            role: user?.role || 'system'
        });
        
        // Keep only last 100 activities
        if (activities.length > 100) {
            activities.pop();
        }
        
        localStorage.setItem('ticketActivities', JSON.stringify(activities));
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('ticketsTableBody')) {
        ticketsModule.init();
    }
});