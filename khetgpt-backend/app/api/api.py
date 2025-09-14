from fastapi import APIRouter
from app.api.endpoints import auth, users, crops, predictions, farm_data, public

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(crops.router, prefix="/crops", tags=["crops"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(farm_data.router, prefix="/farm-data", tags=["farm_data"])
api_router.include_router(public.router, prefix="/public", tags=["public"])