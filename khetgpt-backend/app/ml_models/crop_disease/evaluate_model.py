import os
import tensorflow as tf
import numpy as np
from pathlib import Path
import sys
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns

# Import model directly since we're already in the crop_disease directory
from model import CropDiseaseModel

# Define constants
IMG_SIZE = 224  # Must match the size in model.py
BATCH_SIZE = 32
DATASET_PATH = Path(__file__).parent / "dataset"

def evaluate_model(model_path=None):
    """Evaluate the trained model on test data."""
    
    if model_path is None:
        model_path = str(Path(__file__).parent / "crop_disease_model.h5")
    
    # Check if model exists
    if not Path(model_path).exists():
        print(f"Error: Model not found at {model_path}")
        print("Please train the model first using train_model.py")
        return
    
    # Load the trained model
    model_instance = CropDiseaseModel(model_path=model_path)
    model = model_instance.model
    
    if model is None:
        print("Error: Failed to load the model")
        return
    
    # Print the class names
    print(f"Class names: {model_instance.class_names}")
    
    # Set up test data generator
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    # Find the test directory - check both possible locations
    test_dir = DATASET_PATH / "test" / "Test" / "Test"
    if not test_dir.exists():
        test_dir = DATASET_PATH / "test" / "Test"
        if not test_dir.exists():
            print("Error: Test directory not found")
            return
    
    # Create the test generator
    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False  # Don't shuffle for proper label matching
    )
    
    # Evaluate the model
    print("Evaluating model on test data...")
    scores = model.evaluate(test_generator)
    print(f"Test Loss: {scores[0]:.4f}")
    print(f"Test Accuracy: {scores[1]:.4f}")
    
    # Get predictions for all test images
    num_samples = test_generator.samples
    steps = int(np.ceil(num_samples / BATCH_SIZE))
    predictions = model.predict(test_generator, steps=steps)
    predicted_classes = np.argmax(predictions, axis=1)
    
    # Get the true labels
    true_classes = test_generator.classes
    class_labels = list(test_generator.class_indices.keys())
    
    # Compute the confusion matrix
    cm = confusion_matrix(true_classes, predicted_classes)
    
    # Print classification report
    print("\nClassification Report:")
    print(classification_report(true_classes, predicted_classes, target_names=class_labels))
    
    # Plot confusion matrix
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_labels, yticklabels=class_labels)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    
    # Save the plot
    plt.savefig(str(Path(__file__).parent / "confusion_matrix.png"))
    print(f"Confusion matrix saved to {str(Path(__file__).parent / 'confusion_matrix.png')}")
    
    # Show the plot
    plt.show()

if __name__ == "__main__":
    evaluate_model()