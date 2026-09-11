// Load this when "Placement Analytics" is clicked in the sidebar

async function renderAnalyticsDashboard() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="module-header">
            <h2>Executive KPI Dashboard</h2>
            <button class="btn btn-outline" onclick="exportNAACReport()">
                <i class="fas fa-file-excel"></i> Export NAAC Report
            </button>
        </div>
        
        <!-- KPI Metrics Cards -->
        <div class="kpi-grid">
            <div class="kpi-card">
                <h4>Placement Rate</h4>
                <h2 id="kpiRate" class="text-primary">--%</h2>
            </div>
            <div class="kpi-card">
                <h4>Highest Package</h4>
                <h2 id="kpiHighest" class="text-success">-- LPA</h2>
            </div>
            <div class="kpi-card">
                <h4>Total Offers</h4>
                <h2 id="kpiOffers" class="text-info">--</h2>
            </div>
            <div class="kpi-card">
                <h4>Recruiters</h4>
                <h2 id="kpiRecruiters" class="text-warning">--</h2>
            </div>
        </div>

        <!-- Charts Container -->
        <div class="charts-grid mt-4">
            <div class="chart-card">
                <h3>Branch Placement Ratio</h3>
                <canvas id="branchChart"></canvas>
            </div>
            <div class="chart-card">
                <h3>Package Distribution</h3>
                <canvas id="packageChart"></canvas>
            </div>
        </div>
    `;

    loadChartData();
}

async function loadChartData() {
    const response = await fetchFromAPI('getKPIDashboard', { 
        academic_year: window.globalAcademicYear 
    });

    if (response && response.success) {
        // 1. Populate KPI Cards
        document.getElementById('kpiRate').innerText = response.metrics.placementRate;
        document.getElementById('kpiHighest').innerText = response.metrics.highestPackage;
        document.getElementById('kpiOffers').innerText = response.metrics.totalOffers;
        document.getElementById('kpiRecruiters').innerText = response.metrics.activeRecruiters;

        // 2. Render Branch Doughnut Chart[cite: 1]
        const branchCtx = document.getElementById('branchChart').getContext('2d');
        new Chart(branchCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(response.charts.branchRatio),
                datasets: [{
                    data: Object.values(response.charts.branchRatio),
                    backgroundColor: ['#0d6efd', '#20c997', '#ffc107', '#6f42c1']
                }]
            }
        });

        // 3. Render Package Bar Chart[cite: 1]
        const pkgCtx = document.getElementById('packageChart').getContext('2d');
        new Chart(pkgCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(response.charts.packageDist),
                datasets: [{
                    label: 'Students Placed',
                    data: Object.values(response.charts.packageDist),
                    backgroundColor: '#6f42c1'
                }]
            }
        });
    }
}

function exportNAACReport() {
    alert("Triggering backend to generate and download NAAC compliant Excel sheet...");
    // Future API call to 'exportNAACData'
}
