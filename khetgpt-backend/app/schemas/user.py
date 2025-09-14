from pydantic import BaseModel
from typing import Optional, List


class UserBase(BaseModel):
    email: str
    name: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str
    role: str

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str