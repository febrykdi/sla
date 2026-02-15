# SETUP GUIDE - SLA Dashboard

## Prerequisites

- **Browser**: Chrome, Firefox, Safari, atau Edge (versi terbaru)
- **Network**: Koneksi internet untuk load CDN libraries
- **Storage**: Browser dengan localStorage enabled

## Installation

### Method 1: Direct File Access
1. Download semua file di folder `SLA-web`
2. Buka file `index.html` di browser
3. Aplikasi akan langsung berjalan

### Method 2: Local Server
```bash
# Menggunakan Python 3
python -m http.server 8000

# Menggunakan Node.js (http-server)
npx http-server

# Menggunakan PHP
php -S localhost:8000
```

Kemudian akses: `http://localhost:8000/index.html`

## File Dependencies

### Script Loading Order
Setiap halaman harus load script dalam urutan berikut:

```html
1. config.js        <!-- Configuration (optional but recommended) -->
2. auth.js          <!-- Authentication -->
3. data/sample-data.js  <!-- Sample Data -->
4. data/database.js     <!-- Database Simulation -->
5. scripts/utils.js     <!-- Utilities -->
6. scripts/main.js      <!-- Main Setup -->
7. scripts/[module].js  <!-- Module Specific (tickets.js, dashboard.js, etc) -->
```

### External Libraries

```html
<!-- Tailwind CSS Play CDN -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Chart.js untuk visualisasi -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

## Quick Start

### 1. Login
- Open `index.html`
- Gunakan credentials:
  - Username: `admin`
  - Password: `admin123`
  - Role: `Admin`

### 2. Dashboard Overview
- Sistem akan redirect ke halaman yang sesuai dengan role
- Admin dapat akses semua halaman
- Teknisi hanya akses tickets & monitoring
- Marketing hanya akses tiket & laporan

### 3. Halaman Utama
- **Dashboard** (`dashboard.html`) - Overview KPI
- **Tickets** (`tickets.html`) - Manajemen tiket
- **SLA Monitoring** (`sla-monitoring.html`) - Monitoring real-time
- **Reports** (`reporting.html`) - Laporan & analitik
- **Master Data** (`master-data.html`) - Konfigurasi sistem
- **Profile** (`profile.html`) - Profil pengguna

## Struktur File Lengkap

```
SLA-web/
├── README.md                      # Dokumentasi utama
├── SETUP.md                       # File ini
│
├── index.html                     # Login Page
├── dashboard.html                 # Main Dashboard
├── tickets.html                   # Ticket Management
├── sla-monitoring.html            # SLA Monitoring
├── reporting.html                 # Reports & Analytics  
├── master-data.html               # Master Data
├── profile.html                   # User Profile
│
├── styles/
│   └── custom.css                 # Custom Styling
│
├── scripts/
│   ├── config.js                  # System Configuration
│   ├── auth.js                    # Authentication Module
│   ├── main.js                    # Main Module
│   ├── utils.js                   # Utility Functions
│   ├── dashboard.js               # Dashboard Module
│   ├── tickets.js                 # Tickets Module
│   ├── sla-monitoring.js          # SLA Monitoring Module
│   ├── reporting.js               # Reporting Module
│   └── master-data.js             # Master Data Module
│
├── data/
│   ├── sample-data.js             # Sample Data
│   └── database.js                # Database Simulation
│
└── assets/
    ├── icons/                     # Icons folder
    └── images/                    # Images folder
```

## Module Architecture

### Auth Module (auth.js)
Handles authentication and authorization:
- Login/Logout
- Session management
- Role-based access control
- Permission checking

**Key Functions:**
```javascript
authenticateUser(username, password)
getCurrentUser()
logout()
hasPermission(permission)
```

### Main Module (main.js)
Central initialization and setup:
- Dashboard initialization
- Event listener setup
- User info management
- Utility functions

**Key Functions:**
```javascript
initDashboard()
setupEventListeners()
logout()
updateUserInfo()
showAlert(type, message)
```

### Module-Specific Files
Each feature has its own module:

**Dashboard.js**
- Dashboard charts
- Alert management
- Metrics calculation

**Tickets.js**
- Ticket listing & filtering
- CRUD operations
- Status tracking

**SLA Monitoring.js**
- Compliance tracking
- Chart visualization
- Real-time updates

**Reporting.js**
- Report generation
- Multiple report types
- Export functionality

**Master Data.js**
- Data management
- Tab navigation
- CRUD operations

## Data Flow

```
User Login (index.html)
    ↓
Auth.js - Authenticate
    ↓
Store in localStorage
    ↓
Redirect to Dashboard
    ↓
Main.js - Initialize
    ↓
Load Module (tickets.js, etc)
    ↓
Render UI & Load Data
```

## Configuration

Edit `scripts/config.js` untuk mengubah:
- Nama aplikasi
- API endpoints
- SLA targets
- User roles
- Localization

## Troubleshooting

### Issue: Login page blank
**Solution:**
- Check browser console untuk error
- Verify semua CDN library terhubung
- Clear browser cache

### Issue: Data tidak show
**Solution:**
- Check browser devtools Network tab
- Verify localStorage tidak full
- Reload halaman

### Issue: Module tidak load
**Solution:**
- Verify script file ada
- Check HTML script tag sudah benar
- Verify no JavaScript error di console

### Issue: Styling bermasalah
**Solution:**
- Check Tailwind CDN loading
- Verify custom.css loaded
- Clear browser cache

## Development Tips

### Adding New Page
1. Create HTML file dengan struktur:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <!-- Styles -->
   </head>
   <body>
       <!-- Content -->
       <!-- Scripts in order -->
   </body>
   </html>
   ```

2. Create module file di `scripts/`

3. Add navigation link di sidebar

### Adding New Module
1. Create `scripts/module-name.js`
2. Define module object:
   ```javascript
   const moduleName = {
       init: function() { },
       loadData: function() { },
       render: function() { }
   };
   ```

3. Initialize di DOMContentLoaded

### Local Testing
Use browser DevTools:
- F12 untuk open DevTools
- Console tab untuk debugging
- Network tab untuk API calls
- Application tab untuk localStorage

## Browser DevTools Tips

### Console Testing
```javascript
// Check user
getCurrentUser()

// Check config
CONFIG

// Check permissions
hasPermission('admin', 'view_all')

// Show alerts
showAlert('success', 'Test message')
```

### LocalStorage Management
```javascript
// View all data
Object.keys(localStorage).forEach(k => console.log(k, localStorage[k]))

// Clear all
localStorage.clear()

// Set data
localStorage.setItem('key', JSON.stringify(value))
```

## Performance Optimization

### Caching Strategy
- Use localStorage untuk data temporal
- Cache data dengan expiry time
- Implement lazy loading untuk data besar

### Code Optimization
- Minimize DOM queries
- Debounce event listeners
- Optimize chart rendering

### Network Optimization
- Use minified CSS/JS
- Enable gzip compression
- Load external libraries dari CDN

## Future Enhancements

### Backend Integration
- Setup Node.js/Express server
- Create REST API endpoints
- Integrate with database (PostgreSQL, MongoDB)

### Advanced Features
- WebSocket untuk real-time updates
- PWA capability
- Offline support

### Testing
- Unit tests dengan Jest
- Integration tests
- E2E tests dengan Cypress

## Support & Documentation

For more info:
- Check README.md untuk overview
- Review code comments
- Check browser console untuk error messages
- Inspect network tab untuk API calls

---

**Last Updated**: February 10, 2026  
**Version**: 1.0.0