from fastapi import APIRouter, File, UploadFile, HTTPException, status, Form
from typing import List, Optional
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import os
import random
import logging
from datetime import datetime
from pathlib import Path

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

@router.post("/predict-disease", response_model=PredictionResponse)
async def predict_crop_disease_public(
    file: UploadFile = File(...)
):
    """
    Public endpoint to analyze crop image for disease detection (no authentication required)
    """
    # Log request details
    logger.info(f"Public crop disease detection request received: {file.filename}")
    
    # Validate file is an image
    if not file.content_type.startswith("image/"):
        logger.error(f"Invalid file type: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not an image"
        )
        
    try:
        # Read and process the image
        contents = await file.read()
        
        try:
            # Try to open image with PIL
            image = Image.open(io.BytesIO(contents))
            logger.info(f"Image successfully read: {image.format}, {image.size}, {image.mode}")
            
            # Ensure image is in RGB mode
            if image.mode != "RGB":
                logger.info(f"Converting image from {image.mode} to RGB")
                image = image.convert("RGB")
                
            # Save the image for debugging
            debug_dir = Path("app/ml_models/crop_disease/debug")
            debug_dir.mkdir(exist_ok=True, parents=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            debug_path = debug_dir / f"debug_image_{timestamp}.jpg"
            image.save(debug_path)
            logger.info(f"Saved debug image to {debug_path}")
        except Exception as img_error:
            logger.error(f"Error processing image: {str(img_error)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image format: {str(img_error)}"
            )
        
        # Make prediction using the CNN model
        if ML_MODEL_AVAILABLE:
            # Use the actual prediction model
            logger.info("Using ML model for prediction")
            try:
                prediction_result = predict_disease(image)
                logger.info(f"Prediction result: {prediction_result['prediction']} with confidence {prediction_result['confidence']}")
            except Exception as pred_error:
                logger.error(f"Error in prediction: {str(pred_error)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error in prediction: {str(pred_error)}"
                )
        else:
            # Use mock data if model is not available
            logger.info("ML model not available, using mock data")
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
            logger.info(f"Mock prediction result: {prediction_result['prediction']} with confidence {prediction_result['confidence']}")
        
        # Save the image for future training (optional)
        save_dir = Path("app/ml_models/crop_disease/uploads")
        save_dir.mkdir(exist_ok=True, parents=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = save_dir / f"anonymous_{timestamp}_{file.filename}"
        
        with open(file_path, "wb") as f:
            # Reset file position to beginning
            await file.seek(0)
            contents = await file.read()
            f.write(contents)
        
        # Log the results before returning
        logger.info(f"Final prediction result: {prediction_result}")
        
        # Ensure prediction is a string (not numpy.str_ or other type)
        prediction = str(prediction_result["prediction"])
        confidence = float(prediction_result["confidence"])
        treatments = [str(t) for t in prediction_result["treatments"]] if "treatments" in prediction_result else []
        
        # Create a response with the correct field names
        response_data = PredictionResponse(
            filename=file.filename,
            prediction=prediction,
            confidence=confidence,
            possible_treatments=treatments
        )
        
        logger.info(f"Returning prediction response: {response_data.dict()}")
        
        # Add headers for CORS
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing image: {str(e)}"
        )