// Load this script when the "Student Records" sidebar item is clicked

async function initStudentRecords() {
    const contentArea = document.getElementById('contentArea');
    
    // 1. Inject the UI Skeleton (Search + Smart Table + Hidden Modal)
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>Student Records</h2>
            <div class="search-bar">
                <input type="text" id="studentSearch" placeholder="Search GR No, Name, or Branch..." class="form-control">
                <button class="btn btn-primary" onclick="loadStudentData()"><i class="fas fa-search"></i> Search</button>
            </div>
        </div>

        <!-- The Responsive Wrapper prevents page overflow -->
        <div class="table-responsive">
            <table class="tpo-table" id="studentsTable">
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>GR No</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="studentsTableBody">
                    <tr><td colspan="7" class="text-center">Loading students for ${window.globalAcademicYear}...</td></tr>
                </tbody>
            </table>
        </div>

        <!-- 360 Degree Profile Modal (Hidden by default) -->
        <div id="studentModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <h3 id="modalStudentName">Student Name</h3>
                
                <!-- Relational Tabs -->
                <div class="tab-container">
                    <button class="tab-btn active" onclick="switchTab('Personal')">Personal</button>
                    <button class="tab-btn" onclick="switchTab('Academics')">Academics</button>
                    <button class="tab-btn" onclick="switchTab('Skills')">Skills</button>
                    <button class="tab-btn" onclick="switchTab('Experience')">Experience</button>
                    <button class="tab-btn" onclick="switchTab('Placements')">Placements</button>
                </div>
                
                <div id="modalTabContent" class="tab-body">
                    <!-- Tab data loads here dynamically -->
                </div>
            </div>
        </div>
    `;

    // 2. Fetch the minimal data payload
    loadStudentData();
}

async function loadStudentData() {
    // Uses the API wrapper built in Step 1
    const students = await fetchFromAPI('getSmartList', { 
        academic_year: window.globalAcademicYear 
    });

    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No records found.</td></tr>';
        return;
    }

    // 3. Render only the essentials
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${student.photo || 'assets/default-avatar.png'}" class="avatar-sm" alt="Photo"></td>
            <td><strong>${student.gr_no}</strong></td>
            <td>${student.name}</td>
            <td><span class="badge badge-branch">${student.branch}</span></td>
            <td>${student.cgpa}</td>
            <td><span class="badge badge-status">${student.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="open360Profile('${student.gr_no}')"><i class="fas fa-eye"></i> View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal Logic
// Inside admin/js/modules/students.js

// Replace the button in your loadStudentData() function to look like this:
// <button class="btn btn-outline btn-sm" onclick="open360Profile('${student.gr_no}')"><i class="fas fa-eye"></i> View</button>

async function open360Profile(grNo) {
    // 1. Create and inject modal container if it doesn't exist
    if (!document.getElementById('profileModal360')) {
        const modalHtml = `
            <div id="profileModal360" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(17, 24, 39, 0.7); backdrop-filter: blur(4px);">
                <div class="modal-content" style="background-color: white; margin: 4% auto; padding: 2rem; border-radius: 12px; width: 90%; max-width: 700px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-height: 85vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 20px;">
                        <h2 id="modalStudentName">Student Profile</h2>
                        <button class="icon-btn" onclick="document.getElementById('profileModal360').style.display='none'"><i class="fas fa-times"></i></button>
                    </div>
                    <div id="modal360Content">Loading data...</div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modal = document.getElementById('profileModal360');
    const content = document.getElementById('modal360Content');
    const nameTitle = document.getElementById('modalStudentName');
    
    modal.style.display = 'block';
    content.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i><p class="mt-3">Fetching 360° Data...</p></div>';

    // 2. Fetch Relational Data from Backend
    const response = await fetchFromAPI('getStudent360', { gr_no: grNo });

    if (response && response.success) {
        const p = response.personal;
        nameTitle.innerText = `${p['FIRST NAME']} ${p['LAST NAME']} (${grNo})`;
        
        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <!-- Academic Summary -->
                <div class="form-card" style="padding: 15px; box-shadow: none; background: #f8fafc;">
                    <h3 style="font-size: 1rem; color: #4f46e5; margin-bottom: 15px;"><i class="fas fa-graduation-cap"></i> Academics</h3>
                    <p><strong>Branch:</strong> ${p['BRANCH'] || 'N/A'}</p>
                    <p><strong>CGPA:</strong> ${p['AGGREGATE CGPA'] || 'N/A'}</p>
                    <p><strong>Active Backlogs:</strong> ${p['ACTIVE BACKLOGS'] || '0'}</p>
                </div>
                
                <!-- Contact & CV -->
                <div class="form-card" style="padding: 15px; box-shadow: none; background: #f8fafc;">
                    <h3 style="font-size: 1rem; color: #10b981; margin-bottom: 15px;"><i class="fas fa-address-card"></i> Contact</h3>
                    <p><strong>Email:</strong> ${p['PERSONAL EMAIL'] || 'N/A'}</p>
                    <p><strong>Mobile:</strong> ${p['MOBILE NO.'] || 'N/A'}</p>
                    <p class="mt-3">
                        <a href="${p['UPLOAD UPDATED CV (URL)'] || '#'}" target="_blank" class="btn btn-outline btn-sm w-100">
                            <i class="fas fa-file-pdf"></i> View Resume
                        </a>
                    </p>
                </div>
            </div>

            <!-- ATS Application History -->
            <h3 style="font-size: 1rem; margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-history"></i> Placement Activity</h3>
            <table class="tpo-table" style="font-size: 0.85rem;">
                <thead><tr><th>Company</th><th>Status</th></tr></thead>
                <tbody>
                    ${response.applications.length > 0 
                        ? response.applications.map(app => `<tr><td>${app.company}</td><td><span class="badge badge-applied">${app.status}</span></td></tr>`).join('') 
                        : `<tr><td colspan="2" class="text-muted text-center">No placement activity yet.</td></tr>`
                    }
                </tbody>
            </table>
        `;
    } else {
        content.innerHTML = '<p class="text-danger text-center">Failed to load student profile.</p>';
    }
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('modalTabContent').innerHTML = `Displaying <strong>${tabName}</strong> data from respective tables...`;
}
