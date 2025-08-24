const LUNAR_CYCLE = 29.530588853;

function getMoonPhase(date = new Date()) {
    const phases = [
        { name: "New Moon", icon: "🌑" },
        { name: "Waxing Crescent", icon: "🌒" },
        { name: "First Quarter", icon: "🌓" },
        { name: "Waxing Gibbous", icon: "🌔" },
        { name: "Full Moon", icon: "🌕" },
        { name: "Waning Gibbous", icon: "🌖" },
        { name: "Third Quarter", icon: "🌗" },
        { name: "Waning Crescent", icon: "🌘" }
    ];

    const knownNewMoon = new Date("2023-01-21T19:53:00Z");
    const secondsInDay = 24 * 60 * 60;

    const diffInSeconds = (date.getTime() - knownNewMoon.getTime()) / 1000;
    const diffInDays = diffInSeconds / secondsInDay;

    const lunarAge = diffInDays % LUNAR_CYCLE;
    const phaseIndex = Math.floor((lunarAge / LUNAR_CYCLE) * 8 + 0.5) % 8;

    const illumination = Math.round((1 - Math.cos((2 * Math.PI * lunarAge) / LUNAR_CYCLE)) / 2 * 100);

    return {
        ...phases[phaseIndex],
        illumination,
        age: lunarAge.toFixed(1)
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const todayPhaseContainer = document.getElementById("today-moon-phase");
    const forecastContainer = document.getElementById("forecast-container");

    const tabToday = document.getElementById("tab-today");
    const tabForecast = document.getElementById("tab-forecast");
    const todaySection = document.getElementById("today-section");
    const forecastSection = document.getElementById("forecast-section");

    function displayPhase(date, container) {
        const phase = getMoonPhase(date);
        const dateString = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

        container.innerHTML = `
            <div class="phase-icon">${phase.icon}</div>
            <div class="phase-name">${phase.name}</div>
            <div class="phase-date">${dateString}</div>
            <div class="phase-extra">Illumination: ${phase.illumination}%</div>
            <div class="phase-extra">Age: ${phase.age} days</div>
        `;
    }

    const today = new Date();
    displayPhase(today, todayPhaseContainer);

    function loadForecast() {
        forecastContainer.innerHTML = "";
        for (let i = 1; i <= 7; i++) {
            const forecastDate = new Date();
            forecastDate.setDate(today.getDate() + i);

            const card = document.createElement("div");
            card.className = "phase-card";

            displayPhase(forecastDate, card);
            forecastContainer.appendChild(card);
        }
    }

    // Tab switching
    tabToday.addEventListener("click", () => {
        tabToday.classList.add("active");
        tabForecast.classList.remove("active");
        todaySection.classList.remove("hidden");
        forecastSection.classList.add("hidden");
    });

    tabForecast.addEventListener("click", () => {
        tabForecast.classList.add("active");
        tabToday.classList.remove("active");
        forecastSection.classList.remove("hidden");
        todaySection.classList.add("hidden");
        loadForecast();
    });
});
