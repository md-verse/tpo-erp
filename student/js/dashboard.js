// student/js/dashboard.js

async function initDashboard() {
    const grNo = localStorage.getItem('activeStudentGR');
    const nameDisplay = document.getElementById('studentNameDisplay');
    
    if(nameDisplay) {
        nameDisplay.innerText = localStorage.getItem('studentName') || "Student";
    }
    
    // Fetch dashboard data from backend
    const response = await fetchFromAPI('getStudentDashboard', { gr_no: grNo });
    
    if (response) {
        // 1. Update Profile Completion UI
        const scoreElement = document.getElementById('completionScore');
        if (scoreElement) scoreElement.innerText = (response.profileCompletion || 0) + "%";
        
        // 2. Render Eligible Drives
        const container = document.getElementById('drivesContainer');
        if (container) {
            container.innerHTML = '';
            
            if (!response.eligibleDrives || response.eligibleDrives.length === 0) {
                container.innerHTML = '<p class="text-muted">No eligible drives available at this time.</p>';
                return;
            }
            
            response.eligibleDrives.forEach(drive => {
                container.innerHTML += `
                    <div class="drive-card">
                        <h3>${drive.companyName}</h3>
                        <div class="drive-meta">
                            <span><i class="fas fa-briefcase"></i> ${drive.designation}</span>
                            <span><i class="fas fa-rupee-sign"></i> ${drive.package} LPA</span>
                            <span><i class="fas fa-calendar"></i> Deadline: ${drive.deadline || 'N/A'}</span>
                        </div>
                        <button class="btn btn-primary" onclick="handleApply('${drive.id}')">Apply Now</button>
                    </div>
                `;
            });
        }
    } else {
        document.getElementById('drivesContainer').innerHTML = '<p class="text-danger">Failed to load dashboard data.</p>';
    }
}

function handleApply(driveId) {
    // In production, this ties into the schema evaluator we built in drives.js
    alert(`Initiating application for Drive ID: ${driveId}`);
}
