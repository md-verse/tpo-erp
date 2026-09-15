// Inside student/js/modules/profile.js

let currentOTP = null; // Store temporarily during edit session

async function loadProfileEditor() {
    const grNo = localStorage.getItem('activeStudentGR');
    const contentArea = document.getElementById('drivesContainer'); // Reusing main container

    contentArea.innerHTML = `
        <div class="form-card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Edit Profile Information</h3>
                <button class="btn btn-outline" onclick="requestProfileEditOTP()" id="otpBtn">
                    <i class="fas fa-lock"></i> Request Edit Access
                </button>
            </div>
            
            <!-- Read-only form until OTP is verified -->
            <form id="studentEditForm" class="mt-4" style="opacity: 0.6; pointer-events: none;">
                <div class="form-group mb-3">
                    <label>Personal Email</label>
                    <input type="email" id="editEmail" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                    <label>Mobile Number</label>
                    <input type="text" id="editMobile" class="form-control" required>
                </div>
                <div class="form-group mb-3">
                    <label>Updated CV (Drive URL)</label>
                    <input type="url" id="editCV" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary w-100">Save Changes</button>
            </form>
        </div>
    `;
    
    // Fetch current data to pre-fill the form
    const response = await fetchFromAPI('getStudent360', { gr_no: grNo });
    if(response && response.personal) {
        document.getElementById('editEmail').value = response.personal['PERSONAL EMAIL'];
        document.getElementById('editMobile').value = response.personal['MOBILE NO.'];
        document.getElementById('editCV').value = response.personal['UPLOAD UPDATED CV (URL)'];
    }
}

async function requestProfileEditOTP() {
    const grNo = localStorage.getItem('activeStudentGR');
    document.getElementById('otpBtn').innerText = "Sending...";
    
    const response = await fetchFromAPI('generateOTP', { gr_no: grNo });
    
    if(response && response.success) {
        const userOTP = prompt("An OTP has been sent to your college email. Please enter it below to unlock the form:");
        
        // In production, the backend handles verification. For frontend architecture:
        if(userOTP) {
            const verifyRes = await fetchFromAPI('verifyOTP', { gr_no: grNo, otp: userOTP });
            if(verifyRes && verifyRes.success) {
                // Unlock the form
                const form = document.getElementById('studentEditForm');
                form.style.opacity = "1";
                form.style.pointerEvents = "auto";
                document.getElementById('otpBtn').innerText = "Access Granted";
                document.getElementById('otpBtn').classList.replace('btn-outline', 'btn-success');
                
                // Attach save handler
                form.addEventListener('submit', saveProfileChanges);
            } else {
                alert("Invalid OTP.");
                document.getElementById('otpBtn').innerText = "Request Edit Access";
            }
        }
    }
}

async function saveProfileChanges(e) {
    e.preventDefault();
    const grNo = localStorage.getItem('activeStudentGR');
    
    const payload = {
        gr_no: grNo,
        updates: {
            'PERSONAL EMAIL': document.getElementById('editEmail').value,
            'MOBILE NO.': document.getElementById('editMobile').value,
            'UPLOAD UPDATED CV (URL)': document.getElementById('editCV').value
        }
    };

    const response = await fetchFromAPI('updateStudentProfile', payload);
    if(response && response.success) alert("Profile updated successfully!");
}
