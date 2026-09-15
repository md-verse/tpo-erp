// admin/js/modules/settings.js

async function renderSystemSettings() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header mb-4" style="display: flex; justify-content: space-between;">
            <h2>System Configurations</h2>
            <button class="btn btn-primary" onclick="saveSettings()">Save Changes</button>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-card">
                <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;"><i class="fas fa-university"></i> Academic State</h3>
                <div class="form-group mb-3">
                    <label>Active Academic Year</label>
                    <select id="setAcadYear" class="form-control">
                        <option value="2026-2027">2026-2027</option>
                        <option value="2027-2028">2027-2028</option>
                    </select>
                </div>
            </div>

            <div class="form-card">
                <h3 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 20px;"><i class="fas fa-lock"></i> Portal Access</h3>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #e5e7eb;">
                    <label style="font-weight: 500;">Student Portal Access</label>
                    <input type="checkbox" id="setStudentReg" style="width: 20px; height: 20px;" checked>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dashed #e5e7eb;">
                    <label style="font-weight: 500;">Employer ATS Enabled</label>
                    <input type="checkbox" id="setEmployerPortal" style="width: 20px; height: 20px;" checked>
                </div>
            </div>
        </div>
    `;
}

async function saveSettings() {
    const payload = {
        settings: {
            ACTIVE_ACADEMIC_YEAR: document.getElementById('setAcadYear').value,
            STUDENT_REG_OPEN: document.getElementById('setStudentReg').checked ? 'TRUE' : 'FALSE',
            EMPLOYER_PORTAL_ACTIVE: document.getElementById('setEmployerPortal').checked ? 'TRUE' : 'FALSE'
        }
    };
    
    // Calls the handleAdminActions in Router.gs
    const response = await fetchFromAPI('updateSystemSettings', payload);
    if (response && response.success) alert("System Settings Updated.");
}
