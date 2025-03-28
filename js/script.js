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


searchBtn.onclick = async ()=>{
    const city = search_input.value

    if(city){
        search_input.value = '';
        try{
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
}


async function getWeatherData(city) {
    const latlondata = await getlatlon(city)

    if (!latlondata || latlondata.length === 0) {
        throw new Error(`Could not find the city: ${city}`);
    }

    let {lat,lon} = latlondata[0]
    
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}`;

    const weatherResponse = await fetch(weatherURL);

    if(!weatherResponse.ok){
        throw new Error('Sorry. Not Found')
    }else{
        return weatherResponse.json()
    }

}


function displayWeatherInfo(data, city){
    let formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    let city_name = formattedCity
    let temperature = data.main.temp - 273;
    let humidity = data.main.humidity;
    let weathercon = data.weather[0].description;
    let weatherEmoji = getWeatherEmoji(data.weather[0].id);

    err.textContent = ""
    
    weatherIcon.textContent = weatherEmoji;
    cityName.textContent = city_name;
    temp.textContent = String(temperature.toFixed(2)) + " °C";
    hum.textContent = `Humidity: ${humidity}%`;
    condition.textContent = weathercon;
}


async function getlatlon(city){
    const latlonURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API}`

    const latlonResponse = await fetch(latlonURL)

    if(!latlonResponse.ok){
        throw new Error(`Could not find the City: ${city}`)
    }
    else{
        return latlonResponse.json()
    }
}


function getWeatherEmoji(weatherid){
    switch(true){
        case (weatherid >= 200 && weatherid < 300):
            return "⛈️"
        case (weatherid >= 300 && weatherid < 400):
            return "🌧️"
        case (weatherid >= 500 && weatherid < 600):
            return "🌧️"
        case (weatherid >= 600 && weatherid < 700):
            return "❄️"
        case (weatherid >= 700 && weatherid < 800):
            return "🌫️"
        case (weatherid === 800):
            return "☀️"
        case (weatherid >= 801 && weatherid < 810):
            return "🌥️"
        default:
            return "❓"
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