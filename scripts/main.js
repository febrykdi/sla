// Main JavaScript untuk SLA Dashboard

// Fungsi untuk inisialisasi dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Inisialisasi komponen dashboard
    // If a dashboard module is provided (more feature-rich), use it.
    if (window.dashboardModule && typeof window.dashboardModule.initDashboard === 'function') {
        window.dashboardModule.initDashboard();
    } else {
        initDashboard();
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Load data awal
    loadInitialData();
    
    // Inisialisasi modul-modul
    if (typeof dashboardData !== 'undefined') {
        try {
            if (document.querySelector('[id*="complianceChart"]') || document.querySelector('[id*="statusChart"]')) {
                slaMonitoring.init();
            }
        } catch (e) {
            console.log('SLA Monitoring not available on this page');
        }
    }
});

function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Jika tidak authenticated dan bukan halaman login
    if (!isAuthenticated && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

function initDashboard() {
    console.log('Dashboard SLA diinisialisasi');
    
    // Setup chart jika ada
    if (typeof initCharts === 'function') {
        initCharts();
    }
    
    // Update waktu real-time
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update setiap detik
}

function setupEventListeners() {
    // Toggle sidebar untuk mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('-translate-x-full');
            if (overlay) overlay.classList.toggle('hidden');
        });
    }
    
    // Tutup sidebar saat klik overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }
    
    // Tombol logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                logout();
            }
        });
    }
    
    // Tombol simpan profil (ubah password)
    const saveBtn = document.getElementById('saveProfileBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const newPasswordInput = document.getElementById('newPassword');
            const newPass = newPasswordInput ? newPasswordInput.value.trim() : '';

            if (!newPass || newPass.length < 6) {
                showAlert('error', 'Password minimal 6 karakter');
                return;
            }

            const user = getCurrentUser();
            if (user) {
                user.password = newPass;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showAlert('success', 'Password berhasil diperbarui');
                if (newPasswordInput) newPasswordInput.value = '';
                updateUserInfo();
            } else {
                showAlert('error', 'Pengguna tidak ditemukan');
            }
        });
    }

    // Update user profile info
    updateUserInfo();
}

function loadInitialData() {
    // Load data tiket ke tabel jika sedang di halaman tickets
    if (document.getElementById('ticketsTableBody') && typeof ticketsModule !== 'undefined') {
        ticketsModule.init();
    }
    
    // Load data master jika sedang di halaman master-data
    if (document.getElementById('servicesTable') && typeof masterDataModule !== 'undefined') {
        masterDataModule.init();
    }
    
    // Update user info dari localStorage
    updateUserInfo();
}

function updateUserInfo() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Update user info di halaman profile
        const fullNameInput = document.getElementById('fullName');
        const emailInput = document.getElementById('email');
        const roleInput = document.getElementById('role');
        const userNameDisplay = document.getElementById('userName');
        const userRoleDisplay = document.getElementById('userRole');
        const userEmailDisplay = document.getElementById('userEmail');
        const userDeptDisplay = document.getElementById('userDept');
        const loginTimeDisplay = document.getElementById('loginTime');
        
        if (fullNameInput) fullNameInput.value = currentUser.name || '--';
        if (emailInput) emailInput.value = currentUser.email || '--';
        if (roleInput) roleInput.value = currentUser.role || '--';
        
        if (userNameDisplay) userNameDisplay.textContent = currentUser.name || '--';
        if (userRoleDisplay) userRoleDisplay.textContent = currentUser.role || '--';
        if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email || '--';
        if (userDeptDisplay) userDeptDisplay.textContent = currentUser.department || currentUser.dept || '--';
        if (loginTimeDisplay) {
            const loginVal = currentUser.lastLogin || currentUser.loginTime;
            loginTimeDisplay.textContent = loginVal ? new Date(loginVal).toLocaleString('id-ID') : '--';
        }
    }
}

function updateDateTime() {
    const now = new Date();
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    
    const timeStr = now.toLocaleTimeString('id-ID', timeOptions);
    
    // Update elemen currentTime di semua halaman
    const currentTimeElements = document.querySelectorAll('#currentTime');
    currentTimeElements.forEach(el => {
        el.textContent = timeStr;
    });
}

// Utility functions untuk formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function formatTimeRemaining(minutes) {
    if (minutes < 0) {
        return `<span class="text-red-600">Terlambat ${Math.abs(minutes)} menit</span>`;
    } else if (minutes < 60) {
        return `<span class="text-orange-600">${minutes} menit</span>`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `<span class="text-green-600">${hours} jam ${remainingMinutes} menit</span>`;
    }
}

function getPriorityClass(priority) {
    const priorities = {
        'high': 'text-red-600 bg-red-100',
        'medium': 'text-yellow-600 bg-yellow-100',
        'low': 'text-green-600 bg-green-100',
        'critical': 'text-darkred-600 bg-red-200'
    };
    return priorities[priority.toLowerCase()] || 'text-gray-600 bg-gray-100';
}

function getStatusClass(status) {
    const statuses = {
        'new': 'text-blue-600 bg-blue-100',
        'in_progress': 'text-orange-600 bg-orange-100',
        'pending': 'text-yellow-600 bg-yellow-100',
        'resolved': 'text-green-600 bg-green-100',
        'closed': 'text-gray-600 bg-gray-100'
    };
    return statuses[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Show alert/notification
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fixed top-4 right-4 shadow-lg max-w-md z-50`;
    alertDiv.innerHTML = `
        ${message}
        <span class="alert-close" onclick="this.parentElement.remove();">&times;</span>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Export untuk modul lain
window.dashboardUtils = {
    formatDate,
    formatTimeRemaining,
    getPriorityClass,
    getStatusClass,
    showAlert
};