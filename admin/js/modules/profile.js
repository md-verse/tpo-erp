// Global variable to hold the current student's data while the modal is open
let currentStudent360 = null;

async function openStudent360(grNo) {
    const modal = document.getElementById('studentModal');
    const content = document.getElementById('modalTabContent');
    const nameHeader = document.getElementById('modalStudentName');
    
    modal.style.display = 'block';
    content.innerHTML = `<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Fetching 360° profile for ${grNo}...</div>`;
    nameHeader.innerText = "Loading...";

    // Fetch relational data from the Apps Script backend
    currentStudent360 = await fetchFromAPI('getStudent360', { gr_no: grNo });

    if (!currentStudent360) {
        content.innerHTML = '<div class="text-danger">Failed to load student data.</div>';
        return;
    }

    // Update Header
    nameHeader.innerText = `${currentStudent360.personal['FIRST NAME']} ${currentStudent360.personal['LAST NAME']} (${grNo})`;
    
    // Load the default tab
    switchTab('Personal');
}

function switchTab(tabName) {
    // UI toggle for active tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const contentDiv = document.getElementById('modalTabContent');
    
    // Route to the correct render function based on the tab clicked
    if (!currentStudent360) return;

    switch(tabName) {
        case 'Personal':
            contentDiv.innerHTML = renderPersonalTab(currentStudent360.personal);
            break;
        case 'Academics':
            contentDiv.innerHTML = renderAcademicsTab(currentStudent360.personal);
            break;
        case 'Experience':
            contentDiv.innerHTML = renderExperienceTab(currentStudent360.experience);
            break;
        case 'Skills':
            contentDiv.innerHTML = renderSkillsTab(currentStudent360.skills);
            break;
        case 'Placements':
            contentDiv.innerHTML = renderPlacementsTab(currentStudent360.placements);
            break;
    }
}

// --- Render Helpers ---

function renderPersonalTab(data) {
    return `
        <div class="profile-grid">
            <div class="data-group"><label>Email</label><p>${data['EMAIL (COLLEGE GENERATED)']}</p></div>
            <div class="data-group"><label>Mobile</label><p>${data['MOBILE NO.']}</p></div>
            <div class="data-group"><label>Father's Name</label><p>${data['FATHER NAME']}</p></div>
            <div class="data-group"><label>Mother's Name</label><p>${data['MOTHER\\'S NAME']}</p></div>
            <div class="data-group"><label>Current Address</label><p>${data['CURRENT ADDRESS']}</p></div>
            <div class="data-group"><label>Career Inclination</label><p>${data['CAREER INCLINATION']}</p></div>
        </div>
    `;
}

function renderExperienceTab(experiences) {
    if (experiences.length === 0) return `<p>No experience records found.</p>`;
    
    let html = `<ul class="timeline">`;
    experiences.forEach(exp => {
        html += `
            <li>
                <strong>${exp['Role / Designation']}</strong> at ${exp['Company Name']}
                <br><small>${exp['Duration (Months)']} Months | Type: ${exp['Type (Internship/Work)']}</small>
                <p>${exp['Description']}</p>
            </li>
        `;
    });
    html += `</ul>`;
    return html;
}

function renderSkillsTab(skills) {
     if (skills.length === 0) return `<p>No skills recorded.</p>`;
     let html = `<div class="skills-wrapper">`;
     skills.forEach(skill => {
         html += `<span class="skill-tag">${skill['Skill / Certification Name']} <small>(${skill['Issuer / Details']})</small></span>`;
     });
     html += `</div>`;
     return html;
}

// (renderAcademicsTab and renderPlacementsTab follow the exact same pattern)
