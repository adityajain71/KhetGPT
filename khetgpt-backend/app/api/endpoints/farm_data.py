from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
import random
from datetime import datetime, timedelta

from app.api.endpoints.auth import get_current_active_user

router = APIRouter()

# Mock farm data
farm_fields = {
    "field1": {
        "id": "field1",
        "name": "North Field",
        "location": {"lat": 19.0760, "lng": 72.8777},
        "area": 2.5,  # hectares
        "crop": "Rice",
        "planting_date": "2025-06-15"
    },
    "field2": {
        "id": "field2",
        "name": "South Field",
        "location": {"lat": 19.0710, "lng": 72.8750},
        "area": 1.8,
        "crop": "Wheat",
        "planting_date": "2025-11-10"
    }
}

# Generate sensor readings
def generate_sensor_readings(days=30):
    today = datetime.now()
    data = []
    
    for i in range(days):
        date = today - timedelta(days=i)
        date_str = date.strftime("%Y-%m-%d")
        
        # Generate realistic soil moisture pattern (decreasing over time with some randomness)
        base_moisture = max(40 - (i * 0.8), 20)
        moisture = base_moisture + random.uniform(-5, 5)
        
        # Temperature varies between 25-35°C
        temperature = random.uniform(25, 35)
        
        # pH varies between 6-7.5
        ph = random.uniform(6, 7.5)
        
        data.append({
            "date": date_str,
            "soil_moisture": round(moisture, 1),
            "temperature": round(temperature, 1),
            "humidity": round(random.uniform(60, 85), 1),
            "soil_ph": round(ph, 1),
            "nitrogen": round(random.uniform(45, 60), 1),
            "phosphorus": round(random.uniform(10, 20), 1),
            "potassium": round(random.uniform(150, 200), 1)
        })
    
    return sorted(data, key=lambda x: x["date"])


@router.get("/fields")
async def get_fields(current_user = Depends(get_current_active_user)):
    """
    Get all fields for the current user
    """
    return list(farm_fields.values())


@router.get("/fields/{field_id}")
async def get_field(field_id: str, current_user = Depends(get_current_active_user)):
    """
    Get specific field by ID
    """
    if field_id not in farm_fields:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    return farm_fields[field_id]


@router.get("/fields/{field_id}/sensor-data")
async def get_field_sensor_data(
    field_id: str,
    days: int = 30,
    current_user = Depends(get_current_active_user)
):
    """
    Get sensor data for a specific field
    """
    if field_id not in farm_fields:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    # Generate mock sensor readings
    return generate_sensor_readings(days)