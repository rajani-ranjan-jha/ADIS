# auth_google.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from auth.auth_utils import create_jwt
from db.connect import get_connection, now

router = APIRouter()

class GoogleTokenRequest(BaseModel):
    token: str

@router.post("/auth/google/login")
async def google_login(body: GoogleTokenRequest):
    token = body.token
    
    # Verify token with Google
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
        
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid Google token")
        
    user_info = response.json()
    profile_pic = user_info.get("picture")
    email = user_info.get("email")
    google_id = user_info.get("sub")
    full_name = user_info.get("name", "")

    print("success google login ✅✅: ", user_info, email, google_id, full_name)
    
    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google")
        
    # DB CONNECTION
    # conn = get_connection()
    # cursor = conn.cursor()
    
    # cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    # existing_user = cursor.fetchone()
    
    # if existing_user:
    #     user_id = existing_user[0]
    # else:
    #     cursor.execute(
    #         "INSERT INTO users (full_name, email, auth_provider, provider_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    #         (full_name, email, "google", google_id, now(), now())
    #     )
    #     conn.commit()
    #     user_id = cursor.lastrowid
        
    # conn.close()
    
    jwt_token = create_jwt(user_id=google_id, email=email)
    
    return {"token": jwt_token, "user": {"email": email, "full_name": full_name, "profile_pic": profile_pic}}
