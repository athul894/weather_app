const API_KEY = "eff898170188a8680e0a7356a134b244";

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!currentRes.ok) throw new Error("City not found");

        const currentData = await currentRes.json();

        document.getElementById("cityName").textContent = currentData.name;
        document.getElementById("temperature").textContent =
            `${Math.round(currentData.main.temp)}°C`;
        document.getElementById("description").textContent =
            currentData.weather[0].description;

        document.querySelector(".current-weather .icon").innerHTML =
            `<img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png">`;

        changeBackground(currentData.weather[0].main.toLowerCase());

        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastRes.json();

        updateForecast(forecastData);

        localStorage.setItem("lastCity", city);

    } catch (error) {
        alert(error.message);
    }
}

function updateForecast(data) {
    const days = document.querySelectorAll(".day");

    days.forEach((day, index) => {
        const forecast = data.list[index * 8];
        if (!forecast) return;

        const weekday = new Date(forecast.dt_txt)
            .toLocaleDateString("en-US", { weekday: "short" });

        day.querySelector(".weekday").textContent = weekday;
        day.querySelector(".icon").innerHTML =
            `<img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png">`;
        day.querySelector(".temp").textContent =
            `${Math.round(forecast.main.temp)}°C`;
    });
}

function changeBackground(condition) {
    document.body.className = condition;
}

searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") getWeather();
});

// Load last searched city
const savedCity = localStorage.getItem("lastCity");
if (savedCity) {
    cityInput.value = savedCity;
    getWeather();
}
