import datetime
import requests
import asyncio

def get_time() -> dict:
    now = datetime.datetime.now()
    return {
        "time_24h": now.strftime("%H:%M:%S"),
        "time_12h": now.strftime("%I:%M:%S %p"),
        "hour":     now.hour,
        "minute":   now.minute,
        "second":   now.second,
    }


def get_date() -> dict:
    today = datetime.date.today()
    return {
        "date":       today.isoformat(),           # 2025-04-16
        "day":        today.strftime("%A"),         # Wednesday
        "day_short":  today.strftime("%a"),         # Wed
        "month":      today.strftime("%B"),         # April
        "month_num":  today.month,
        "year":       today.year,
        "formatted":  today.strftime("%d %B %Y"),  # 16 April 2025
    }


def get_current_ip_info():
    data = requests.get("https://ipinfo.io/json").json()
    return data

def get_current_map_weather(lat:float,lon:float, API_KEY:str):
    """ get current weather using Google Maps API """
    
    try:
        data = requests.get(f"https://weather.googleapis.com/v1/currentConditions:lookup?key={API_KEY}&location.latitude={lat}&location.longitude={lon}").json()
        return data
    except Exception as e:
        print("error: ", e)


def handle_get_current():
    return 'get current function '

# if __name__ == "__main__":
    # from dotenv import load_dotenv
    # import os
    # load_dotenv()
    # API_KEY = os.getenv("GMAP_DEMO_KEY")

    # IP_data = get_current_ip_info()
    # lat, lon = IP_data["loc"].split(",")
    # print("latitude: ", lat)
    # print("longitude: ", lon)
    # Weather_data = get_current_map_weather(float(lat), float(lon), API_KEY)
    # print("Weather data: ", Weather_data)
    # print(get_date())
