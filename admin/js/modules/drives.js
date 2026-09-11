// Load this when "Placement Drives" is clicked in the sidebar

function renderDriveBuilder() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>Create New Placement Drive</h2>
        </div>
        
        <div class="form-card">
            <form id="driveBuilderForm">
                <!-- Standard Drive Details -->
                <div class="form-row">
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
                </div>

                <hr>
                
                <!-- The Dynamic Schema Builder -->
                <h3>Application Requirements (Schema Builder)</h3>
                <p class="text-muted">Select what the student must provide to apply.</p>
                
                <div class="schema-section">
                    <h4>Standard Fields (Auto-pulled from profile)</h4>
                    <label><input type="checkbox" class="std-field" value="Resume" checked> Resume</label>
                    <label><input type="checkbox" class="std-field" value="CGPA" checked> CGPA</label>
                    <label><input type="checkbox" class="std-field" value="Photo"> Passport Photo</label>
                    <label><input type="checkbox" class="std-field" value="10th_12th"> 10th & 12th Marks</label>
                </div>

                <div class="schema-section mt-3">
                    <h4>Custom Fields (Student must fill these manually)</h4>
                    <div id="customFieldsContainer">
                        <!-- Custom fields added here -->
                    </div>
                    <button type="button" class="btn btn-outline" onclick="addCustomField()">+ Add Custom Question</button>
                </div>

                <button type="submit" class="btn btn-primary mt-4">Publish Drive</button>
            </form>
        </div>
    `;

    document.getElementById('driveBuilderForm').addEventListener('submit', handleDriveSubmit);
}

function addCustomField() {
    const container = document.getElementById('customFieldsContainer');
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control custom-field-input mt-2';
    input.placeholder = 'e.g., "Current Backlog Count" or "Portfolio Link"';
    container.appendChild(input);
}

async function handleDriveSubmit(e) {
    e.preventDefault();
    
    // Gather standard fields
    const stdFields = Array.from(document.querySelectorAll('.std-field:checked')).map(cb => cb.value);
    
    // Gather custom fields
    const customFields = Array.from(document.querySelectorAll('.custom-field-input'))
                              .map(input => input.value)
                              .filter(val => val.trim() !== ""); // Remove empty inputs

    const payload = {
        company_name: document.getElementById('compName').value,
        designation: document.getElementById('designation').value,
        package: document.getElementById('package').value,
        // ... gather other standard inputs like branch, date ...
        standard_fields: stdFields,
        custom_fields: customFields
    };

    const response = await fetchFromAPI('createDrive', payload);
    
    if(response && response.success) {
        alert("Drive Published! Drive ID: " + response.drive_id);
        // Refresh view
    }
}
