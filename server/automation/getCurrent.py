import asyncio
from datetime import datetime
import time

def current_coordinates():
    "use the html default api to get the location on frontend, and then send the location via an API call to the backend"
    pass
def current_location(): pass
def current_date(): 
    now = datetime.now()
    formatted_date = now.strftime("%d %B, %Y")
    print(formatted_date)

def current_time(location = 'india'):
    now = datetime.now()
    iso_format = now.strftime("%I:%M %p %Z")
    print(iso_format)
    
def current_timezone():
    timezone = time.tzname[time.daylight]
    print(timezone)
    

current_date()


