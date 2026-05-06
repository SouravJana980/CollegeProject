// 🌐 GENERIC: WeatherAPI

// State to store the latest data so we can access it synchronously
window.weatherData = null;

export async function fetchWeather() {
    try {
        const res = await fetch("http://api.weatherapi.com/v1/current.json?key=1611c318f11c4d9299b00217262604&q=Kolkata&aqi=yes");
        const data = await res.json();

        const temp  = data.current.temp_c;
        const hum   = data.current.humidity;
        const pm25  = parseFloat(data.current.air_quality.pm2_5).toFixed(1);
        const aqi   = data.current.air_quality["us-epa-index"];
        const co    = parseFloat(data.current.air_quality.co).toFixed(1);

        window.weatherData = {
            temp, hum, pm25, aqi, co
        };

        // Notify anyone listening
        window.dispatchEvent(new CustomEvent('weather-updated', { detail: window.weatherData }));

        return window.weatherData;
    } catch (err) {
        console.error("WeatherAPI Error:", err);
    }
}

// ⏱️ Auto-refresh every 10s
fetchWeather();
setInterval(fetchWeather, 10000);
