let form = document.getElementById("form")

let nameOfTheContinent = document.getElementById("continent")
let nameOfTheCountry = document.getElementById("country")
let nameOfTheCity = document.getElementById("city")

let errorMessageOfContinent = document.getElementById("continentMessage")
let errorMessageOfCountry = document.getElementById("countryMessage")
let errorMessageOfCity = document.getElementById("cityMessage")

let submit = document.getElementById("submit")

let weatherApi = document.getElementById("weatherapi")
const valueForContinent = document.getElementById("continent")
const uniqueSetOfDataForContinent = new Set()
const valueForCountry = document.getElementById("country")




fetch("http://worldtimeapi.org/api/timezone")
    .then(response => response.json())
    .then(data => writeQueryElementOnContinent(data))

function writeQueryElementOnContinent(data) {

    for (var value = 0; value < data.length; value++) {

        var newArray = data[value].split('/', 1)
        var splitedSubString = newArray[0]
        uniqueSetOfDataForContinent.add(splitedSubString)
    }

    const interator = uniqueSetOfDataForContinent.keys()

    for (var value = 0; value < uniqueSetOfDataForContinent.size; value++) {
        var iteratorValue = interator.next().value
        createChildElement(iteratorValue, 'continent')

    }


}


function writeQueryElementOnCountry(event) {
    removeChildElement("city")
    fetch(`http://worldtimeapi.org/api/timezone/${event.target.value}`)
        .then(response => response.json())
        .then(function(data) {
            let uniqueSetOfDataForCountry = new Set()
            let TwoValueValueCitiesIndex = new Set([3, 56, 68, 92])
            let targetValue = new Set(["CET",
                "CST6CDT", "EET",
                "EST", "EST5EDT",
                "HST", "MET",
                "MST", "MST7MDT",
                "PST8PDT", "WET"
            ])
            if (targetValue.has(event.target.value)) {
                removeChildElement('Location')
                return;
            }
            for (var value = 0; value < data.length; value++) {
                if (event.target.value == 'America') {
                    if (TwoValueValueCitiesIndex.has(value)) {
                        var newArray = data[value].split('/', 3)
                        var splitedSubString = newArray[1] + '/' + newArray[2]
                        uniqueSetOfDataForCountry.add(splitedSubString)
                    }
                }
                var newArray = data[value].split('/', 2)
                var splitedSubString = newArray[1]
                uniqueSetOfDataForCountry.add(splitedSubString)
            }
            const interator = uniqueSetOfDataForCountry.keys(

            )
            for (var value = 0; value < uniqueSetOfDataForCountry.size; value++) {
                var iteratorValue = interator.next().value

                createChildElement(iteratorValue, 'city')
            }


        })
}

document.getElementById("continent").addEventListener("change",
    writeQueryElementOnCountry)

document.getElementById("submit").addEventListener("click", (event, cityName, continentName) => {
    event.preventDefault();
    cityName = nameOfTheCity.value
    continentName = nameOfTheContinent.value
    timeApInformation(continentName, cityName)
})



function createChildElement(value, id) {

    if (value == 'Argentina' || value == 'North_Dakota' || value == 'Kentucky' || value == 'Indiana') {
        return;
    }
    var createOptionTag = document.createElement("option")
    var valueForOptionTag = document.createTextNode(value)
    createOptionTag.setAttribute("value", value)
    createOptionTag.appendChild(valueForOptionTag)
    document.getElementById(id).appendChild(createOptionTag)
}

function removeChildElement(id) {
    const parentElement = document.getElementById(id)
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild)
    }
}

function removeFamily(id) {
    let element = document.getElementById(id)
    element.parentNode.parentNode.removeChild(element.parentNode);
}

function createChildElementForDuplicates(value, id) {

    var createOptionTag = document.createElement("option")
    var valueForOptionTag = document.createTextNode(value)
    createOptionTag.setAttribute("value", value)
    createOptionTag.appendChild(valueForOptionTag)
    document.getElementById(id).appendChild(createOptionTag)
}


function timeApInformation(countryName, cityName) {
    fetch(`http://worldtimeapi.org/api/timezone/${countryName}/${cityName}`)
        .then(response => response.json())
        .then(function(data) {
            console.log("data", data)
            let timeInformation = {
                timezone: data['timezone'],
                datetime: data['datetime'],
                utc_offset: data['utc_datetime'],
                day_of_the_week: data['day_of_week'],
                week_number: data["week_number"]

            }
            console.log(timeInformation, "timeinfo")
            displayTimeApi(timeInformation)
        })
}



function displayTimeApi(message) {
    var h1 = document.createElement("h1")
    h1.innerText = 'weather information'
    weatherApi.appendChild(h1)
    for (const key in message) {

        var paragraph = document.createElement("p")
        paragraph.innerText = `${key } : ${message[key]}`

        weatherApi.appendChild(paragraph)

    }
}