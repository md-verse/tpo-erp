const API_URL = "https://script.google.com/macros/s/AKfycby3Q6XAoyPI0H0XVNDsimbwAxw_cSVTblR2TyTmyspk6P7cTFesfrnoEXJy8B4ZdKAt/exec";

async function fetchFromAPI(action, payload = {}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            // CRITICAL: Must be text/plain to bypass CORS preflight and multi-account redirects
            headers: {
                "Content-Type": "text/plain;charset=utf-8", 
            },
            body: JSON.stringify({
                action: action,
                payload: payload
            })
        });

        const result = await response.json();
        
        if (result.status === "error") {
            console.error("Backend Error:", result.data);
            alert("Error: " + result.data);
            return null;
        }
        
        return result.data;

    } catch (error) {
        console.error("Network Error:", error);
        alert("Failed to connect to the server.");
        return null;
    }
}

// Test the connection
// fetchFromAPI('ping').then(data => console.log(data));
