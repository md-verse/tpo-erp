// admin/js/modules/students.js

async function initStudentRecords() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Student Records</h2>
            <div class="search-bar" style="display: flex; gap: 10px;">
                <input type="text" id="studentSearch" placeholder="Search GR No or Name..." class="form-control" style="width: 250px;">
                <button class="btn btn-primary" onclick="loadStudentData()"><i class="fas fa-search"></i> Search</button>
            </div>
        </div>

        <div class="table-responsive">
            <table class="tpo-table" id="studentsTable">
                <thead>
                    <tr>
                        <th>GR No</th>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>CGPA</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="studentsTableBody">
                    <tr><td colspan="6" class="text-center">Loading students...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    loadStudentData();
}

async function loadStudentData() {
    const students = await fetchFromAPI('getSmartList', { 
        academic_year: window.globalAcademicYear 
    });

    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = '';

    if (!students || students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No records found.</td></tr>';
        return;
    }

    students.forEach(student => {
        let statusClass = student.status.toLowerCase() === 'placed' ? 'badge-placed' : 'badge-eligible';
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${student.gr_no}</strong></td>
                <td>${student.name}</td>
                <td><span class="badge badge-branch">${student.branch}</span></td>
                <td>${student.cgpa}</td>
                <td><span class="badge ${statusClass}">${student.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="alert('360 Profile Feature Coming Soon for GR: ${student.gr_no}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
}
