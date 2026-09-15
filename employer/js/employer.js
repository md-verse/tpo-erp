async function employerLogin() {
    const driveId = document.getElementById('driveId').value;
    const secret = document.getElementById('companySecret').value;

    const response = await fetchFromAPI('employerLogin', { drive_id: driveId, secret: secret });

    if (response && response.success) {
        document.getElementById('employerLogin').style.display = 'none';
        document.getElementById('employerDashboard').style.display = 'block';
        
        const tbody = document.getElementById('applicantTableBody');
        response.applicants.forEach(app => {
            tbody.innerHTML += `
                <tr>
                    <td>${app.name}</td>
                    <td>${app.branch}</td>
                    <td>${app.cgpa}</td>
                    <td><span class="badge">${app.status}</span></td>
                    <td><button class="btn btn-outline btn-sm">View CV</button></td>
                </tr>
            `;
        });
    } else {
        alert("Invalid Drive ID or Secret");
    }
}
