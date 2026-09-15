// admin/js/modules/training.js

let qrRotationInterval;

function renderAttendanceConsole() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header mb-4">
            <h2>Live Training Attendance</h2>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 500px;">
            <div class="form-card text-center" style="display: flex; flex-direction: column; align-items: center;">
                <h3 style="margin-bottom: 10px;">Dynamic QR Scanner</h3>
                <p class="text-muted" style="margin-bottom: 20px;">Code refreshes automatically every 30 seconds to prevent proxy attendance.</p>
                
                <div id="qrContainer" style="padding: 20px; border: 2px dashed #cbd5e1; background: #f8fafc; border-radius: 12px; width: 240px; height: 240px; display: flex; align-items: center; justify-content: center;">
                    <span class="text-muted">Click Start to generate</span>
                </div>
                
                <h2 id="qrTimer" style="color: #ef4444; margin-top: 20px;">0s</h2>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="startQRRotation('BATCH_01', 1, 'Morning Session')">Start Session</button>
                    <button class="btn btn-outline" onclick="stopQRRotation()">Stop</button>
                </div>
            </div>
        </div>
    `;
}

function startQRRotation(batch, session, sessionName) {
    if (qrRotationInterval) clearInterval(qrRotationInterval);
    
    generateAndRenderQR(batch, session, sessionName);
    let timeLeft = 30;
    document.getElementById('qrTimer').innerText = timeLeft + "s";

    qrRotationInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('qrTimer').innerText = timeLeft + "s";
        
        if (timeLeft <= 0) {
            generateAndRenderQR(batch, session, sessionName);
            timeLeft = 30;
        }
    }, 1000);
}

function stopQRRotation() {
    clearInterval(qrRotationInterval);
    document.getElementById('qrContainer').innerHTML = `<span class="text-muted">Session Stopped</span>`;
    document.getElementById('qrTimer').innerText = "0s";
}

function generateAndRenderQR(batch, session, sessionName) {
    const today = new Date().toISOString().split('T')[0];
    const secureToken = "TOK-" + new Date().getTime();
    
    const qrPayload = { batch, session, session_name: sessionName, date: today, token: secureToken };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrPayload))}`;
    
    document.getElementById('qrContainer').innerHTML = `<img src="${qrUrl}" alt="Live QR" style="width: 200px; height: 200px; border-radius: 8px;">`;
}
