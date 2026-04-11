# auth_microsoft.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx


from auth.auth_utils import create_jwt
from db.connect import get_connection, now

router = APIRouter()

USER_INFO_URL = "https://graph.microsoft.com/v1.0/me"

class MicrosoftTokenRequest(BaseModel):
    access_token: str

@router.post("/auth/microsoft/login")
async def microsoft_login(body: MicrosoftTokenRequest):
    access_token = body.access_token

    # ── Step B: Use the access token to fetch the user's profile ──
    async with httpx.AsyncClient() as client:
        profile_response = await client.get(
            USER_INFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )

    if profile_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch user profile from Microsoft")

    profile   = profile_response.json()
    ms_id     = profile.get("id")
    email     = profile.get("mail") or profile.get("userPrincipalName")
    full_name = profile.get("displayName", "")
    
    print("success microsoft login ✅✅: ", profile, email, ms_id, full_name)

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Microsoft")

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
    #         (full_name, email, "microsoft", ms_id, now(), now())
    #     )
    #     conn.commit()
    #     user_id = cursor.lastrowid

    # conn.close()

    jwt_token = create_jwt(user_id=ms_id, email=email)

    return {"token": jwt_token, "user": {"email": email, "full_name": full_name}}