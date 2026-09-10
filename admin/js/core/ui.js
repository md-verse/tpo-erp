document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const moduleBtns = document.querySelectorAll('.module-btn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const academicYear = document.getElementById('academicYear');

    // Define Sub-menus based on the blueprint
    const menuConfig = {
        student: [
            { name: 'Dashboard', icon: 'fa-chart-pie', id: 'dashboard' },
            { name: 'Student Records', icon: 'fa-users', id: 'students' },
            { name: 'Experiences', icon: 'fa-briefcase', id: 'experiences' },
            { name: 'Skills', icon: 'fa-lightbulb', id: 'skills' },
            { name: 'Placements', icon: 'fa-award', id: 'placements' }
        ],
        employer: [
            { name: 'Placement Drives', icon: 'fa-building', id: 'drives' },
            { name: 'Company Master', icon: 'fa-city', id: 'companies' },
            { name: 'Applications', icon: 'fa-file-alt', id: 'applications' }
        ],
        training: [
            { name: 'Dashboard', icon: 'fa-chart-line', id: 'train_dash' },
            { name: 'Training Batches', icon: 'fa-layer-group', id: 'batches' },
            { name: 'Attendance', icon: 'fa-clipboard-user', id: 'attendance' }
        ],
        admin: [
            { name: 'Staff Management', icon: 'fa-user-tie', id: 'staff' },
            { name: 'Task Manager', icon: 'fa-tasks', id: 'tasks' },
            { name: 'System Settings', icon: 'fa-cogs', id: 'settings' }
        ],
        reports: [
            { name: 'Placement Analytics', icon: 'fa-chart-bar', id: 'rep_placement' },
            { name: 'NAAC Data', icon: 'fa-file-pdf', id: 'rep_naac' }
        ]
    };

    // Toggle Sidebar Minify/Expand
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Handle Top Nav Main Module Clicks
    moduleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update button active UI
            moduleBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Render specific sidebar items
            const selectedModule = e.target.dataset.module;
            renderSidebar(menuConfig[selectedModule]);
        });
    });

    // Function to draw Sidebar Items
    function renderSidebar(items) {
        sidebarMenu.innerHTML = '';
        items.forEach((item, index) => {
            const li = document.createElement('li');
            if(index === 0) li.classList.add('active'); // Auto-select first item
            
            li.innerHTML = `<i class="fas ${item.icon}"></i><span class="menu-text">${item.name}</span>`;
            
            li.addEventListener('click', () => {
                // Handle active state
                document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
                
                // Placeholder for module loading (Will link to API in Step 3)
                document.getElementById('contentArea').innerHTML = `
                    <div class="table-responsive">
                        <h2>${item.name}</h2>
                        <p>Module view for ${item.name} loading...</p>
                    </div>`;
            });
            
            sidebarMenu.appendChild(li);
        });
    }

    // Set Global Context for Academic Year
    window.globalAcademicYear = academicYear.value;
    academicYear.addEventListener('change', (e) => {
        window.globalAcademicYear = e.target.value;
        // In Step 3, this change event will trigger a fresh API fetch for the active table
    });

    // Initialize the default view (Student Module)
    renderSidebar(menuConfig['student']);
});
