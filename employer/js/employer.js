// employer/js/employer.js

async function initEmployerDashboard() {
    const driveId = localStorage.getItem('activeDriveId');
    if (!driveId) return;

    const tbody = document.getElementById('applicantTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading applicants...</td></tr>';

    // Fetch applicants specifically for this drive
    const response = await fetchFromAPI('getEmployerDriveData', { drive_id: driveId });

    if (response && response.applicants && response.applicants.length > 0) {
        tbody.innerHTML = '';
        
        response.applicants.forEach(app => {
            // Apply status badge styling
            let statusClass = 'badge-applied';
            if (app.status === 'Shortlisted') statusClass = 'badge-shortlisted';
            if (app.status === 'Selected') statusClass = 'badge-selected';

            tbody.innerHTML += `
                <tr>
                    <td><strong>${app.name}</strong></td>
                    <td>${app.branch}</td>
                    <td>${app.cgpa}</td>
                    <td><span class="badge ${statusClass}">${app.status}</span></td>
                    <td>
                        <button class="btn btn-outline btn-sm" onclick="viewCV('${app.cvUrl}')">
                            <i class="fas fa-file-pdf"></i> View CV
                        </button>
                    </td>
                </tr>
            `;
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No applicants found for this drive yet.</td></tr>';
    }
}

function viewCV(url) {
    if (!url || url === 'undefined' || url.trim() === '') {
        alert("Applicant has not uploaded a valid CV.");
        return;
    }
    window.open(url, '_blank');
}
