from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ACCESSING PARENT DIR
# from ...backend.automation.quickPanel import check_battery

import sys
import os


# Get the absolute path of the parent directory
# os.path.dirname(__file__) gives the current directory of the script
# Calling os.path.dirname() again gives the parent directory
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Add the parent directory to the system path
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Now you can import the module using its name directly
from automation.quickPanel import check_battery


# TODO:main app
app = FastAPI()

# Define allowed origins for your frontend
origins = [
    "http://localhost:5173",
]

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
def hello_world():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

@app.get("/api/battery")
def get_battery():
    try:
        status = check_battery()
        return {"battery": status}
    except Exception as e:
        print(e)
        return {"error": e}