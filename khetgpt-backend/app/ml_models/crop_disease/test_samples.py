import os
import sys
from pathlib import Path
import logging
import tensorflow as tf
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import model functions directly from the same directory
from model import predict_disease, CropDiseaseModel

def test_model_with_samples():
    """Test the model with sample images from each class to verify predictions."""
    # Path to the dataset directory
    dataset_dir = Path("dataset")
    if not dataset_dir.exists():
        logger.warning(f"Dataset directory not found at {dataset_dir.absolute()}, skipping dataset tests")
        # Create some test images
        logger.info("Creating synthetic test images")
        # Skip to preprocessing checks
        return
    
    # Path to the model
    model_path = Path("crop_disease_model.h5")
    if not model_path.exists():
        logger.error(f"Model file not found at {model_path.absolute()}")
        return
    
    logger.info(f"Loading model from {model_path}")
    model = CropDiseaseModel(str(model_path))
    
    # Create output directory for sample predictions
    output_dir = Path("prediction_samples")
    output_dir.mkdir(exist_ok=True)
    
    # Log model information
    logger.info(f"Model class names: {model.class_names}")
    
    # Find test images from each class
    test_dir = dataset_dir / "test"
    if not test_dir.exists():
        logger.error(f"Test directory not found at {test_dir}")
        return
    
    classes = [d for d in test_dir.iterdir() if d.is_dir()]
    
    # Prepare a figure for visualization
    plt.figure(figsize=(15, 5 * len(classes)))
    
    for i, class_dir in enumerate(classes):
        class_name = class_dir.name
        logger.info(f"Testing class: {class_name}")
        
        # Get a few sample images
        image_files = list(class_dir.glob("*.jpg"))[:3]  # Take up to 3 samples
        if not image_files:
            image_files = list(class_dir.glob("*.png"))[:3]
            
        if not image_files:
            logger.warning(f"No images found for class {class_name}")
            continue
            
        for j, img_path in enumerate(image_files):
            # Load and process image
            img = Image.open(img_path)
            
            # Record the original prediction
            logger.info(f"Predicting {img_path}...")
            result = model.predict(img)
            
            # Save visualization
            plt_idx = i * 3 + j + 1
            plt.subplot(len(classes), 3, plt_idx)
            plt.imshow(img)
            plt.title(f"True: {class_name}\nPred: {result['prediction']} ({result['confidence']:.2f})")
            plt.axis('off')
            
            # Log the results
            logger.info(f"Image: {img_path.name}, True: {class_name}, "
                       f"Predicted: {result['prediction']}, "
                       f"Confidence: {result['confidence']:.4f}")
            
            # Check if prediction matches ground truth
            is_correct = result['prediction'].lower() == class_name.lower()
            logger.info(f"Correct prediction: {is_correct}")
    
    # Save the visualization
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    plt.tight_layout()
    plt.savefig(output_dir / f"sample_predictions_{timestamp}.png")
    logger.info(f"Saved prediction visualization to {output_dir}/sample_predictions_{timestamp}.png")

def check_preprocessing():
    """Test the preprocessing steps to ensure they work correctly."""
    # Create a sample image with known values
    test_img = Image.new('RGB', (300, 300), color=(255, 0, 0))  # Bright red
    
    # Process the image as the model would
    if test_img.mode != "RGB":
        test_img = test_img.convert("RGB")
    
    test_img = test_img.resize((224, 224))
    img_array = np.array(test_img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Check the array values
    logger.info(f"Preprocessed image shape: {img_array.shape}")
    logger.info(f"Min value: {img_array.min()}, Max value: {img_array.max()}")
    logger.info(f"Mean value: {img_array.mean()}")
    
    # First pixel color (should be [1,0,0] for red)
    logger.info(f"First pixel value: {img_array[0,0,0,:]}")

if __name__ == "__main__":
    logger.info("Starting model testing")
    check_preprocessing()
    test_model_with_samples()