let nameOfTheCity = document.getElementById("city")
let formStyle = document.getElementById('signinFrm')
let weatherApi = document.getElementById('weatherapi')
let form = document.getElementById('form')

document.getElementById("submit").addEventListener("click", (event) => {
    validateForm(event)

})

function validateForm(event) {
    console.log(nameOfTheCity.value, ": name of the ciy")
    if (nameOfTheCity.value == "" || nameOfTheCity.value == null) {
        event.preventDefault();
        console.log('validate')
        setCityNameError()
    } else {
        console.log('appiiiiiiii')
        event.preventDefault();
        weatherApInformation(nameOfTheCity.value)
    }
}

function setCityNameError() {
    let errorMessage = document.getElementById("username-message")
    errorMessage.style.visibility = "visible"
    errorMessage.style.color = "red"
    errorMessage.innerText = "city name must not be empty"

}

function weatherApInformation(cityName) {

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=03bafb90e71dae738fce744e860900b3`)
        .then(response => response.json())
        .then(function(data) {
            console.log(data)
            form_city_name = data["name"]
            country_code = data["sys"]["country"]
            longitude = precise(data["coord"]["lon"])
            latitude = precise(data["coord"]["lat"])
            cloud = data["weather"][0]["description"]

            temp_max = data["main"]["temp_max"]
            temp_max = temperature_coverture(temp_max)
            temp_min = data["main"]["temp_min"]
            temp_min = temperature_coverture(temp_min)
            temperature_average = data["main"]["temp"]
            temperature_average = temperature_coverture(temperature_average)

            pressure = data["main"]["pressure"]
            pressure = `${pressure} kpa`

            humidity = data["main"]["humidity"]
            wind_speed = data["wind"]["speed"]

            weatherInformation = {
                'city name': form_city_name,
                'country code': country_code,
                'longitude': longitude,
                'latitude': latitude,
                'cloud': cloud,
                'temperature maximum': temp_max,
                'temperature minimum': temp_min,
                'average temperature': temperature_average,
                'pressure': pressure,
                'humidity': humidity,
                'wind speed ': wind_speed
            }
            displayWeatherApi(weatherInformation)
        })
}


function displayWeatherApi(message) {
    var h1 = document.createElement("h1")
    h1.innerText = 'weather information'
    weatherApi.appendChild(h1)
    for (const key in message) {
        console.log('key :', key)
        console.log("value : ", message[key])
        var paragraph = document.createElement("p")
        paragraph.innerText = `${key } : ${message[key]}`
        console.log(paragraph, "after")
        weatherApi.appendChild(paragraph)

    }

}

function temperature_coverture(kelvin) {
    let celsius = kelvin - 273.15
    celsius = precise(celsius)
    celsius = `${celsius} degree celsius`
    return celsius
}

function precise(x) {
    return Number.parseFloat(x).toPrecision(4);
}