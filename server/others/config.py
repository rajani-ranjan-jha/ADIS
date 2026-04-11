# config.py
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

MICROSOFT_CLIENT_ID     = os.getenv("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")
MICROSOFT_REDIRECT_URI  = os.getenv("MICROSOFT_REDIRECT_URI")

JWT_SECRET_KEY      = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM       = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES  = int(os.getenv("JWT_EXPIRE_MINUTES", 60))
