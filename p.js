let map;
let chart;
let currentCity = 'New York';
let darkMode = false;
let refreshInterval = 10; // minutes
let unit = 'µg/m³';

// Initialize map
function initMap(lat, lng) {
    if (map) map.remove();
    map = L.map('map').setView([lat, lng], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Fetch air quality data
async function fetchAirQuality(city, pollutant = 'all', dateFrom = null, dateTo = null) {
    let url = `https://api.openaq.org/v2/latest?city=${encodeURIComponent(city)}&limit=1`;
    if (pollutant !== 'all') url += `&parameter=${pollutant}`;
    if (dateFrom && dateTo) url = url.replace('latest', `measurements?date_from=${dateFrom}&date_to=${dateTo}&limit=100`);
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            displayData(data.results[0]);
            fetchTrends(city, pollutant, dateFrom, dateTo);
        } else {
            throw new Error('No data available');
        }
    } catch (error) {
        document.getElementById('air-quality-data').innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Display data
function displayData(result) {
    const location = result.city;
    let measurements = result.measurements;
    document.getElementById('location-name').textContent = `Air Quality in ${location}`;
    
    // Filter by selected pollutant
    const selectedPollutant = document.getElementById('pollutant-select').value;
    if (selectedPollutant !== 'all') {
        measurements = measurements.filter(m => m.parameter === selectedPollutant);
    }
    
    // Calculate AQI (simplified based on PM2.5)
    const pm25 = measurements.find(m => m.parameter === 'pm25')?.value || 0;
    let aqi = Math.min(500, Math.round(pm25 * 5));
    let aqiClass = 'good';
    let advice = 'Air quality is good. Enjoy outdoor activities!';
    if (aqi > 100) { aqiClass = 'moderate'; advice = 'Moderate air quality. Sensitive individuals should limit prolonged exposure.'; }
    if (aqi > 200) { aqiClass = 'unhealthy'; advice = 'Unhealthy air quality. Avoid outdoor activities if possible.'; }
    
    const aqiDisplay = document.getElementById('aqi-display');
    aqiDisplay.textContent = aqi;
    aqiDisplay.className = aqiClass;
    document.getElementById('health-advice').textContent = advice;
    document.getElementById('aqi-summary').classList.remove('hidden');
    
    // Display pollutants
    let html = '';
    measurements.forEach(m => {
        html += `<div class="pollutant">
            <i class="fas fa-cloud"></i>
            <strong>${m.parameter.toUpperCase()}</strong><br>
            ${m.value} ${unit}<br>
