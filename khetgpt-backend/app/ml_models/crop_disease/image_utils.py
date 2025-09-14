import tensorflow as tf
import numpy as np
from PIL import Image
import cv2
import io
from typing import Tuple, List, Dict, Any, Union
import base64
import matplotlib.pyplot as plt

def load_image_from_path(image_path: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Load and preprocess an image from a file path.
    
    Args:
        image_path: Path to the image file
        target_size: Target size for resizing
        
    Returns:
        Preprocessed image as numpy array
    """
    img = Image.open(image_path)
    return preprocess_image(img, target_size)

def load_image_from_bytes(image_bytes: bytes, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Load and preprocess an image from bytes.
    
    Args:
        image_bytes: Image in bytes format
        target_size: Target size for resizing
        
    Returns:
        Preprocessed image as numpy array
    """
    img = Image.open(io.BytesIO(image_bytes))
    return preprocess_image(img, target_size)

def preprocess_image(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess a PIL image for model input.
    
    Args:
        image: PIL Image object
        target_size: Target size for resizing
        
    Returns:
        Preprocessed image as numpy array
    """
    # Convert to RGB if not already
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Resize the image
    image = image.resize(target_size)
    
    # Convert to numpy array and normalize
    img_array = np.array(image) / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def decode_base64_image(base64_string: str) -> Image.Image:
    """
    Decode a base64 encoded image string to a PIL Image.
    
    Args:
        base64_string: Base64 encoded image string
        
    Returns:
        PIL Image object
    """
    # Remove the data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    image_bytes = base64.b64decode(base64_string)
    return Image.open(io.BytesIO(image_bytes))

def encode_image_to_base64(image: Union[str, Image.Image]) -> str:
    """
    Encode an image to base64 string.
    
    Args:
        image: PIL Image object or path to image file
        
    Returns:
        Base64 encoded image string
    """
    # If image is a string (file path), open it
    if isinstance(image, str):
        image = Image.open(image)
    
    # Save image to bytes buffer
    buffer = io.BytesIO()
    image.save(buffer, format='JPEG')
    
    # Encode to base64
    img_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return f"data:image/jpeg;base64,{img_str}"

def apply_image_segmentation(image: Union[str, Image.Image, np.ndarray]) -> np.ndarray:
    """
    Apply image segmentation to isolate plant/leaf areas.
    
    Args:
        image: Image as PIL Image, numpy array or file path
        
    Returns:
        Segmented image as numpy array
    """
    # If image is a string (file path), open it
    if isinstance(image, str):
        image = cv2.imread(image)
    elif isinstance(image, Image.Image):
        image = np.array(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define range of green color in HSV
    lower_green = np.array([25, 40, 40])
    upper_green = np.array([80, 255, 255])
    
    # Create mask for green areas
    mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Bitwise-AND mask and original image
    result = cv2.bitwise_and(image, image, mask=mask)
    
    return result

def visualize_prediction(image: Union[str, Image.Image, np.ndarray], 
                         prediction: Dict[str, Any]) -> Image.Image:
    """
    Create a visualization of the prediction results.
    
    Args:
        image: Original image
        prediction: Dictionary containing prediction results
        
    Returns:
        PIL Image with visualization
    """
    # Load the image if it's a file path
    if isinstance(image, str):
        img = Image.open(image)
    elif isinstance(image, np.ndarray):
        img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
    else:
        img = image
    
    # Create a figure with two subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))
    
    # Display the original image
    ax1.imshow(img)
    ax1.set_title("Original Image")
    ax1.axis('off')
    
    # Create a text box with prediction information
    disease = prediction.get('prediction', 'Unknown')
    confidence = prediction.get('confidence', 0)
    treatments = prediction.get('treatments', [])
    
    text = f"Prediction: {disease}\nConfidence: {confidence*100:.1f}%\n\nTreatments:"
    for i, treatment in enumerate(treatments, 1):
        text += f"\n{i}. {treatment}"
    
    ax2.text(0.1, 0.5, text, ha='left', va='center', wrap=True, fontsize=10)
    ax2.axis('off')
    
    # Save the visualization to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='jpg', bbox_inches='tight')
    plt.close()
    
    # Create a PIL image from the BytesIO object
    buf.seek(0)
    result_img = Image.open(buf)
    
    return result_img

def extract_features(image: Union[str, Image.Image, np.ndarray],
                     feature_extractor=None) -> np.ndarray:
    """
    Extract features from an image using a pre-trained model.
    
    Args:
        image: Image as PIL Image, numpy array or file path
        feature_extractor: Pre-trained model for feature extraction
        
    Returns:
        Feature vector as numpy array
    """
    # If no feature extractor provided, use MobileNetV2
    if feature_extractor is None:
        feature_extractor = tf.keras.applications.MobileNetV2(
            include_top=False,
            weights='imagenet',
            pooling='avg'
        )
    
    # Preprocess the image
    if isinstance(image, str):
        img_array = load_image_from_path(image)
    elif isinstance(image, Image.Image):
        img_array = preprocess_image(image)
    elif isinstance(image, np.ndarray):
        # Assume image is already preprocessed
        if len(image.shape) == 3:
            img_array = np.expand_dims(image, axis=0)
        else:
            img_array = image
    
    # Extract features
    features = feature_extractor.predict(img_array)
    
    return features