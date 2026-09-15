document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));

            // Add active class to clicked tab and corresponding form
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    // 2. Client-Side Hashing Utility
    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 3. Student Login Handler
    document.getElementById('studentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const grNo = document.getElementById('stuGr').value;
        const passkey = await hashString(document.getElementById('stuPass').value);

        const response = await fetchFromAPI('studentLogin', { gr_no: grNo, passkey_hash: passkey });

        if (response && response.success) {
            localStorage.setItem('activeStudentGR', grNo);
            localStorage.setItem('studentName', response.name);
            window.location.href = 'student/index.html'; // Route to Student Workspace
        } else {
            alert("Invalid GR Number or Passkey.");
        }
    });

    // 4. Employer Login Handler
    document.getElementById('employerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const driveId = document.getElementById('empDrive').value;
        const secret = document.getElementById('empSecret').value; // Usually verified without hash in ATS

        const response = await fetchFromAPI('employerLogin', { drive_id: driveId, secret: secret });

        if (response && response.success) {
            localStorage.setItem('activeDriveId', driveId);
            window.location.href = 'employer/index.html'; // Route to Employer Workspace
        } else {
            alert("Invalid Drive ID or Company Secret.");
        }
    });

    // 5. Admin Login Handler
    document.getElementById('adminForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const adminId = document.getElementById('adminId').value;
        const adminPass = await hashString(document.getElementById('adminPass').value);

        const response = await fetchFromAPI('adminLogin', { admin_id: adminId, password_hash: adminPass });

        if (response && response.success) {
            localStorage.setItem('activeAdminId', adminId);
            window.location.href = 'admin/index.html'; // Route to Admin Workspace
        } else {
            alert("Invalid Staff Credentials.");
        }
    });
});

// Universal Logout Function (Can be called from any portal)
function logout() {
    localStorage.clear();
    window.location.href = '../index.html'; // Send back to the universal login root
}
