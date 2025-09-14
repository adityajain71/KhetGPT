import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
import sys

# Import model directly since we're already in the crop_disease directory
from model import CropDiseaseModel

# Define constants
IMG_SIZE = 224  # Must match the size in model.py
BATCH_SIZE = 32
EPOCHS = 20
DATASET_PATH = Path(__file__).parent / "dataset"

def train_crop_disease_model():
    """Train the crop disease detection model using the provided dataset."""
    
    # Set up data generators with augmentation for training
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
    
    # Just rescaling for validation data
    validation_datagen = ImageDataGenerator(rescale=1./255)
    
    # Find the training and validation directories
    train_dir = DATASET_PATH / "train" / "Train"
    validation_dir = DATASET_PATH / "validation" / "Validation"
    
    # Create the data generators
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
    
    # Get the class names and count
    class_names = list(train_generator.class_indices.keys())
    num_classes = len(class_names)
    print(f"Training with {num_classes} classes: {class_names}")
    
    # Initialize and build the model
    model_instance = CropDiseaseModel()
    model = model_instance.build_model(num_classes=num_classes)
    
    # Save class names
    model_instance.class_names = class_names
    
    # Set up callbacks for training
    checkpoint_path = str(Path(__file__).parent / "crop_disease_model.h5")
    checkpoint = ModelCheckpoint(
        checkpoint_path,
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    
    # Train the model
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=validation_generator,
        callbacks=[checkpoint, early_stopping]
    )
    
    # Save the model with class names
    model_instance.save_model(checkpoint_path)
    
    # Plot and save training results
    plot_training_results(history, str(Path(__file__).parent / "training_results.png"))
    
    print(f"Model saved to {checkpoint_path}")
    print(f"Class names: {class_names}")
    
    return model, history, class_names

def plot_training_results(history, save_path=None):
    """Plot and optionally save the training results."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Accuracy plot
    ax1.plot(history.history['accuracy'], label='Train')
    ax1.plot(history.history['val_accuracy'], label='Validation')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend()
    
    # Loss plot
    ax2.plot(history.history['loss'], label='Train')
    ax2.plot(history.history['val_loss'], label='Validation')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend()
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path)
        print(f"Training plot saved to {save_path}")
    
    plt.show()

if __name__ == "__main__":
    print("Starting model training...")
    model, history, class_names = train_crop_disease_model()
    print("Training complete!")