# auth_google.py
from models.User import UserModel
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

from api.auth.auth_utils import create_jwt
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

    # print("success google login ✅✅: ", full_name, email, google_id, profile_pic)
    
    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google")
        
    # DB CONNECTION
    try:
        existingUser = UserModel.find_one({"email":email})
        if not existingUser:
            UserModel.insert_one({
                "name": full_name,
                "email": email,
                "profile_pic": profile_pic,
                # "auth_provider": "google",
                # "provider_id": google_id,
                "created_at": now(),
                "updated_at": now()
            })
    except Exception as e:
        print("Error in google login: ", e)
    
    jwt_token = create_jwt(user_id=google_id, email=email)
    
    return {"token": jwt_token, "user": {"email": email, "full_name": full_name, "profile_pic": profile_pic}}
