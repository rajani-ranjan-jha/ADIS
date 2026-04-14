# config.py
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

JWT_SECRET_KEY      = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM       = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES  = int(os.getenv("JWT_EXPIRE_MINUTES", 60))
CLIENT_URL = os.getenv("CLIENT_URL")