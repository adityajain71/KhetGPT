import sys
from pathlib import Path
import logging
import tensorflow as tf
from PIL import Image
import os
import random
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import model functions directly since we're in the same directory
from model import predict_disease, CropDiseaseModel

def debug_model():
    """Test the model's prediction function directly."""
    # Path to the saved model
    model_path = Path("crop_disease_model.h5")
    
    # Check if model exists
    logger.info(f"Checking if model exists at {model_path.absolute()}")
    if model_path.exists():
        logger.info("Model file found")
    else:
        logger.warning(f"Model file not found at {model_path.absolute()}")
        
    # Try to load the model directly
    try:
        logger.info("Attempting to load model...")
        model = CropDiseaseModel(model_path=str(model_path))
        logger.info("Model loaded successfully")
        
        # Check if class names are loaded
        if model.class_names:
            logger.info(f"Class names loaded: {model.class_names}")
        else:
            logger.warning("No class names loaded")
        
        # Create a test image (red square)
        test_img = Image.new('RGB', (224, 224), color='red')
        logger.info("Created test image")
        
        # Try prediction
        logger.info("Attempting prediction with test image...")
        result = model.predict(test_img)
        logger.info(f"Prediction result: {result}")
        
    except Exception as e:
        logger.error(f"Error loading or using model: {str(e)}")
        
    # Try the wrapped predict_disease function
    try:
        logger.info("Testing predict_disease function...")
        test_img = Image.new('RGB', (224, 224), color='green')
        result = predict_disease(test_img)
        logger.info(f"predict_disease result: {result}")
    except Exception as e:
        logger.error(f"Error in predict_disease function: {str(e)}")

if __name__ == "__main__":
    debug_model()