# Restful web app

## Description
basically this repository contain the restful version of world time and weather webappp

## Documentation
### API call

#### weather api

curl api.openweathermap.org/data/2.5/weather?q=${cityName}&appid={API key}

fetch('http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid={API key}')

or using insomnia you can call api

 - example weather response for addis ababa at jan 8
"""
{
	"coord": {
		"lon": 38.7469,
		"lat": 9.025
	},
	"weather": [
		{
			"id": 800,
			"main": "Clear",
			"description": "clear sky",
			"icon": "01d"
		}
	],
	"base": "stations",
	"main": {
		"temp": 296.14,
		"feels_like": 295.3,
		"temp_min": 296.14,
		"temp_max": 296.14,
		"pressure": 1011,
		"humidity": 31,
		"sea_level": 1011,
		"grnd_level": 772
	},
	"visibility": 10000,
	"wind": {
		"speed": 4.52,
		"deg": 138,
		"gust": 3.94
	},
	"clouds": {
		"all": 5
	},
	"dt": 1641638773,
	"sys": {
		"country": "ET",
		"sunrise": 1641613360,
		"sunset": 1641655207
	},
	"timezone": 10800,
	"id": 344979,
	"name": "Addis Ababa",
	"cod": 200
}

"""
#### time api
- example time response for addis ababa at jan 8
curl http://worldtimeapi.org/api/timezone/{continent name}/{city name}

fetch('http://worldtimeapi.org/api/timezone/{continent name}/{country name}')

or using insomnia you can call api

- example time response for addis ababa at jan 8

{
	"abbreviation": "EAT",
	"client_ip": "196.188.199.67",
	"datetime": "2022-01-08T13:48:59.611440+03:00",
	"day_of_week": 6,
	"day_of_year": 8,
	"dst": false,
	"dst_from": null,
	"dst_offset": 0,
	"dst_until": null,
	"raw_offset": 10800,
	"timezone": "Africa/Addis_Ababa",
	"unixtime": 1641638939,
	"utc_datetime": "2022-01-08T10:48:59.611440+00:00",
	"utc_offset": "+03:00",
	"week_number": 1
}


