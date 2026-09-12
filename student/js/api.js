const API_URL = "YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL";

async function fetchFromAPI(action, payload = {}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: action, payload: payload })
        });
        
        const result = await response.json();
        if (result.status === "error") {
            alert("Error: " + result.data);
            return null;
        }
        return result.data;
    } catch (error) {
        console.error("Network Error:", error);
        return null;
    }
}
