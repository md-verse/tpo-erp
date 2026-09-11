async function changeApplicationStatus(appId, grNo, studentName, companyName, newStatus) {
    // Show a loading indicator
    document.getElementById(`status-btn-${appId}`).innerText = "Updating...";

    const payload = {
        application_id: appId,
        gr_no: grNo,
        student_name: studentName,
        company_name: companyName,
        new_status: newStatus
        // package: "8.5" (if applicable)
    };

    const response = await fetchFromAPI('updateApplicantStatus', payload);

    if (response && response.success) {
        // Instantly update the UI without reloading
        document.getElementById(`status-badge-${appId}`).innerText = newStatus;
        document.getElementById(`status-badge-${appId}`).className = `badge badge-${newStatus.toLowerCase()}`;
        alert(response.message); // Confirms email was sent
    } else {
        alert("Failed to update status.");
    }
    
    // Reset button text
    document.getElementById(`status-btn-${appId}`).innerText = "Change Status";
}
