const API = '5c64120c04acac7227bf19b495bedf84';

const search = document.querySelector('.search-box');
const search_input = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

const weather = document.querySelector('.weather-info');
const weatherIcon = document.getElementById('weather-icon');
const cityName = document.getElementById('city-name')
const temp = document.getElementById('temperature')
const hum = document.getElementById('humidity')
const condition = document.getElementById('weather-condition')
const err = document.getElementById('error')


search.addEventListener('submit', async event => {
    event.preventDefault()

    const city = search_input.value

    if(city){
        search_input.value = '';
        try{
            weatherIcon.textContent = "⏳ Loading..."
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData, city);
        }
        catch(error){
            console.error(error);
            displayError(error)
        }
    }else{
        displayError('Please Enter a City first!')
    }
})


async function getWeatherData(city) {
    const latlondata = await getlatlon(city)

    if (!latlondata || latlondata.length === 0) {
        throw new Error(`Could not find the city: ${city}`);
    }

    let {lat,lon} = latlondata[0]
    
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,relative_humidity_2m,weather_code`;

    const weatherResponse = await fetch(weatherURL);

    if(!weatherResponse.ok){
        throw new Error('Sorry. Not Found')
    }else{
        return weatherResponse.json()
    }

}


function displayWeatherInfo(data, city){
    let formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    let {temperature_2m:temperature, is_day:day, relative_humidity_2m:humidity, weather_code:weathercon} = data.current
    let weatherEmoji = getWeatherEmoji(weathercon, day)
    err.textContent = ""
    
    weatherIcon.textContent = weatherEmoji;
    cityName.textContent = formattedCity;
    temp.textContent = String(temperature) + " °C";
    hum.textContent = `Humidity: ${humidity}%`;
}


async function getlatlon(city){
    const latlonURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API}`

    const latlonResponse = await fetch(latlonURL)

    if(!latlonResponse.ok){
        throw new Error(`Could not find the City: ${city}`)
    }
    else{
        return latlonResponse.json()
    }
}


function getWeatherEmoji(weatherid, day) {
    switch (true) {
        case (weatherid >= 95 && weatherid <= 99): // Thunderstorm
            return "⛈️ Thunderstorm";
        case (weatherid >= 51 && weatherid <= 55): // Drizzle
            return "🌧️ Drizzle";
        case (weatherid === 1): // Clear Sky
            return day ? "☀️ Clear Sky" : "🌙 Clear Sky";
        case (weatherid === 2 || weatherid === 3): // Partly Cloudy
            return day ? "⛅ Partly Cloudy" : "🌙☁️ Partly Cloudy";
        case (weatherid >= 45 && weatherid <= 48): // Fog
            return "🌫️ Foggy";
        case (weatherid >= 61 && weatherid <= 67): // Rain
            return "🌧️ Rain";
        case (weatherid >= 71 && weatherid <= 77): // Snow
            return "❄️ Snow";
        default:
            return "❓Unknown Weather";
    }
}



function displayError(message){
    weatherIcon.textContent = "";
    cityName.textContent = '';
    temp.textContent = '';
    hum.textContent = '';
    condition.textContent = '';
        
    err.textContent = message
}