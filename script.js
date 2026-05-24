// DOM Elements
const sidebar = document.querySelector('.sidebar');
const layout = document.querySelector('.layout');
const toggleSidebar = document.getElementById('toggleSidebar');
const toggleTheme = document.getElementById('toggleTheme');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const toastContainer = document.getElementById('toastContainer');

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

toggleTheme.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Sidebar Toggle
toggleSidebar.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  layout.classList.toggle('full');
});

// Page Navigation
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const pageName = item.dataset.page;
    navigateTo(pageName);
  });
});

function navigateTo(pageName) {
  // Hide all pages
  pages.forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const targetPage = document.querySelector(`[data-page="${pageName}"]`);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // Update nav items
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });
  
  // Update page title
  const pageTitles = {
    dashboard: 'Dashboard',
    analytics: 'Analytics & Reports',
    commands: 'System Commands',
    config: 'Configuration',
    about: 'About ADLAI'
  };
  pageTitle.textContent = pageTitles[pageName] || 'Dashboard';
}

// Toast Notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `<span>${icons[type] || icons.info}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slide-out 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Real-time Data Updates
function updateSensorData() {
  // Simulate sensor data
  const moisture = (Math.random() * 20 + 50).toFixed(1);
  const temperature = (Math.random() * 5 + 26).toFixed(1);
  const humidity = (Math.random() * 15 + 65).toFixed(0);
  
  document.getElementById('moistureValue').textContent = moisture + '%';
  document.getElementById('temperatureValue').textContent = temperature + '°C';
  document.getElementById('sensor1Value').textContent = moisture + '%';
  document.getElementById('sensor2Value').textContent = temperature + '°C';
  document.getElementById('sensor3Value').textContent = humidity + '%';
}

// Last Sync Timer
function updateLastSync() {
  const lastSyncEl = document.getElementById('lastSync');
  let seconds = 0;
  
  setInterval(() => {
    seconds++;
    if (seconds < 60) {
      lastSyncEl.textContent = seconds + 's ago';
    } else {
      const minutes = Math.floor(seconds / 60);
      lastSyncEl.textContent = minutes + 'm ago';
    }
  }, 1000);
}

// Commands
function executeCommand(command) {
  const commandNames = {
    start: 'Irrigation cycle started',
    stop: 'Irrigation stopped',
    calibrate: 'Sensor calibration started'
  };
  
  const cmdLog = document.getElementById('commandLog');
  const logLine = document.createElement('div');
  logLine.className = 'log-line';
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  logLine.innerHTML = `
    <span class="log-ts">${time}</span>
    <span class="log-msg-ok">✓ ${commandNames[command]}</span>
  `;
  
  cmdLog.insertBefore(logLine, cmdLog.firstChild);
  showToast(commandNames[command], 'success');
}

// Configuration
function saveConfig() {
  const config = {
    minMoisture: document.getElementById('minMoisture').value,
    maxMoisture: document.getElementById('maxMoisture').value,
    tempRange: document.getElementById('tempRange').value,
    etEnabled: document.getElementById('etToggle').classList.contains('on'),
    weatherEnabled: document.getElementById('weatherToggle').classList.contains('on'),
    nightMode: document.getElementById('nightToggle').classList.contains('on')
  };
  
  localStorage.setItem('systemConfig', JSON.stringify(config));
  showToast('Configuration saved successfully', 'success');
}

function resetConfig() {
  document.getElementById('minMoisture').value = '40';
  document.getElementById('maxMoisture').value = '75';
  document.getElementById('tempRange').value = '25-30°C';
  document.getElementById('etToggle').classList.add('on');
  document.getElementById('weatherToggle').classList.add('on');
  document.getElementById('nightToggle').classList.remove('on');
  showToast('Configuration reset to defaults', 'info');
}

// Toggle Configuration
document.querySelectorAll('.config-toggle').forEach(toggle => {
  toggle.addEventListener('click', function() {
    this.classList.toggle('on');
  });
});

// Load Configuration
function loadConfig() {
  const saved = localStorage.getItem('systemConfig');
  if (saved) {
    const config = JSON.parse(saved);
    document.getElementById('minMoisture').value = config.minMoisture;
    document.getElementById('maxMoisture').value = config.maxMoisture;
    document.getElementById('tempRange').value = config.tempRange;
    
    if (config.etEnabled) document.getElementById('etToggle').classList.add('on');
    if (config.weatherEnabled) document.getElementById('weatherToggle').classList.add('on');
    if (config.nightMode) document.getElementById('nightToggle').classList.add('on');
  }
}

// Initialize
window.addEventListener('load', () => {
  initTheme();
  loadConfig();
  updateSensorData();
  updateLastSync();
  
  // Update sensor data every 5 seconds
  setInterval(updateSensorData, 5000);
  
  // Navigate to dashboard by default
  navigateTo('dashboard');
});

// Responsive
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove('hidden');
    layout.classList.remove('full');
  }
});
