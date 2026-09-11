// Load this when "Attendance" under Training is clicked

let qrRotationInterval;

function renderAttendanceConsole(batchId, sessionNo, sessionName) {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>Attendance Management: ${batchId} (Session ${sessionNo})</h2>
        </div>
        
        <div class="attendance-dashboard">
            <!-- Dynamic QR Section -->
            <div class="qr-card">
                <h3>Live QR Scan</h3>
                <p class="text-muted">Code refreshes automatically every 30 seconds.</p>
                <div id="qrContainer" class="qr-box">
                    <!-- QR Code renders here -->
                </div>
                <h4 id="qrTimer" class="mt-3 text-danger">30s</h4>
                <button class="btn btn-primary mt-3" onclick="startQRRotation('${batchId}', ${sessionNo}, '${sessionName}')">
                    Start Scanning Session
                </button>
                <button class="btn btn-outline mt-3" onclick="stopQRRotation()">Stop</button>
            </div>

            <!-- Manual Attendance Section (Checkbox Sheet) -->
            <div class="manual-card">
                <h3>Manual Override</h3>
                <table class="tpo-table mt-3">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="selectAll" onclick="toggleAll(this)"></th>
                            <th>Training ID</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="manualAttendanceList">
                        <!-- Student list loads here -->
                    </tbody>
                </table>
                <button class="btn btn-success mt-3" onclick="submitManualAttendance()">Save Manual Attendance</button>
            </div>
        </div>
    `;
}

// --- Dynamic QR Logic ---

function startQRRotation(batch, session, sessionName) {
    generateAndRenderQR(batch, session, sessionName);
    
    let timeLeft = 30;
    document.getElementById('qrTimer').innerText = timeLeft + "s";

    qrRotationInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('qrTimer').innerText = timeLeft + "s";
        
        if (timeLeft <= 0) {
            generateAndRenderQR(batch, session, sessionName);
            timeLeft = 30; // Reset timer
        }
    }, 1000);
}

function stopQRRotation() {
    clearInterval(qrRotationInterval);
    document.getElementById('qrContainer').innerHTML = "<p>Session Stopped</p>";
    document.getElementById('qrTimer').innerText = "0s";
}

function generateAndRenderQR(batch, session, sessionName) {
    const today = new Date().toISOString().split('T')[0];
    const secureToken = "TOK-" + new Date().getTime(); // Timestamp embedded token
    
    const qrPayload = {
        batch: batch,
        session: session,
        session_name: sessionName,
        date: today,
        token: secureToken
    };

    // In a real implementation, you would use a library like QRCode.js here
    document.getElementById('qrContainer').innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrPayload))}" alt="Live QR">
    `;
}

// --- Manual Checkbox Logic ---

function toggleAll(source) {
    const checkboxes = document.querySelectorAll('.attendance-checkbox');
    checkboxes.forEach(cb => cb.checked = source.checked);
}
