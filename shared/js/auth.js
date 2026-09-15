document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    async function hashString(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    document.getElementById('studentForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const grNo = document.getElementById('stuGr').value;
        const passkey = await hashString(document.getElementById('stuPass').value);

        const response = await fetchFromAPI('studentLogin', { gr_no: grNo, passkey_hash: passkey });
        if (response && response.success) {
            localStorage.setItem('activeStudentGR', grNo);
            localStorage.setItem('studentName', response.name);
            window.location.href = 'student/index.html'; 
        } else {
            alert("Invalid GR Number or Passkey.");
        }
    });

    document.getElementById('employerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const driveId = document.getElementById('empDrive').value;
        const secret = document.getElementById('empSecret').value;

        const response = await fetchFromAPI('employerLogin', { drive_id: driveId, secret: secret });
        if (response && response.success) {
            localStorage.setItem('activeDriveId', driveId);
            window.location.href = 'employer/index.html'; 
        } else {
            alert("Invalid Drive ID or Company Secret.");
        }
    });

    document.getElementById('adminForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const adminId = document.getElementById('adminId').value;
        const adminPass = await hashString(document.getElementById('adminPass').value);

        const response = await fetchFromAPI('adminLogin', { admin_id: adminId, password_hash: adminPass });
        if (response && response.success) {
            localStorage.setItem('activeAdminId', adminId);
            window.location.href = 'admin/index.html'; 
        } else {
            alert("Invalid Staff Credentials.");
        }
    });
});

function logout() {
    localStorage.clear();
    window.location.href = '../index.html'; // Adjust based on current directory
}
