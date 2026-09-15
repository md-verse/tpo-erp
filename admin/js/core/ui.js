// admin/js/core/ui.js

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const moduleBtns = document.querySelectorAll('.module-btn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const academicYear = document.getElementById('academicYear');

    // Define Sub-menus for the Sidebar
    const menuConfig = {
        student: [
            { name: 'Dashboard', icon: 'fa-chart-pie', id: 'dashboard' },
            { name: 'Student Records', icon: 'fa-users', id: 'students' },
            { name: 'Placements', icon: 'fa-award', id: 'placements' }
        ],
        employer: [
            { name: 'Placement Drives', icon: 'fa-building', id: 'drives' },
            { name: 'Applications (ATS)', icon: 'fa-file-alt', id: 'applications' }
        ],
        training: [
            { name: 'Training Batches', icon: 'fa-layer-group', id: 'batches' },
            { name: 'Attendance', icon: 'fa-clipboard-user', id: 'attendance' }
        ],
        admin: [
            { name: 'Staff Management', icon: 'fa-user-tie', id: 'staff' },
            { name: 'System Settings', icon: 'fa-cogs', id: 'settings' }
        ],
        reports: [
            { name: 'KPI Dashboard', icon: 'fa-chart-bar', id: 'rep_kpi' },
            { name: 'NAAC Exports', icon: 'fa-file-excel', id: 'rep_naac' }
        ]
    };

    // Toggle Sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Handle Top Nav Main Module Clicks
    moduleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            moduleBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderSidebar(menuConfig[e.target.dataset.module]);
        });
    });

    // Render Sidebar Items
    function renderSidebar(items) {
        sidebarMenu.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            if(index === 0) li.classList.add('active'); 
            
            li.innerHTML = `<i class="fas ${item.icon}"></i><span class="menu-text">${item.name}</span>`;
            
            li.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                
                // Route to specific JS functions based on the ID
                routeModule(item.id);
            });
            
            sidebarMenu.appendChild(li);
        });
        
        // Auto-load the first module of the selected tab
        routeModule(items[0].id);
    }

    // Module Router
    function routeModule(moduleId) {
        const contentArea = document.getElementById('contentArea');
        contentArea.innerHTML = `<div class="text-center mt-5"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Loading module...</p></div>`;
        
        // Match the ID to the function in your module scripts
        switch(moduleId) {
            case 'students':
                if (typeof initStudentRecords === "function") initStudentRecords();
                else contentArea.innerHTML = `<h2>Student Records</h2><p>students.js not loaded.</p>`;
                break;
            case 'drives':
                if (typeof renderDriveBuilder === "function") renderDriveBuilder();
                else contentArea.innerHTML = `<h2>Placement Drives</h2><p>drives.js not loaded.</p>`;
                break;
            case 'applications':
                if (typeof renderApplicationsMaster === "function") renderApplicationsMaster();
                else contentArea.innerHTML = `<h2>Master ATS</h2><p>applications.js not loaded.</p>`;
                break;
            case 'settings':
                if (typeof renderSystemSettings === "function") renderSystemSettings();
                else contentArea.innerHTML = `<h2>System Settings</h2><p>settings.js not loaded.</p>`;
                break;
            // Add other cases as you build them
            default:
                contentArea.innerHTML = `<h2>${moduleId}</h2><p>Module view coming soon.</p>`;
        }
    }

    // Global Academic Year Context
    window.globalAcademicYear = academicYear.value;
    academicYear.addEventListener('change', (e) => {
        window.globalAcademicYear = e.target.value;
        // Reload the currently active sidebar item to refresh data
        const activeItem = document.querySelector('.sidebar-menu li.active .menu-text').innerText.toLowerCase();
        // (Add logic to re-trigger routeModule if needed)
    });

    // Initialize Default View
    renderSidebar(menuConfig['student']);
});
