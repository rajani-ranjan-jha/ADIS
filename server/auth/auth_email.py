# auth_email.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth.auth_utils import create_jwt
from db.connect import get_connection, hash_password, now

router = APIRouter()

class EmailSignupRequest(BaseModel):
    full_name: str
    email: str
    password: str

class EmailLoginRequest(BaseModel):
    email: str
    password: str

@router.post("/auth/email/signup")
def signup(body: EmailSignupRequest):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (body.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")
        
    pwd_hash = hash_password(body.password)
    
    cursor.execute(
        "INSERT INTO users (full_name, email, password_hash, auth_provider, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        (body.full_name, body.email, pwd_hash, "local", now(), now())
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    jwt_token = create_jwt(user_id=user_id, email=body.email)
    return {"token": jwt_token, "message": "Signup successful"}

@router.post("/auth/email/login")
def login(body: EmailLoginRequest):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, password_hash FROM users WHERE email = ? AND auth_provider = 'local'", (body.email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    stored_hash = user['password_hash']
    if hash_password(body.password) != stored_hash:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    jwt_token = create_jwt(user_id=user['id'], email=body.email)
    return {"token": jwt_token, "message": "Login successful"}
