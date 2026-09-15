// student/js/modules/drives.js

// Called by dashboard.js to render individual drive cards
function renderDriveCard(drive) {
    // Parse the schema defined by the Admin
    let schema = { customFields: [] };
    try {
        if (drive.schema) schema = JSON.parse(drive.schema);
    } catch (e) { console.error("Error parsing schema", e); }

    const requiresCustomForm = schema.customFields && schema.customFields.length > 0;
    const safeSchemaString = encodeURIComponent(drive.schema || "{}");

    return `
        <div class="drive-card">
            <h3>${drive.companyName}</h3>
            <div class="drive-meta">
                <span><i class="fas fa-briefcase"></i> ${drive.designation}</span>
                <span><i class="fas fa-rupee-sign"></i> ${drive.package} LPA</span>
                <span><i class="fas fa-calendar"></i> Deadline: ${drive.deadline || 'TBA'}</span>
            </div>
            
            ${requiresCustomForm ? 
                `<button class="btn btn-outline w-100" onclick="openCustomApplyModal('${drive.id}', '${safeSchemaString}')">
                    Fill Details to Apply
                 </button>` 
                : 
                `<button class="btn btn-primary w-100" onclick="submitOneClickApply('${drive.id}')">
                    1-Click Apply
                 </button>`
            }
        </div>
    `;
}

async function submitOneClickApply(driveId) {
    const confirmApply = confirm("Apply using your default profile data?");
    if (!confirmApply) return;

    const grNo = localStorage.getItem('activeStudentGR');
    const response = await fetchFromAPI('applyForDrive', {
        drive_id: driveId,
        gr_no: grNo,
        custom_answers: {} 
    });

    if (response && response.success) {
        alert("Application submitted successfully!");
        initDashboard(); // Refresh UI
    }
}

function openCustomApplyModal(driveId, schemaString) {
    alert("Custom application form logic triggered for Drive: " + driveId);
    // You can build out the modal rendering here as planned in Step 7
}
