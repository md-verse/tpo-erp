// Global state for the currently selected drive
let currentDriveContext = null;

function renderDriveCard(drive) {
    // drive.schema is the parsed JSON from the FORM SCHEMA column
    const schema = JSON.parse(drive.schema);
    const requiresCustomForm = schema.customFields && schema.customFields.length > 0;

    return `
        <div class="drive-card">
            <h3>${drive.companyName}</h3>
            <p><strong>Designation:</strong> ${drive.designation}</p>
            <p><strong>Package:</strong> ${drive.package} LPA</p>
            
            ${requiresCustomForm ? 
                `<button class="btn btn-outline" onclick="openCustomApplyModal('${drive.id}', '${escape(drive.schema)}')">
                    Fill Details to Apply
                 </button>` 
                : 
                `<button class="btn btn-primary" onclick="submitOneClickApply('${drive.id}')">
                    1-Click Apply
                 </button>`
            }
        </div>
    `;
}

// ----------------------------------------------------
// Path A: 1-Click Apply (No Custom Fields Required)
// ----------------------------------------------------
async function submitOneClickApply(driveId) {
    const confirmApply = confirm("Apply for this drive using your default profile data?");
    if (!confirmApply) return;

    // Retrieve active student session from localStorage (secured by signed token)[cite: 1]
    const activeGR = localStorage.getItem('activeStudentGR');

    const response = await fetchFromAPI('applyForDrive', {
        drive_id: driveId,
        gr_no: activeGR,
        custom_answers: {} // Empty because no custom fields were required
    });

    if (response && response.success) {
        alert(response.message);
        // Refresh dashboard UI to show "Applied"
    }
}

// ----------------------------------------------------
// Path B: Custom Form (Custom Fields Required)
// ----------------------------------------------------
function openCustomApplyModal(driveId, schemaString) {
    currentDriveContext = driveId;
    const schema = JSON.parse(unescape(schemaString));
    
    const container = document.getElementById('customFormContainer');
    container.innerHTML = ''; // Clear previous

    // Dynamically inject inputs based on the Admin's custom fields
    schema.customFields.forEach((field, index) => {
        container.innerHTML += `
            <div class="form-group mb-3">
                <label>${field}</label>
                <input type="text" class="form-control custom-answer" data-question="${field}" required>
            </div>
        `;
    });

    document.getElementById('applyModal').style.display = 'block';
}

async function submitCustomApplication(event) {
    event.preventDefault();
    
    const activeGR = localStorage.getItem('activeStudentGR');
    const answers = {};
    
    // Gather all dynamically generated answers
    document.querySelectorAll('.custom-answer').forEach(input => {
        answers[input.dataset.question] = input.value;
    });

    const response = await fetchFromAPI('applyForDrive', {
        drive_id: currentDriveContext,
        gr_no: activeGR,
        custom_answers: answers
    });

    if (response && response.success) {
        alert(response.message);
        document.getElementById('applyModal').style.display = 'none';
        // Refresh dashboard UI
    }
}
