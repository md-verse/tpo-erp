// admin/js/modules/drives.js

function renderDriveBuilder() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header mb-4">
            <h2>Create New Placement Drive</h2>
        </div>
        
        <div class="form-card" style="max-width: 800px;">
            <form id="driveBuilderForm">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" id="compName" required class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Designation</label>
                        <input type="text" id="designation" required class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Package (LPA)</label>
                        <input type="text" id="package" required class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Drive Date</label>
                        <input type="date" id="driveDate" required class="form-control">
                    </div>
                </div>

                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;">
                
                <h3 style="margin-bottom: 15px; font-size: 1.1rem;">Application Schema Builder</h3>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <h4 style="font-size: 0.9rem; color: #64748b; margin-bottom: 10px;">Custom Fields (Student must fill these manually)</h4>
                    <div id="customFieldsContainer" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
                        <!-- Custom fields added here dynamically -->
                    </div>
                    <button type="button" class="btn btn-outline btn-sm" onclick="addCustomField()">+ Add Custom Question</button>
                </div>

                <button type="submit" class="btn btn-primary mt-4" style="margin-top: 20px;">Publish Drive</button>
            </form>
        </div>
    `;

    document.getElementById('driveBuilderForm').addEventListener('submit', handleDriveSubmit);
}

function addCustomField() {
    const container = document.getElementById('customFieldsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control custom-field-input';
    input.placeholder = 'e.g., "GitHub Link" or "Current Backlog Count"';
    container.appendChild(input);
}

async function handleDriveSubmit(e) {
    e.preventDefault();
    
    const customFields = Array.from(document.querySelectorAll('.custom-field-input'))
                              .map(input => input.value)
                              .filter(val => val.trim() !== "");

    const payload = {
        company_name: document.getElementById('compName').value,
        designation: document.getElementById('designation').value,
        package: document.getElementById('package').value,
        drive_date: document.getElementById('driveDate').value,
        custom_fields: customFields
    };

    const response = await fetchFromAPI('createDrive', payload);
    if(response && response.success) {
        alert("Drive Published Successfully!");
        renderDriveBuilder(); // Reset form
    }
}
