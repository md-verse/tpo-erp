// Load this when "System Settings" is clicked in the sidebar

async function renderSystemSettings() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>System Settings</h2>
            <button class="btn btn-primary" onclick="saveSettings()">Save Changes</button>
        </div>
        
        <div class="settings-grid">
            <!-- Academic Settings -->
            <div class="settings-card">
                <h3><i class="fas fa-university"></i> Academic Configuration</h3>
                <div class="form-group mt-3">
                    <label>Active Academic Year</label>
                    <select id="setAcadYear" class="form-control">
                        <option value="2026-2027">2026-2027</option>
                        <option value="2027-2028">2027-2028</option>
                    </select>
                </div>
                <div class="form-group mt-3">
                    <label>Current Eligible Batch</label>
                    <input type="text" id="setEligibleBatch" class="form-control">
                </div>
            </div>

            <!-- Portal Access Controls -->
            <div class="settings-card">
                <h3><i class="fas fa-lock"></i> Portal Access Controls</h3>
                
                <div class="toggle-group mt-3">
                    <label>Student Registration Open</label>
                    <label class="switch">
                        <input type="checkbox" id="setStudentReg">
                        <span class="slider round"></span>
                    </label>
                </div>
                
                <div class="toggle-group mt-3">
                    <label>Employer Portal Active</label>
                    <label class="switch">
                        <input type="checkbox" id="setEmployerPortal">
                        <span class="slider round"></span>
                    </label>
                </div>

                <div class="toggle-group mt-3">
                    <label>QR Attendance System</label>
                    <label class="switch">
                        <input type="checkbox" id="setQRAttendance">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        </div>
    `;

    // Fetch and populate current settings
    loadCurrentSettings();
}

async function loadCurrentSettings() {
    const response = await fetchFromAPI('getSystemSettings');
    if (response && response.success) {
        const s = response.settings;
        document.getElementById('setAcadYear').value = s.ACTIVE_ACADEMIC_YEAR || '2026-2027';
        document.getElementById('setEligibleBatch').value = s.CURRENT_ELIGIBLE_BATCH || '2027';
        document.getElementById('setStudentReg').checked = (s.STUDENT_REG_OPEN === 'TRUE');
        document.getElementById('setEmployerPortal').checked = (s.EMPLOYER_PORTAL_ACTIVE === 'TRUE');
        document.getElementById('setQRAttendance').checked = (s.QR_ATTENDANCE_ENABLED === 'TRUE');
    }
}

async function saveSettings() {
    const updatedSettings = {
        ACTIVE_ACADEMIC_YEAR: document.getElementById('setAcadYear').value,
        CURRENT_ELIGIBLE_BATCH: document.getElementById('setEligibleBatch').value,
        STUDENT_REG_OPEN: document.getElementById('setStudentReg').checked ? 'TRUE' : 'FALSE',
        EMPLOYER_PORTAL_ACTIVE: document.getElementById('setEmployerPortal').checked ? 'TRUE' : 'FALSE',
        QR_ATTENDANCE_ENABLED: document.getElementById('setQRAttendance').checked ? 'TRUE' : 'FALSE'
    };

    const response = await fetchFromAPI('updateSystemSettings', {
        admin_id: "ADMIN_01", // In production, pull from active session
        settings: updatedSettings
    });

    if (response && response.success) alert(response.message);
}
