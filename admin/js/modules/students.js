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
                <button class="action-btn view-btn" onclick="openStudent360('${student.gr_no}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Modal Logic
function openStudent360(grNo) {
    document.getElementById('studentModal').style.display = 'block';
    document.getElementById('modalTabContent').innerHTML = `Loading 360 data for ${grNo}...`;
    
    // In the advanced phase, this will trigger the 'getStudent360' API call 
    // to query the child tables (Experience, Skills, Applications).
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('modalTabContent').innerHTML = `Displaying <strong>${tabName}</strong> data from respective tables...`;
}
