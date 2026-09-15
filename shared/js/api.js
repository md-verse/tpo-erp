// shared/js/api.js

// ⚠️ Update this with your actual Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycby3Q6XAoyPI0H0XVNDsimbwAxw_cSVTblR2TyTmyspk6P7cTFesfrnoEXJy8B4ZdKAt/exec";

/**
 * Universal fetch wrapper for Apps Script.
 * Uses text/plain to bypass Google's multi-account CORS preflight errors.
 */
async function fetchFromAPI(action, payload = {}) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "text/plain;charset=utf-8" 
            },
            body: JSON.stringify({
                action: action,
                payload: payload
            })
        });

        const result = await response.json();
        
        if (result.status === "error") {
            console.error(`Backend Error [${action}]:`, result.data);
            alert("System Error: " + result.data);
            return null;
        }
        
        return result.data;

    } catch (error) {
        console.error("Network Error:", error);
        alert("Failed to connect to the server. Please check your internet connection.");
        return null;
    }
}
