// Enhanced Authentication System
const authConfig = {
    roles: {
        admin: {
            permissions: ['all'],
            dashboard: 'dashboard.html',
            name: 'Administrator'
        },
        teknisi: {
            permissions: ['view_tickets', 'update_tickets', 'view_sla'],
            dashboard: 'dashboard.html',
            name: 'Teknisi'
        },
        marketing: {
            permissions: ['create_tickets', 'view_tickets', 'view_reports'],
            dashboard: 'dashboard.html',
            name: 'Marketing'
        }
    },
    
    // Demo users database
    users: [
        { 
            id: 1, 
            username: 'admin', 
            password: 'admin123', 
            role: 'admin',
            name: 'Admin Utama',
            email: 'admin@sla.com',
            department: 'IT',
            lastLogin: null
        },
        { 
            id: 2, 
            username: 'teknisi1', 
            password: 'teknisi123', 
            role: 'teknisi',
            name: 'Budi Santoso',
            email: 'budi@sla.com',
            department: 'Technical Support',
            specialization: 'Network',
            lastLogin: null
        },
        { 
            id: 3, 
            username: 'teknisi2', 
            password: 'teknisi123', 
            role: 'teknisi',
            name: 'Siti Rahayu',
            email: 'siti@sla.com',
            department: 'Technical Support',
            specialization: 'Software',
            lastLogin: null
        },
        { 
            id: 4, 
            username: 'marketing1', 
            password: 'marketing123', 
            role: 'marketing',
            name: 'Rina Dewi',
            email: 'rina@sla.com',
            department: 'Marketing',
            region: 'Jakarta',
            lastLogin: null
        },
        { 
            id: 5, 
            username: 'marketing2', 
            password: 'marketing123', 
            role: 'marketing',
            name: 'Ahmad Fauzi',
            email: 'ahmad@sla.com',
            department: 'Marketing',
            region: 'Bandung',
            lastLogin: null
        }
    ]
};

// Enhanced authenticate function
function authenticateUser(username, password) {
    const user = authConfig.users.find(u => 
        u.username === username && u.password === password
    );
    
    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isAuthenticated', 'true');
        
        return {
            success: true,
            user: user,
            redirectUrl: authConfig.roles[user.role].dashboard
        };
    }
    
    return {
        success: false,
        message: 'Username atau password salah'
    };
}

// Check permissions
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const role = authConfig.roles[user.role];
    return role.permissions.includes('all') || role.permissions.includes(permission);
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Role-based redirection
function redirectBasedOnRole() {
    const user = getCurrentUser();
    if (user && authConfig.roles[user.role]) {
        window.location.href = authConfig.roles[user.role].dashboard;
    }
}

// Enhanced login form handler
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        // Load saved username if exists
        const savedUsername = localStorage.getItem('lastUsername');
        if (savedUsername) {
            document.getElementById('username').value = savedUsername;
        }
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
            
            // Validate
            if (!username || !password) {
                showAlert('error', 'Username dan password harus diisi');
                return;
            }
            
            // Authenticate
            const result = authenticateUser(username, password);
            
            if (result.success) {
                // Save username if remember me is checked
                if (remember) {
                    localStorage.setItem('lastUsername', username);
                } else {
                    localStorage.removeItem('lastUsername');
                }
                
                // Show success message
                showAlert('success', `Login berhasil! Selamat datang ${result.user.name}`);
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 1500);
            } else {
                showAlert('error', result.message);
            }
        });
    }
}

// Check authentication on page load
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
        return false;
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && currentPage.includes('index.html')) {
        redirectBasedOnRole();
        return true;
    }
    
    return true;
}

// Logout function
function logout() {
    const user = getCurrentUser();
    
    // Log logout time
    if (user) {
        console.log(`User ${user.name} logged out at ${new Date().toLocaleString()}`);
    }
    
    // Clear storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('activeTickets');
    
    // Redirect to login
    window.location.href = 'index.html';
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    
    // Check auth for protected pages
    const protectedPages = ['dashboard', 'tickets', 'sla-monitoring', 'reporting', 'master-data', 'profile'];
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }
});