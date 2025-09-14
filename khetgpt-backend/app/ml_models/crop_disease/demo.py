import os
import sys
import argparse
from pathlib import Path
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import tensorflow as tf
import time

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent.parent))

# Import our model
from app.ml_models.crop_disease.model import CropDiseaseModel
from app.ml_models.crop_disease.visualization import create_disease_visualization, generate_report

def parse_args():
    parser = argparse.ArgumentParser(description='Crop Disease Detection Demo')
    parser.add_argument('--image', '-i', type=str, required=False, 
                        help='Path to the image to analyze')
    parser.add_argument('--model', '-m', type=str, required=False, 
                        default=None, help='Path to a saved model')
    parser.add_argument('--train', '-t', action='store_true',
                        help='Train a new model')
    parser.add_argument('--train_data', type=str, required=False,
                        help='Path to training data directory')
    parser.add_argument('--val_data', type=str, required=False,
                        help='Path to validation data directory')
    parser.add_argument('--epochs', '-e', type=int, default=15,
                        help='Number of epochs for training')
    parser.add_argument('--save', '-s', type=str, required=False,
                        help='Path to save the trained model')
    return parser.parse_args()

def main():
    args = parse_args()
    
    # Initialize the model
    model = CropDiseaseModel(model_path=args.model)
    
    # Training mode
    if args.train:
        if not args.train_data or not args.val_data:
            print("Error: Training and validation data paths must be provided for training.")
            return
        
        print(f"Training model with {args.epochs} epochs...")
        train_dir = args.train_data
        val_dir = args.val_data
        
        # Train the model
        history = model.train(train_dir, val_dir, epochs=args.epochs)
        
        # Visualize training
        model.visualize_training(history)
        
        # Save the model if a save path is provided
        if args.save:
            model.save_model(args.save)
            print(f"Model saved to {args.save}")
    
    # Prediction mode
    elif args.image:
        if not os.path.exists(args.image):
            print(f"Error: Image file {args.image} not found.")
            return
        
        print("Analyzing image...")
        # Open the image
        img = Image.open(args.image)
        
        # Make prediction
        start_time = time.time()
        prediction = model.predict(img)
        end_time = time.time()
        
        # Print results
        print("\nResults:")
        print(f"Prediction: {prediction['prediction']}")
        print(f"Confidence: {prediction['confidence']:.2%}")
        print(f"Processing time: {end_time - start_time:.3f} seconds")
        
        print("\nRecommended treatments:")
        for i, treatment in enumerate(prediction['treatments'], 1):
            print(f"{i}. {treatment}")
        
        # Create visualization
        print("\nCreating visualization...")
        viz = create_disease_visualization(img, prediction)
        
        # Display the visualization
        plt.figure(figsize=(12, 6))
        plt.imshow(viz)
        plt.axis('off')
        plt.tight_layout()
        plt.show()
        
        # Generate HTML report
        report_path = generate_report(args.image, prediction)
        print(f"\nHTML report generated: {report_path}")
        
    else:
        print("Error: Either --image or --train flag must be provided.")
        print("Use --help for more information.")

if __name__ == "__main__":
    main()