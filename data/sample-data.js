// Data contoh untuk SLA Dashboard

const sampleTickets = [
    {
        id: "TKT-2023-045",
        title: "Perbaikan jaringan area marketing",
        priority: "Tinggi",
        technician: "Budi Santoso",
        timeRemaining: 120, // dalam menit
        status: "Dalam Proses",
        created: "2023-10-15T09:30:00",
        slaDeadline: "2023-10-16T12:00:00"
    },
    {
        id: "TKT-2023-044",
        title: "Installasi software baru",
        priority: "Sedang",
        technician: "Siti Rahayu",
        timeRemaining: 360,
        status: "Baru",
        created: "2023-10-15T14:20:00",
        slaDeadline: "2023-10-17T14:20:00"
    },
    {
        id: "TKT-2023-043",
        title: "Ganti printer rusak",
        priority: "Rendah",
        technician: "Ahmad Fauzi",
        timeRemaining: -45, // negatif berarti terlambat
        status: "Menunggu Part",
        created: "2023-10-14T11:15:00",
        slaDeadline: "2023-10-15T16:00:00"
    },
    {
        id: "TKT-2023-042",
        title: "Troubleshooting server",
        priority: "Tinggi",
        technician: "Rina Dewi",
        timeRemaining: 180,
        status: "Dalam Proses",
        created: "2023-10-14T15:45:00",
        slaDeadline: "2023-10-15T18:45:00"
    },
    {
        id: "TKT-2023-041",
        title: "Backup database",
        priority: "Sedang",
        technician: "Joko Prasetyo",
        timeRemaining: 0,
        status: "Selesai",
        created: "2023-10-13T10:00:00",
        slaDeadline: "2023-10-14T10:00:00"
    }
];

const slaMetrics = {
    currentSLA: 94.2,
    averageResponseTime: 2.4,
    ticketsOpened: 18,
    ticketsResolved: 142,
    ticketsOverdue: 3
};

const technicians = [
    { name: "Budi Santoso", activeTickets: 4, slaCompliance: 96.5 },
    { name: "Siti Rahayu", activeTickets: 3, slaCompliance: 92.1 },
    { name: "Ahmad Fauzi", activeTickets: 2, slaCompliance: 88.7 },
    { name: "Rina Dewi", activeTickets: 5, slaCompliance: 97.2 },
    { name: "Joko Prasetyo", activeTickets: 1, slaCompliance: 95.8 }
];

// Fungsi untuk memuat data tiket ke tabel
function loadTicketData() {
    const tableBody = document.getElementById('ticketTableBody');
    if (!tableBody) return;
    
    // Kosongkan tabel
    tableBody.innerHTML = '';
    
    // Tambahkan data tiket
    sampleTickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // Tentukan warna berdasarkan prioritas
        let priorityColor = 'bg-gray-100 text-gray-800';
        if (ticket.priority === 'Tinggi') priorityColor = 'bg-red-100 text-red-800';
        if (ticket.priority === 'Sedang') priorityColor = 'bg-yellow-100 text-yellow-800';
        
        // Tentukan warna berdasarkan status
        let statusColor = 'bg-gray-100 text-gray-800';
        if (ticket.status === 'Baru') statusColor = 'bg-blue-100 text-blue-800';
        if (ticket.status === 'Dalam Proses') statusColor = 'bg-yellow-100 text-yellow-800';
        if (ticket.status === 'Selesai') statusColor = 'bg-green-100 text-green-800';
        if (ticket.status === 'Menunggu Part') statusColor = 'bg-orange-100 text-orange-800';
        
        // Format waktu tersisa
        let timeRemainingText = '';
        let timeColor = 'text-gray-600';
        
        if (ticket.timeRemaining < 0) {
            timeRemainingText = `Terlambat ${Math.abs(ticket.timeRemaining)} menit`;
            timeColor = 'text-red-600 font-bold';
        } else if (ticket.timeRemaining < 