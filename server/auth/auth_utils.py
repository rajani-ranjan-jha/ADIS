# auth_utils.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from others.config import JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRE_MINUTES


def create_jwt(user_id: int, email: str) -> str:
    """Create a signed JWT for a user."""
    payload = {
        "sub": str(user_id),   # subject — who this token belongs to
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_jwt(token: str) -> dict:
    """Verify a JWT and return its payload. Raises if invalid."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid or expired token")