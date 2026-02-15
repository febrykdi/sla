// Utility functions for SLA Dashboard
const utils = {
    // Formatting
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    },
    
    formatDate: function(date, includeTime = true) {
        const d = new Date(date);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return d.toLocaleDateString('id-ID', options);
    },
    
    formatTime: function(minutes) {
        if (minutes < 60) {
            return `${minutes} menit`;
        } else if (minutes < 1440) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours} jam ${mins} menit`;
        } else {
            const days = Math.floor(minutes / 1440);
            const hours = Math.floor((minutes % 1440) / 60);
            return `${days} hari ${hours} jam`;
        }
    },
    
    // Validation
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: function(phone) {
        const re = /^[0-9]{10,13}$/;
        return re.test(phone);
    },
    
    // Storage
    getFromStorage: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue;
        }
    },
    
    saveToStorage: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },
    
    // UI Helpers
    showLoading: function(elementId = null) {
        const loader = document.createElement('div');
        loader.className = 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50';
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-gray-600">Memuat...</p>
            </div>
        `;
        document.body.appendChild(loader);
    },
    
    hideLoading: function() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.remove();
        }
    },
    
    // API Simulation (for demo)
    simulateAPI: function(action, data, delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`API ${action}:`, data);
                resolve({
                    success: true,
                    data: data,
                    message: `${action} berhasil`,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    },
    
    // Generate unique ID
    generateId: function(prefix = '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 9);
        return `${prefix}${timestamp}${random}`.toUpperCase();
    },
    
    // Download file
    downloadFile: function(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
};

// Alert system
window.showAlert = function(type, message, duration = 5000) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} transform transition-all duration-300 translate-x-full`;
    alert.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                }"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <button class="ml-auto pl-3" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    alertContainer.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
        alert.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.add('translate-x-full');
            setTimeout(() => {
                if (alert.parentElement) {
                    alert.remove();
                }
            }, 300);
        }
    }, duration);
};

function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-sm';
    document.body.appendChild(container);
    return container;
}

// Make utils globally available
window.utils = utils;