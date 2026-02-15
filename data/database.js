// Simulated Database for SLA Dashboard
const slaDatabase = {
    users: [], // dari auth.js
    tickets: [], // dari tickets.js
    technicians: [
        {
            id: 1,
            name: "Budi Santoso",
            email: "budi@sla.com",
            department: "Technical Support",
            specialization: "Network",
            skills: ["Cisco", "Routing", "Firewall"],
            status: "active",
            slaCompliance: 96.5,
            avgResponseTime: "1.8 jam",
            ticketsAssigned: 12,
            ticketsResolved: 142
        },
        // ... more technicians
    ],
    
    marketingTeam: [
        {
            id: 1,
            name: "Rina Dewi",
            email: "rina@sla.com",
            department: "Marketing",
            region: "Jakarta",
            ticketsCreated: 45,
            satisfactionScore: 4.5
        },
        // ... more marketing
    ],
    
    serviceCategories: [
        { id: 1, name: "Network", slaHours: 24, priority: "high" },
        { id: 2, name: "Hardware", slaHours: 48, priority: "medium" },
        { id: 3, name: "Software", slaHours: 72, priority: "medium" },
        { id: 4, name: "Email", slaHours: 12, priority: "high" },
        { id: 5, name: "Server", slaHours: 4, priority: "critical" }
    ],
    
    slaPolicies: [
        {
            id: 1,
            name: "Standard Response",
            description: "Waktu respons maksimal untuk semua tiket",
            target: "2 jam",
            measurement: "response_time",
            priority: "all"
        },
        {
            id: 2,
            name: "Critical Resolution",
            description: "Waktu penyelesaian untuk tiket kritis",
            target: "4 jam",
            measurement: "resolution_time",
            priority: "critical"
        }
        // ... more policies
    ],
    
    // CRUD operations
    create: function(table, data) {
        const newId = this[table].length > 0 ? Math.max(...this[table].map(item => item.id)) + 1 : 1;
        const newItem = { id: newId, ...data, createdAt: new Date().toISOString() };
        this[table].push(newItem);
        this.saveToLocalStorage();
        return newItem;
    },
    
    read: function(table, id = null) {
        if (id) {
            return this[table].find(item => item.id === id);
        }
        return this[table];
    },
    
    update: function(table, id, data) {
        const index = this[table].findIndex(item => item.id === id);
        if (index !== -1) {
            this[table][index] = { ...this[table][index], ...data, updatedAt: new Date().toISOString() };
            this.saveToLocalStorage();
            return this[table][index];
        }
        return null;
    },
    
    delete: function(table, id) {
        const index = this[table].findIndex(item => item.id === id);
        if (index !== -1) {
            const deleted = this[table].splice(index, 1);
            this.saveToLocalStorage();
            return deleted[0];
        }
        return null;
    },
    
    saveToLocalStorage: function() {
        // Save each table to localStorage
        Object.keys(this).forEach(key => {
            if (Array.isArray(this[key])) {
                localStorage.setItem(`sla_${key}`, JSON.stringify(this[key]));
            }
        });
    },
    
    loadFromLocalStorage: function() {
        // Load each table from localStorage
        Object.keys(this).forEach(key => {
            if (Array.isArray(this[key])) {
                const saved = localStorage.getItem(`sla_${key}`);
                if (saved) {
                    this[key] = JSON.parse(saved);
                }
            }
        });
    },
    
    // Query methods
    getTechnicianPerformance: function(technicianId) {
        const technician = this.read('technicians', technicianId);
        const tickets = this.read('tickets').filter(t => t.technicianId === technicianId);
        
        return {
            technician,
            totalTickets: tickets.length,
            resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
            avgResolutionTime: this.calculateAverageResolutionTime(tickets),
            slaCompliance: this.calculateSLACompliance(tickets)
        };
    },
    
    calculateAverageResolutionTime: function(tickets) {
        const resolvedTickets = tickets.filter(t => t.status === 'resolved');
        if (resolvedTickets.length === 0) return 0;
        
        const totalTime = resolvedTickets.reduce((sum, ticket) => {
            const created = new Date(ticket.created);
            const resolved = new Date(ticket.resolvedAt);
            return sum + (resolved - created);
        }, 0);
        
        return totalTime / resolvedTickets.length / (1000 * 60 * 60); // Convert to hours
    },
    
    calculateSLACompliance: function(tickets) {
        const slaTickets = tickets.filter(t => t.slaDeadline);
        if (slaTickets.length === 0) return 100;
        
        const compliant = slaTickets.filter(t => {
            const resolved = t.resolvedAt ? new Date(t.resolvedAt) : new Date();
            const deadline = new Date(t.slaDeadline);
            return resolved <= deadline;
        }).length;
        
        return (compliant / slaTickets.length) * 100;
    }
};

// Initialize database
slaDatabase.loadFromLocalStorage();

// Make available globally
window.slaDB = slaDatabase;