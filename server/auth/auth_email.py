# auth_email.py
from models.User import UserModel
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth.auth_utils import create_jwt
from db.connect import hash_password, now

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
    existingUser = UserModel.find_one({"email": body.email})
    if existingUser:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    pwd_hash = hash_password(body.password)
    
    result = UserModel.insert_one({
        "name": body.full_name,
        "email": body.email,
        "password": pwd_hash,
        "created_at": now(),
        "updated_at": now()
    })
    
    user_id = str(result.inserted_id)
    
    jwt_token = create_jwt(user_id=user_id, email=body.email)
    return {"token": jwt_token, "message": "Signup successful"}

@router.post("/auth/email/login")
def login(body: EmailLoginRequest):
    user = UserModel.find_one({"email": body.email})
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    stored_hash = user.get('password')
    if not stored_hash or hash_password(body.password) != stored_hash:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    jwt_token = create_jwt(user_id=str(user['_id']), email=body.email)
    return {"token": jwt_token, "message": "Login successful"}
