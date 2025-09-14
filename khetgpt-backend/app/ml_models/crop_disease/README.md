# Crop Disease Detection Model

This directory contains the implementation of a Convolutional Neural Network (CNN) for crop disease detection. The model uses transfer learning with MobileNetV2 as a base model to identify diseases in crop images.

## Features

- Disease detection in crop images using deep learning
- Transfer learning with MobileNetV2 for efficient training
- Data augmentation for improved model generalization
- Treatment recommendations based on detected diseases
- Visualization tools for model analysis and reports
- Dataset utilities for preprocessing and augmentation

## Model Architecture

The model uses a pre-trained MobileNetV2 architecture with additional layers for classification:

1. MobileNetV2 base model (pre-trained on ImageNet)
2. Global Average Pooling
3. Dropout (0.2) for regularization
4. Dense layer (128 neurons, ReLU activation)
5. Batch Normalization
6. Output layer (softmax activation)

## Directory Structure

```
crop_disease/
│
├── model.py           # Main model implementation
├── image_utils.py     # Image processing utilities
├── dataset_utils.py   # Dataset preparation utilities
├── visualization.py   # Result visualization tools
├── demo.py            # Demo script for model usage
│
└── uploads/           # Directory for uploaded images
└── reports/           # Generated reports
└── visualizations/    # Generated visualizations
```

## Usage

### Training a Model

To train a new model:

```python
from app.ml_models.crop_disease.model import CropDiseaseModel

# Initialize the model
model = CropDiseaseModel()

# Train the model
history = model.train(
    train_dir="path/to/training/data",
    validation_dir="path/to/validation/data",
    epochs=15
)

# Save the model
model.save_model("path/to/save/model.h5")
```

### Making Predictions

To make predictions with a trained model:

```python
from app.ml_models.crop_disease.model import CropDiseaseModel
from PIL import Image

# Load a trained model
model = CropDiseaseModel(model_path="path/to/model.h5")

# Make a prediction on an image
image = Image.open("path/to/image.jpg")
prediction = model.predict(image)

print(f"Prediction: {prediction['prediction']}")
print(f"Confidence: {prediction['confidence']:.2f}")
print("Treatments:")
for treatment in prediction['treatments']:
    print(f"- {treatment}")
```

### Using the Demo Script

You can use the provided demo script for a quick demonstration:

```bash
# For prediction
python demo.py --image path/to/image.jpg --model path/to/model.h5

# For training
python demo.py --train --train_data path/to/train_data --val_data path/to/val_data --epochs 15 --save path/to/save/model.h5
```

## Dataset Preparation

The model expects data organized in the following structure:

```
data/
├── train/
│   ├── class1/
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── ...
│   ├── class2/
│   │   └── ...
│   └── ...
├── validation/
│   └── ...
└── test/ (optional)
    └── ...
```

You can use the dataset utilities to prepare your data:

```python
from app.ml_models.crop_disease.dataset_utils import split_dataset, augment_dataset

# Split an existing dataset
split_dataset(
    source_dir="path/to/original/data",
    output_dir="path/to/output",
    train_ratio=0.7,
    val_ratio=0.15,
    test_ratio=0.15
)

# Augment a dataset
augment_dataset(
    input_dir="path/to/data",
    output_dir="path/to/augmented/data",
    augmentation_factor=5
)
```

## Disease Classes and Treatments

The model can detect various crop diseases and provide treatment recommendations. Current supported diseases include:

- Healthy plants
- Bacterial leaf blight
- Brown spot
- Leaf blast

Additional diseases can be added by expanding the training dataset and updating the treatments dictionary in the model.

## Dependencies

- TensorFlow 2.x
- Keras
- NumPy
- Pillow (PIL)
- Matplotlib
- OpenCV
- scikit-learn
- scikit-image

## Extending the Model

To add support for new diseases:

1. Add training data for the new disease classes
2. Update the `treatments` dictionary in `model.py` with appropriate treatments
3. Retrain the model with the new data

## Performance Metrics

The model's performance can be evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

These metrics are calculated during evaluation and can be visualized using the visualization utilities.