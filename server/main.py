# ____FASTAPI MAIN ENTRY POINT____

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.auth_microsoft import router as microsoft_router
from auth.auth_google import router as google_router
from auth.auth_email import router as email_router

app = FastAPI()
app.include_router(microsoft_router)
app.include_router(google_router)
app.include_router(email_router)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def homepage():
    return {"message": "you are on home page!"}
