from datetime import timedelta
import requests
import hashlib

from flask_cors import CORS

from flask import Flask, render_template, request, session,jsonify

import psycopg2
import psycopg2.extras
import psycopg2.errors


app = Flask(__name__,static_url_path="/static")
app.permanent_session_lifetime = timedelta(minutes=60)

CORS(app)

app.config["SECRET_KEY"] = "super secret key"

db_config = {

    "user": "kid",
    "password": "kid",
    "host": "localhost",
    "port": "5432",
    "database": "kidus"
}

# create necessary tables by default
try:
    connection = psycopg2.connect(**db_config)

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS airlines(

            id SERIAL PRIMARY KEY ,
            
            name VARCHAR NOT NULL UNIQUE,
            
            password VARCHAR NOT NULL,
            
            day DATE NOT NULL);
        """)
    connection.commit()
except (Exception, psycopg2.Error) as error:
    print("Error connecting to PostgreSQL database", error)
    connection = None
finally:
    if connection != None:
        cursor.close()
        connection.close()

loginMessage = {}
registerMessage = {}
sessionSuccess = []


@app.route("/registor", methods=['POST'])
def registor():

    print(str(request.json))
    name = request.json["name"]
    password = request.json["password"]
    day = request.json["day"]


    # string must be encoded in utf-8 before hashing
    encoded_password = str(password).encode('utf-8')
    hashed_password = hashlib.sha256(encoded_password).hexdigest()

    conn = psycopg2.connect(**db_config)

    cursor = conn.cursor()

    select_query = "SELECT * FROM airlines WHERE name = %s and password = %s"

    cursor.execute(select_query, (name, hashed_password))

    record = cursor.fetchone()

    
    print(record)
    print(record is not None)
    if record is not None:
        registerMessage = {
            'message' : 'you are already have an account'
            }
        
        return jsonify(registerMessage)

    insert_query = "INSERT INTO airlines(name,password,day) VALUES(%s,%s,%s)"
    cursor.execute(insert_query, (name, hashed_password, day))

    conn.commit()

    registerMessage = {
        'message' : "welcome, you are registered",
        'name':f'{name}'
        }
    
    return jsonify(registerMessage)
    


@app.route("/login", methods = ["POST"])
def login():
        
    conn = psycopg2.connect(**db_config)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    form_name = request.json["name"]
    form_password = request.json["password"]
    # form_name = request.form["name"]
    # form_password = request.form["password"]
    print(form_name)
    print(form_password)
    # insert_query="INSERT INTO session(name,token) VALUE(session,session_token)
    # # string must be encoded in utf-8 before hashing
    encodedPassword = str(form_password).encode('utf-8')
    hashedPassword = hashlib.sha256(encodedPassword).hexdigest()

    select_query = "SELECT * FROM airlines WHERE name = %s and password = %s"
    cursor.execute(select_query, (form_name, hashedPassword))

    record = cursor.fetchone()
    
    print()
    if record is not None:
        session['name'] = request.json['name']

        loginSuccessMessage = 'welcome to time and weather service'
        loginMessage = {
            'message' :loginSuccessMessage
            } 
        print(loginMessage)
        return jsonify(loginMessage)
    
    if record is None:
        loginMessage = {
            'message':'your not registered'
        }
        print(loginMessage)
        return jsonify(loginMessage)


@app.route("/reminder")
def reminder():
    if "name" in session:
        name = session["name"]

        sessionSuccess.append(name)
        return jsonify(sessionSuccess)

    loginMessage = [
        'session not found redirect to login'
        ]
    return jsonify(loginMessage)


@app.route("/registered")
def registered():
    name = session['name']
    registered = [
        f'welcome {name} , your are registered'
    ]
    return jsonify(registered)


@app.route("/time")
def time():
    if "name" in session:
        name = session["name"]

        sessionSuccess.append(name)
        return jsonify(sessionSuccess)

    reminderMessage = [
        'session not found redirect to login'
    ]
    return jsonify(reminderMessage)


@app.route("/weather")
def weather():
    if "name" in session:
        name = session["name"]

        sessionSuccess.append(name)
        return jsonify(sessionSuccess)

    reminderMessage = [
        'session not found redirect to login'
    ]
    return jsonify(reminderMessage)

@app.route("/timeapi")
def timeapi():
    if "name" in session:
        
        try:

            form_continent_request = request.args.get("continent")
            form_cities_request = request.args.get("city")

            URL = f"http://worldtimeapi.org/api/timezone/{form_continent_request}/{form_cities_request}"

            response = requests.get(url=URL)
            response = response.json()
            
            if "error" in response:
                
                error = response["error"]
                response = [
                    error
                ]
                return jsonify(response)
                
            timezone = response['timezone']
            datetime = response['datetime']
            utc_offset = response['utc_datetime']
            day_of_the_week = response['day_of_week']

            timeInformation = {
                'continent' : form_continent_request,
                'city' : form_cities_request,
                'timezone' : timezone,
                'datetime' : datetime,
                'GMT' :utc_offset,
                'day of the week' : day_of_the_week

            }
            
            return  jsonify(timeInformation)
            
        except requests.exceptions.ConnectionError:
            
            error_message = [
                "connection error check your internet"
            ]
            return jsonify(error_message)
    else:
        reminderMessage = [
        'session not found redirect to login'
        ]
    return jsonify(reminderMessage)


@app.route("/weatherapi")
def weatherapi():
    # if "name" in session:
        try:
            form_city_name = request.args.get("city")
            
            URL = f"http://api.openweathermap.org/data/2.5/weather?q={form_city_name}&appid=03bafb90e71dae738fce744e860900b3"
            response = requests.get(url=URL)
            response = response.json()
            

            if "message" in response:
                error = response["message"]

                response = [
                    error
                ]
                return jsonify(response)

            country_code = response["sys"]["country"]
            longitude = response["coord"]["lon"]
            latitude = response["coord"]["lat"]
            cloud = response["weather"][0]["description"]

            temp_max = response["main"]["temp_max"]
            temp_max = temperature_coverture(temp_max)
            temp_min = response["main"]["temp_min"]
            temp_min = temperature_coverture(temp_min)
            temperature_average = response["main"]["temp"]
            temperature_average = temperature_coverture(temperature_average)

            pressure = response["main"]["pressure"]
            pressure = str(pressure)+" kpa"

            humidity = response["main"]["humidity"]
            wind_speed = response["wind"]["speed"]

            weatherInformation = {
                'city name' : form_city_name,
                'country code' : country_code, 
                'longitude' : longitude,
                'latitude' : latitude,
                'cloud' : cloud,
                'temperature maximum' : temp_max,
                'temperature minimum' : temp_min,
                'average temperature' : temperature_average,
                'pressure' : pressure,
                'humidity' : humidity,
                'wind speed ' : wind_speed
            }

            return jsonify(weatherInformation)

        except requests.exceptions.ConnectionError:
            
            error_message =[
                "connection error check your wifi"
            ] 
            return jsonify(error_message)
    # else:
    #     reminderMessage = [
    #     'session not found redirect to login'
    #     ]
    #     return jsonify(reminderMessage)




@app.route("/logout")
def logout():
    try:
        session.pop("name")
        sessionOver = [
            'session over redirect to home '
        ]
        return jsonify(sessionOver)
    except KeyError:
        errorHandling = [
            'your are not logged yet ,please login to the app'
        ]
        return jsonify(errorHandling)



@app.errorhandler(404)
def invalid_route(e):
    invalidRoute = [
        'invalid route'
    ]
    return jsonify(invalidRoute)


def temperature_coverture(kelvin):
    celsius = kelvin - 273.15
    celsius = round(celsius, 2)
    celsius = f"{celsius} degree celsius"
    return celsius


if __name__ == "__main__":
    app.run(debug=True)
