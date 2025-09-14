import tensorflow as tf
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.applications import MobileNetV2, ResNet50
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from pathlib import Path
import matplotlib.pyplot as plt
import os
import random
from typing import Dict, Any, Tuple, List
from PIL import Image

# Define constants
IMG_SIZE = 224  # Standard input size for many pre-trained models
BATCH_SIZE = 32
EPOCHS = 15

class CropDiseaseModel:
    def __init__(self, model_path: str = None):
        """
        Initialize the crop disease detection model.
        
        Args:
            model_path: Path to a saved model. If provided, the model will be loaded from this path.
        """
        self.model = None
        self.class_names = []
        self.model_path = model_path
        self.treatments = {
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
            ],
            # Legacy treatments kept for reference
            "bacterial_leaf_blight": [
                "Use copper-based bactericides",
                "Ensure proper field drainage",
                "Practice crop rotation"
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
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path)
        
    def build_model(self, num_classes: int):
        """
        Build and compile the CNN model architecture.
        
        Args:
            num_classes: Number of disease categories to classify
            
        Returns:
            The compiled Keras model
        """
        # Use MobileNetV2 as base model (lightweight but effective)
        base_model = MobileNetV2(
            input_shape=(IMG_SIZE, IMG_SIZE, 3),
            include_top=False,
            weights='imagenet'
        )
        
        # Freeze the base model layers
        base_model.trainable = False
        
        # Build the model on top of MobileNetV2
        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.2),  # Add dropout for regularization
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dense(num_classes, activation='softmax')
        ])
        
        # Compile the model
        model.compile(
            optimizer=optimizers.Adam(learning_rate=0.001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        self.model = model
        return model
    
    def load_model(self, model_path: str):
        """
        Load a pre-trained model.
        
        Args:
            model_path: Path to the saved model
        """
        try:
            self.model = tf.keras.models.load_model(model_path)
            # Try to load class names if available
            class_names_path = Path(model_path).parent / "class_names.txt"
            if class_names_path.exists():
                with open(class_names_path, "r") as f:
                    self.class_names = [line.strip() for line in f.readlines()]
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
    
    def save_model(self, save_path: str):
        """
        Save the trained model.
        
        Args:
            save_path: Path where to save the model
        """
        if self.model is not None:
            self.model.save(save_path)
            
            # Save class names alongside the model
            class_names_path = Path(save_path).parent / "class_names.txt"
            with open(class_names_path, "w") as f:
                for class_name in self.class_names:
                    f.write(f"{class_name}\n")
                    
            print(f"Model saved to {save_path}")
    
    def train(self, train_dir: str, validation_dir: str, epochs: int = EPOCHS):
        """
        Train the model on the provided dataset.
        
        Args:
            train_dir: Directory containing training images organized in class folders
            validation_dir: Directory containing validation images organized in class folders
            epochs: Number of training epochs
            
        Returns:
            Training history
        """
        # Create data generators for data augmentation and normalization
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        
        validation_datagen = ImageDataGenerator(rescale=1./255)
        
        # Create data generators
        train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical'
        )
        
        validation_generator = validation_datagen.flow_from_directory(
            validation_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical'
        )
        
        # Get class names from the generator
        self.class_names = list(train_generator.class_indices.keys())
        num_classes = len(self.class_names)
        
        # Build the model if not already built
        if self.model is None:
            self.build_model(num_classes)
        
        # Train the model
        history = self.model.fit(
            train_generator,
            steps_per_epoch=train_generator.samples // BATCH_SIZE,
            epochs=epochs,
            validation_data=validation_generator,
            validation_steps=validation_generator.samples // BATCH_SIZE
        )
        
        return history
    
    def evaluate(self, test_dir: str):
        """
        Evaluate the model on test data.
        
        Args:
            test_dir: Directory containing test images organized in class folders
            
        Returns:
            Test loss and accuracy
        """
        if self.model is None:
            raise ValueError("Model has not been built or loaded yet.")
        
        test_datagen = ImageDataGenerator(rescale=1./255)
        
        test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size=(IMG_SIZE, IMG_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical'
        )
        
        return self.model.evaluate(test_generator)
    
    def predict(self, image):
        """
        Make a prediction for a single image.
        
        Args:
            image: PIL Image object or path to image file
            
        Returns:
            Dictionary containing prediction results
        """
        if self.model is None:
            raise ValueError("Model has not been built or loaded yet.")
            
        # If image is a string (file path), open it
        if isinstance(image, str):
            image = Image.open(image)
            print(f"Loaded image from path: {image.format}, {image.mode}, {image.size}")
        else:
            print(f"Image provided as object: {image.format}, {image.mode}, {image.size}")
        
        # Preprocess the image
        if image.mode != "RGB":
            print(f"Converting image from {image.mode} to RGB")
            image = image.convert("RGB")
        
        # Resize image
        original_size = image.size
        image = image.resize((IMG_SIZE, IMG_SIZE))
        print(f"Resized image from {original_size} to {image.size}")
        
        # Convert to array and normalize
        img_array = np.array(image) / 255.0
        print(f"Image array shape: {img_array.shape}, range: [{img_array.min():.2f}, {img_array.max():.2f}]")
        
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        print(f"Expanded array shape: {img_array.shape}")
        
        # Make prediction
        print(f"Running prediction with model: {type(self.model)}")
        predictions = self.model.predict(img_array, verbose=1)
        print(f"Raw predictions shape: {predictions.shape}")
        print(f"Raw prediction values: {predictions[0]}")
        
        # Get highest probability class
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        
        # Get all probabilities for analysis
        class_probabilities = [(i, float(predictions[0][i])) for i in range(len(predictions[0]))]
        sorted_probs = sorted(class_probabilities, key=lambda x: x[1], reverse=True)
        print(f"All class probabilities (sorted):")
        for idx, prob in sorted_probs:
            class_name = self.class_names[idx] if idx < len(self.class_names) else f"class_{idx}"
            print(f"  {class_name}: {prob:.4f}")
        
        # Get class name if available
        if self.class_names and predicted_class_idx < len(self.class_names):
            predicted_class = self.class_names[predicted_class_idx]
            print(f"Mapped to class name: {predicted_class} (index {predicted_class_idx})")
        else:
            predicted_class = f"class_{predicted_class_idx}"
            print(f"No class name mapping available, using: {predicted_class}")
        
        print(f"Final prediction: {predicted_class} with confidence {confidence:.4f}")
        
        # Get treatments for the predicted disease - handling case sensitivity
        disease_treatments = None
        print(f"Looking for treatments for '{predicted_class}'")
        print(f"Available treatment categories: {list(self.treatments.keys())}")
        
        for disease, treatments in self.treatments.items():
            print(f"Comparing '{disease.lower()}' with '{predicted_class.lower()}'")
            if disease.lower() == predicted_class.lower():
                disease_treatments = treatments
                print(f"Found matching treatments: {treatments}")
                break
        
        if disease_treatments is None:
            disease_treatments = ["No specific treatment information available."]
            print(f"No treatments found for {predicted_class}, using default")
        
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "treatments": disease_treatments
        }
    
    def visualize_training(self, history):
        """
        Visualize training and validation metrics.
        
        Args:
            history: Training history object from model.fit()
        """
        acc = history.history['accuracy']
        val_acc = history.history['val_accuracy']
        loss = history.history['loss']
        val_loss = history.history['val_loss']
        
        epochs_range = range(len(acc))
        
        plt.figure(figsize=(12, 4))
        
        plt.subplot(1, 2, 1)
        plt.plot(epochs_range, acc, label='Training Accuracy')
        plt.plot(epochs_range, val_acc, label='Validation Accuracy')
        plt.title('Accuracy')
        plt.xlabel('Epoch')
        plt.ylabel('Accuracy')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        plt.plot(epochs_range, loss, label='Training Loss')
        plt.plot(epochs_range, val_loss, label='Validation Loss')
        plt.title('Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        
        plt.tight_layout()
        plt.show()


def predict_disease(image):
    """
    Function to be imported by the API for making predictions.
    
    Args:
        image: PIL Image object
        
    Returns:
        Dictionary containing prediction results
    """
    import logging
    logger = logging.getLogger("crop_disease")
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    
    logger.info("Starting crop disease prediction")
    
    # Path to the saved model - using absolute path for reliability
    model_dir = Path(__file__).parent.absolute()
    model_path = model_dir / "crop_disease_model.h5"
    logger.info(f"Looking for model at: {model_path}")
    
    # If model doesn't exist yet, return mock data
    if not model_path.exists():
        logger.warning(f"Model not found at {model_path}, using mock data")
        # Return mock data for now
        mock_diseases = ["Healthy", "Powdery", "Rust"]
        mock_disease = np.random.choice(mock_diseases)
        
        mock_treatments = {
            "Healthy": ["No treatment needed."],
            "Powdery": [
                "Apply fungicides with sulfur or potassium bicarbonate",
                "Ensure proper air circulation around plants",
                "Remove and dispose of infected plant parts",
                "Use neem oil as a natural alternative"
            ],
            "Rust": [
                "Apply fungicides containing tebuconazole or chlorothalonil",
                "Remove and destroy infected plant material",
                "Improve air circulation by proper spacing",
                "Avoid overhead irrigation to keep foliage dry"
            ]
        }
        
        return {
            "prediction": mock_disease,
            "confidence": round(random.uniform(0.7, 0.98), 2),
            "treatments": mock_treatments[mock_disease]
        }
    
    # Load the model and make a prediction
    model = CropDiseaseModel(model_path=str(model_path))
    return model.predict(image)


def train_model(train_dir, validation_dir, test_dir=None, save_path=None):
    """
    Train a new crop disease detection model.
    
    Args:
        train_dir: Directory containing training images
        validation_dir: Directory containing validation images
        test_dir: Directory containing test images (optional)
        save_path: Path to save the trained model (optional)
        
    Returns:
        Trained model and evaluation metrics
    """
    # Initialize the model
    model = CropDiseaseModel()
    
    # Train the model
    history = model.train(train_dir, validation_dir)
    
    # Evaluate on test set if provided
    eval_results = None
    if test_dir:
        eval_results = model.evaluate(test_dir)
        print(f"Test accuracy: {eval_results[1]:.4f}")
    
    # Save the model if path provided
    if save_path:
        model.save_model(save_path)
    
    return model, history, eval_results