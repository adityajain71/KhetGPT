from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Form
from typing import List, Optional
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import os
import random
import logging
import base64
from datetime import datetime
from pathlib import Path

from app.api.endpoints.auth import get_current_active_user
try:
    from app.ml_models.crop_disease.model import predict_disease
    from app.ml_models.crop_disease.image_utils import decode_base64_image, encode_image_to_base64
    ML_MODEL_AVAILABLE = True
except ImportError as e:
    logging.warning(f"ML model import failed: {e}. Will use mock data instead.")
    ML_MODEL_AVAILABLE = False

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class PredictionRequest(BaseModel):
    image_base64: str

class PredictionResponse(BaseModel):
    filename: Optional[str] = None
    prediction: str
    confidence: float
    possible_treatments: List[str]
    image_url: Optional[str] = None


@router.post("/crop-disease", response_model=PredictionResponse)
async def predict_crop_disease(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
):
    """
    Analyze crop image for disease detection
    """
    # Validate file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not an image"
        )
        
    try:
        # Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Make prediction using the CNN model
        if ML_MODEL_AVAILABLE:
            # Use the actual prediction model
            prediction_result = predict_disease(image)
        else:
            # Use mock data if model is not available
            mock_diseases = ["Healthy", "Powdery", "Rust"]
            mock_disease = random.choice(mock_diseases)
            
            mock_treatments = {
                "Healthy": ["No treatment needed."],
                "Powdery": [
                    "Apply fungicides with sulfur or potassium bicarbonate",
                    "Ensure proper air circulation around plants",
                    "Remove and dispose of infected plant parts",
                    "Use neem oil as a natural alternative",
                    "Maintain proper plant spacing to reduce humidity"
                ],
                "Rust": [
                    "Apply fungicides containing tebuconazole or chlorothalonil",
                    "Remove and destroy infected plant material",
                    "Improve air circulation by proper spacing",
                    "Avoid overhead irrigation to keep foliage dry",
                    "Rotate crops to break disease cycle"
                ]
            }
            
            prediction_result = {
                "prediction": mock_disease,
                "confidence": round(random.uniform(0.7, 0.98), 2),
                "treatments": mock_treatments[mock_disease]
            }
        
        # Save the image for future training (optional)
        save_dir = Path("app/ml_models/crop_disease/uploads")
        save_dir.mkdir(exist_ok=True, parents=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = save_dir / f"{current_user.id}_{timestamp}_{file.filename}"
        
        with open(file_path, "wb") as f:
            f.write(contents)
        
        return PredictionResponse(
            filename=file.filename,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            possible_treatments=prediction_result["treatments"]
        )
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )


@router.post("/crop-disease-base64", response_model=PredictionResponse)
async def predict_crop_disease_base64(
    request: PredictionRequest,
    current_user = Depends(get_current_active_user)
):
    """
    Predict crop disease from a base64 encoded image in JSON request.
    """
    try:
        # Decode base64 image
        try:
            image = decode_base64_image(request.image_base64)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Invalid base64 image: {str(e)}"
            )

        # Process the image and get prediction
        if ML_MODEL_AVAILABLE:
            # Use the actual prediction model
            prediction_result = predict_disease(image)
        else:
            # Use mock data if model is not available
            mock_diseases = ["Healthy", "Powdery", "Rust"]
            mock_disease = random.choice(mock_diseases)
            
            mock_treatments = {
                "Healthy": ["No treatment needed."],
                "Powdery": [
                    "Apply fungicides with sulfur or potassium bicarbonate",
                    "Ensure proper air circulation around plants",
                    "Remove and dispose of infected plant parts",
                    "Use neem oil as a natural alternative"
                ],
                "brown_spot": [
                    "Apply fungicides with propiconazole or trifloxystrobin",
                    "Maintain proper spacing between plants",
                    "Remove and destroy infected plants"
                ],
                "leaf_blast": [
                    "Use fungicides containing tricyclazole",
                    "Balance nitrogen fertilization",
                    "Use resistant varieties when available"
                ]
            }
            
            prediction_result = {
                "prediction": mock_disease,
                "confidence": round(random.uniform(0.7, 0.98), 2),
                "treatments": mock_treatments[mock_disease]
            }
        
        # Save the image for future training (optional)
        save_dir = Path("app/ml_models/crop_disease/uploads")
        save_dir.mkdir(exist_ok=True, parents=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{current_user.id}_{timestamp}_base64_image.jpg"
        file_path = save_dir / filename
        
        # Save the image
        image.save(file_path)
        
        # Convert result to PredictionResponse
        return PredictionResponse(
            filename=filename,
            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],
            possible_treatments=prediction_result["treatments"]
        )
    
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )


@router.post("/train/disease")
async def train_disease_model(current_user = Depends(get_current_active_user)):
    """
    Train a new disease detection model.
    
    This is a placeholder endpoint. In a real implementation,
    this would likely be a background task that trains the model
    on a dataset.
    """
    # Check if user has admin privileges (you might want to implement this)
    # if not current_user.is_admin:
    #    raise HTTPException(
    #        status_code=status.HTTP_403_FORBIDDEN,
    #        detail="Only administrators can train models"
    #    )
    
    return {"message": "Training job submitted. This would be a background task in production."}