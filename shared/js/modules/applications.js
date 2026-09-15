// Inside admin/js/modules/applications.js

async function renderApplicationsMaster() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>Master Applicant Tracking</h2>
            <div class="search-bar">
                <!-- Dropdown populated by backend -->
                <select id="driveFilter" class="form-control" style="width: 250px;" onchange="loadApplications(this.value)">
                    <option value="ALL">All Active Drives</option>
                </select>
            </div>
        </div>

        <div class="table-responsive">
            <table class="tpo-table">
                <thead>
                    <tr>
                        <th>App ID</th>
                        <th>Student Name</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="appTableBody">
                    <tr><td colspan="5" class="text-center">Loading applications...</td></tr>
                </tbody>
            </table>
        </div>
    `;

    // Load initial data
    loadApplications('ALL');
}

async function loadApplications(driveIdFilter) {
    const response = await fetchFromAPI('getApplications', { 
        academic_year: window.globalAcademicYear,
        drive_id: driveIdFilter 
    });

    const tbody = document.getElementById('appTableBody');
    tbody.innerHTML = '';

    if (response && response.length > 0) {
        response.forEach(app => {
            // Status color logic
            let statusClass = 'badge-applied';
            if(app.status === 'Shortlisted') statusClass = 'badge-shortlisted';
            if(app.status === 'Selected') statusClass = 'badge-selected';

            tbody.innerHTML += `
                <tr>
                    <td><strong>${app.app_id}</strong></td>
                    <td>${app.student_name} (${app.gr_no})</td>
                    <td>${app.company_name}</td>
                    <td><span id="badge-${app.app_id}" class="badge ${statusClass}">${app.status}</span></td>
                    <td>
                        <select class="form-control" style="width: 140px; display: inline-block;" id="status-select-${app.app_id}">
                            <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                            <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="Selected" ${app.status === 'Selected' ? 'selected' : ''}>Selected</option>
                            <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                        <button class="btn btn-primary" onclick="updateAppStatus('${app.app_id}', '${app.gr_no}', '${app.student_name}', '${app.company_name}')">Save</button>
                    </td>
                </tr>
            `;
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5">No applications found.</td></tr>';
    }
}

async function updateAppStatus(appId, grNo, studentName, companyName) {
    const newStatus = document.getElementById(`status-select-${appId}`).value;
    
    const payload = {
        application_id: appId,
        gr_no: grNo,
        student_name: studentName,
        company_name: companyName,
        new_status: newStatus
    };

    // This calls the backend employer controller we wrote in Step 6
    const response = await fetchFromAPI('updateApplicantStatus', payload);

    if (response && response.success) {
        // Update the badge UI instantly
        const badge = document.getElementById(`badge-${appId}`);
        badge.innerText = newStatus;
        badge.className = `badge badge-${newStatus.toLowerCase()}`;
        alert("Status updated. Automated email dispatched (if applicable).");
    }
}
