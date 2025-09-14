from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.api.endpoints.auth import get_current_active_user

router = APIRouter()

# Mock data for crops
crop_data = {
    "crop1": {
        "id": "crop1",
        "name": "Rice",
        "scientific_name": "Oryza sativa",
        "growth_days": 120,
        "water_needs": "High",
        "season": "Kharif",
        "soil_types": ["Clay", "Loam"]
    },
    "crop2": {
        "id": "crop2",
        "name": "Wheat",
        "scientific_name": "Triticum aestivum",
        "growth_days": 140,
        "water_needs": "Medium",
        "season": "Rabi",
        "soil_types": ["Loam", "Sandy loam"]
    },
    "crop3": {
        "id": "crop3",
        "name": "Cotton",
        "scientific_name": "Gossypium hirsutum",
        "growth_days": 180,
        "water_needs": "Medium",
        "season": "Kharif",
        "soil_types": ["Black soil", "Alluvial soil"]
    }
}


@router.get("/")
async def get_all_crops(current_user = Depends(get_current_active_user)):
    """
    Get list of all available crops
    """
    return list(crop_data.values())


@router.get("/{crop_id}")
async def get_crop(crop_id: str, current_user = Depends(get_current_active_user)):
    """
    Get specific crop by ID
    """
    if crop_id not in crop_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    return crop_data[crop_id]