const apikey = "40a60daad1131fd25f9bfe38720bc4dc";

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;

            fetch(url).then((res) => res.json())
                .then((data) => {
                    weatherReport(data);
                }).catch((err) => console.error("Error fetching data: ", err));
        });
    }
});

function searchByCity() {
    var place = document.getElementById('input').value;
    var urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&units=metric&appid=${apikey}`;

    fetch(urlsearch).then((res) => res.json())
        .then((data) => {
            weatherReport(data);
        }).catch((err) => console.error("Error fetching data: ", err));
    document.getElementById('input').value = '';
}

function weatherReport(data) {
    var urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&units=metric&appid=${apikey}`;

    fetch(urlcast).then((res) => res.json())
        .then((forecast) => {
            document.getElementById('city').innerText = `${data.name}, ${data.sys.country}`;
            document.querySelector('.date').innerText = new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            document.getElementById('temperature').innerText = `${Math.floor(data.main.temp)} °C`;
            document.getElementById('wind').innerText = `${(data.wind.speed * 3.6).toFixed(2)} km/hr`;
            document.getElementById('clouds').innerText = data.weather[0].description;

            let icon1 = data.weather[0].icon;
            let iconurl = `http://openweathermap.org/img/wn/${icon1}@2x.png`;
            document.getElementById('img').src = iconurl;

            hourForecast(forecast);
            dayForecast(forecast);
        }).catch((err) => console.error("Error fetching forecast data: ", err));
}

function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);
        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '');

        let temp = document.createElement('p');
        temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C`;

        div.appendChild(time);
        div.appendChild(temp);

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = '';

    for (let i = 10; i < forecast.list.length; i += 8) { // Adjusted to daily intervals
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);

        let temp = document.createElement('p');
        temp.innerText = `${Math.floor(forecast.list[i].main.temp_max)} °C`;
        div.appendChild(temp);

        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    }
}
