async function initDashboard() {
    const grNo = localStorage.getItem('activeStudentGR');
    document.getElementById('studentNameDisplay').innerText = localStorage.getItem('studentName');
    
    const response = await fetchFromAPI('getStudentDashboard', { gr_no: grNo });
    
    if (response) {
        document.getElementById('completionScore').innerText = response.profileCompletion + "%";
        
        const container = document.getElementById('drivesContainer');
        container.innerHTML = '';
        
        response.eligibleDrives.forEach(drive => {
            // Reusing the renderDriveCard function we discussed in Step 7
            container.innerHTML += renderDriveCard(drive);
        });
    }
}
