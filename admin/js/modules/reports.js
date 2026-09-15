// admin/js/modules/reports.js

async function renderAnalyticsDashboard() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header mb-4" style="display: flex; justify-content: space-between;">
            <h2>KPI Dashboard</h2>
            <button class="btn btn-primary"><i class="fas fa-file-excel"></i> Export NAAC Data</button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
            <div class="form-card text-center">
                <h4 style="color: #64748b; font-size: 0.9rem;">Placement Rate</h4>
                <h2 style="color: #4f46e5; margin-top: 10px; font-size: 2rem;">78%</h2>
            </div>
            <div class="form-card text-center">
                <h4 style="color: #64748b; font-size: 0.9rem;">Highest Package</h4>
                <h2 style="color: #10b981; margin-top: 10px; font-size: 2rem;">18 LPA</h2>
            </div>
            <div class="form-card text-center">
                <h4 style="color: #64748b; font-size: 0.9rem;">Total Offers</h4>
                <h2 style="color: #f59e0b; margin-top: 10px; font-size: 2rem;">342</h2>
            </div>
            <div class="form-card text-center">
                <h4 style="color: #64748b; font-size: 0.9rem;">Recruiters</h4>
                <h2 style="color: #3b82f6; margin-top: 10px; font-size: 2rem;">87</h2>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div class="form-card">
                <h3 style="margin-bottom: 20px; text-align: center;">Branch Placement Ratio</h3>
                <canvas id="branchChart"></canvas>
            </div>
            <div class="form-card">
                <h3 style="margin-bottom: 20px; text-align: center;">Package Distribution</h3>
                <canvas id="packageChart"></canvas>
            </div>
        </div>
    `;

    // Ensure Chart.js is loaded in admin/index.html before running this
    if (typeof Chart !== 'undefined') {
        renderCharts();
    } else {
        alert("Please include Chart.js library in your index.html");
    }
}

function renderCharts() {
    new Chart(document.getElementById('branchChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['COMP', 'IT', 'AIML', 'DS'],
            datasets: [{ data: [120, 85, 45, 30], backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'] }]
        }
    });

    new Chart(document.getElementById('packageChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['3L', '5L', '8L', '12L+'],
            datasets: [{ label: 'Students Placed', data: [40, 150, 75, 15], backgroundColor: '#4f46e5' }]
        }
    });
}
