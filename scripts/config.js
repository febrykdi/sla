// System Configuration for SLA Dashboard
const CONFIG = {
    // Application Settings
    APP_NAME: "SLA Dashboard",
    APP_VERSION: "1.0.0",
    APP_ENVIRONMENT: "production", // development, staging, production
    
    // API Configuration (untuk future backend integration)
    API: {
        BASE_URL: "http://localhost:3000/api",
        VERSION: "v1",
        TIMEOUT: 30000,
        ENDPOINTS: {
            LOGIN: "/auth/login",
            LOGOUT: "/auth/logout",
            TICKETS: "/tickets",
            TECHNICIANS: "/technicians",
            SLA: "/sla",
            REPORTS: "/reports",
            USERS: "/users"
        }
    },
    
    // Database Configuration
    DATABASE: {
        TYPE: "localStorage", // localStorage, sessionStorage, indexedDB, backend
        STORAGE_KEYS: {
            USER: "slaUser",
            TICKETS: "slaTickets",
            CACHE: "slaCache"
        }
    },
    
    // User Roles & Permissions
    ROLES: {
        ADMIN: {
            id: "admin",
            name: "Administrator",
            permissions: ["all"]
        },
        TECHNICIAN: {
            id: "teknisi",
            name: "Teknisi",
            permissions: ["view_tickets", "edit_tickets", "view_sla"]
        },
        MARKETING: {
            id: "marketing",
            name: "Marketing",
            permissions: ["create_tickets", "view_tickets", "view_sla"]
        }
    },
    
    // SLA Configuration
    SLA: {
        TARGET_PERCENTAGE: 95,
        RESPONSE_TIME_HOURS: {
            critical: 1,
            high: 4,
            medium: 8,
            low: 24
        },
        RESOLUTION_TIME_HOURS: {
            critical: 4,
            high: 24,
            medium: 48,
            low: 72
        }
    },
    
    // Ticket Configuration
    TICKETS: {
        PRIORITIES: ["critical", "high", "medium", "low"],
        STATUSES: ["new", "in_progress", "pending", "resolved", "closed"],
        CATEGORIES: ["Network", "Hardware", "Software", "Email", "Server"],
        PAGE_SIZE: 10
    },
    
    // Localization
    LOCALE: "id-ID",
    TIMEZONE: "Asia/Jakarta",
    DATE_FORMAT: "dd/MM/yyyy",
    TIME_FORMAT: "HH:mm:ss",
    
    // Feature Flags
    FEATURES: {
        REAL_TIME_UPDATES: true,
        NOTIFICATIONS: true,
        REPORTS_EXPORT: true,
        HISTORY_TRACKING: true,
        AUDIT_LOG: true
    },
    
    // UI Configuration
    UI: {
        SIDEBAR_WIDTH: "16rem",
        THEME: "light", // light, dark, auto
        ANIMATION_ENABLED: true,
        TOAST_DURATION: 5000
    },
    
    // Form Configuration
    FORMS: {
        VALIDATION: {
            EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            PHONE_REGEX: /^[0-9]{10,13}$/,
            PASSWORD_MIN_LENGTH: 6
        }
    },
    
    // Logging Configuration
    LOGGING: {
        ENABLED: true,
        LEVEL: "info", // debug, info, warn, error
        STORAGE: "localStorage"
    }
};

// Helper function untuk mendapatkan permission
function hasPermission(role, permission) {
    const roleConfig = CONFIG.ROLES[role.toUpperCase()];
    if (!roleConfig) return false;
    return roleConfig.permissions.includes("all") || roleConfig.permissions.includes(permission);
}

// Helper function untuk format sesuai locale
function formatLocaleDate(date, format = CONFIG.DATE_FORMAT) {
    const d = new Date(date);
    return d.toLocaleDateString(CONFIG.LOCALE);
}

function formatLocaleTime(date, format = CONFIG.TIME_FORMAT) {
    const d = new Date(date);
    return d.toLocaleTimeString(CONFIG.LOCALE);
}

// Logging helper
const logger = {
    debug: function(message, data) {
        if (CONFIG.LOGGING.ENABLED && CONFIG.LOGGING.LEVEL === 'debug') {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
    info: function(message, data) {
        if (CONFIG.LOGGING.ENABLED) {
            console.log(`[INFO] ${message}`, data);
        }
    },
    warn: function(message, data) {
        if (CONFIG.LOGGING.ENABLED) {
            console.warn(`[WARN] ${message}`, data);
        }
    },
    error: function(message, data) {
        if (CONFIG.LOGGING.ENABLED) {
            console.error(`[ERROR] ${message}`, data);
        }
    }
};

// Export untuk digunakan di module lain
window.CONFIG = CONFIG;
window.hasPermission = hasPermission;
window.formatLocaleDate = formatLocaleDate;
window.formatLocaleTime = formatLocaleTime;
window.logger = logger;