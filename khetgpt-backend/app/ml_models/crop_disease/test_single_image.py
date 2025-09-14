import sys
from pathlib import Path
import logging
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import model functions
from model import predict_disease, CropDiseaseModel

def test_single_image(image_path):
    """Test the model with a single image."""
    # Path to the model
    model_path = Path("crop_disease_model.h5")
    
    if not Path(image_path).exists():
        logger.error(f"Image not found: {image_path}")
        return
        
    logger.info(f"Testing image: {image_path}")
    
    # Try direct model prediction
    logger.info("Loading model...")
    model = CropDiseaseModel(str(model_path))
    
    # Load and show the image
    img = Image.open(image_path)
    plt.figure(figsize=(8, 6))
    plt.imshow(img)
    plt.axis('off')
    plt.title(f"Test image: {Path(image_path).name}")
    plt.savefig("test_input.png")
    
    # Make prediction
    logger.info("Making prediction...")
    result = model.predict(img)
    
    logger.info(f"Prediction: {result['prediction']}")
    logger.info(f"Confidence: {result['confidence']:.4f}")
    logger.info(f"Treatments: {result['treatments']}")
    
    # Try with the wrapper function
    logger.info("\nTesting with predict_disease function...")
    result2 = predict_disease(img)
    
    logger.info(f"predict_disease result: {result2['prediction']}")
    logger.info(f"predict_disease confidence: {result2['confidence']:.4f}")
    logger.info(f"predict_disease treatments: {result2['treatments']}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_single_image(sys.argv[1])
    else:
        # Create a test image if no path provided
        logger.info("No image path provided. Creating a red test image...")
        test_img = Image.new('RGB', (224, 224), color=(255, 0, 0))
        test_img.save("test_red.jpg")
        test_single_image("test_red.jpg")