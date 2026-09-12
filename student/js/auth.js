document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const grNo = document.getElementById('grNo').value;
    const passkey = document.getElementById('passkey').value;
    
    // Hash the passkey on the client side
    const encoder = new TextEncoder();
    const data = encoder.encode(passkey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPasskey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const response = await fetchFromAPI('studentLogin', { 
        gr_no: grNo, 
        passkey_hash: hashedPasskey 
    });

    if (response && response.success) {
        localStorage.setItem('activeStudentGR', grNo);
        localStorage.setItem('studentName', response.name);
        
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').style.display = 'block';
        initDashboard();
    }
});

function logout() {
    localStorage.removeItem('activeStudentGR');
    localStorage.removeItem('studentName');
    location.reload();
}
