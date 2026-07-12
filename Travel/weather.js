// Shared live-forecast loader for Travel/days/*.html pages.
// Usage: loadDayWeather({ elementId, lat, lon, date: "YYYY-MM-DD", timezone, locationLabel })
// Data source: Open-Meteo (no API key, ~16 day forecast horizon).

const WMO_WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 57: "Dense freezing drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    66: "Light freezing rain", 67: "Heavy freezing rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
};

async function loadDayWeather(opts) {
    const { elementId, lat, lon, date, timezone, locationLabel } = opts;
    const el = document.getElementById(elementId);
    if (!el) return;

    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: timezone || 'UTC' });
    const daysOut = Math.round((new Date(date) - new Date(todayStr)) / 86400000);

    if (daysOut < 0) {
        el.innerHTML = `<em>This date has passed.</em>`;
        return;
    }
    if (daysOut > 16) {
        el.innerHTML = `<em>Live forecast isn't available yet — Open-Meteo only forecasts about 16 days out. Check back closer to ${date}.</em>`;
        return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max` +
        `&timezone=${encodeURIComponent(timezone)}&start_date=${date}&end_date=${date}`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
        const data = await res.json();

        const code = data.daily.weathercode[0];
        const hiC = Math.round(data.daily.temperature_2m_max[0]);
        const loC = Math.round(data.daily.temperature_2m_min[0]);
        const hiF = Math.round(hiC * 9 / 5 + 32);
        const loF = Math.round(loC * 9 / 5 + 32);
        const precip = data.daily.precipitation_sum[0];
        const wind = Math.round(data.daily.windspeed_10m_max[0]);
        const desc = WMO_WEATHER_CODES[code] || "Forecast unavailable";
        const fetchedAt = new Date().toLocaleString();

        el.innerHTML = `
            ${date}${locationLabel ? ` (${locationLabel})` : ''} — ${desc}.
            High ${hiC}°C (${hiF}°F), low ${loC}°C (${loF}°F), ${precip}mm precipitation, wind up to ${wind} km/h.
            <br><span style="opacity:0.6; font-size:0.85em;">Live forecast via Open-Meteo — fetched ${fetchedAt}.</span>
        `;
    } catch (err) {
        el.innerHTML = `<em>Couldn't load the live forecast right now (${err.message}). Try refreshing the page.</em>`;
    }
}
