import sys
import os
from pathlib import Path
import unittest
import numpy as np
from PIL import Image

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

# Import our model
from app.ml_models.crop_disease.model import CropDiseaseModel, predict_disease
from app.ml_models.crop_disease.image_utils import preprocess_image

class TestCropDiseaseModel(unittest.TestCase):
    """Test cases for the Crop Disease Detection model."""
    
    def test_model_initialization(self):
        """Test that the model initializes correctly."""
        model = CropDiseaseModel()
        self.assertIsNone(model.model)  # Model should be None until built
        self.assertEqual(model.class_names, [])
        self.assertIsInstance(model.treatments, dict)
        
    def test_model_build(self):
        """Test that the model builds correctly."""
        model = CropDiseaseModel()
        built_model = model.build_model(num_classes=3)  # Using 3 classes: Healthy, Powdery, Rust
        self.assertIsNotNone(built_model)
        self.assertIsNotNone(model.model)
        
    def test_image_preprocessing(self):
        """Test image preprocessing."""
        # Create a simple test image
        test_img = Image.new('RGB', (300, 300), color = 'red')
        img_array = preprocess_image(test_img)
        
        # Check shape and normalization
        self.assertEqual(img_array.shape, (1, 224, 224, 3))
        self.assertTrue(np.max(img_array) <= 1.0)
        self.assertTrue(np.min(img_array) >= 0.0)
        
    def test_predict_without_model(self):
        """Test that prediction raises error when model is not built."""
        model = CropDiseaseModel()  # No model loaded
        test_img = Image.new('RGB', (300, 300), color = 'red')
        
        with self.assertRaises(ValueError):
            model.predict(test_img)
    
    def test_predict_disease_function(self):
        """Test the predict_disease function without a model (should return mock data)."""
        test_img = Image.new('RGB', (300, 300), color = 'red')
        result = predict_disease(test_img)
        
        # Check that the function returns the expected keys
        self.assertIn('prediction', result)
        self.assertIn('confidence', result)
        self.assertIn('treatments', result)
        
        # Since we're using mock data, confidence should be between 0.7 and 0.98
        self.assertTrue(0.7 <= result['confidence'] <= 0.98)
        
    def test_save_and_load_model(self):
        """Test saving and loading a model (only if TensorFlow is available)."""
        try:
            import tensorflow as tf
            
            # Create and build a model
            model = CropDiseaseModel()
            model.build_model(num_classes=3)
            model.class_names = ["Healthy", "Powdery", "Rust"]
            
            # Save to a temporary file
            temp_model_path = "temp_test_model.h5"
            model.save_model(temp_model_path)
            
            # Check that the file was created
            self.assertTrue(Path(temp_model_path).exists())
            
            # Check that the class names file was created
            self.assertTrue((Path("temp_test_model.h5").parent / "class_names.txt").exists())
            
            # Load the model back
            new_model = CropDiseaseModel(model_path=temp_model_path)
            self.assertIsNotNone(new_model.model)
            self.assertEqual(new_model.class_names, model.class_names)
            
            # Clean up
            Path(temp_model_path).unlink(missing_ok=True)
            (Path(temp_model_path).parent / "class_names.txt").unlink(missing_ok=True)
            
        except ImportError:
            self.skipTest("TensorFlow not available, skipping test_save_and_load_model")


if __name__ == "__main__":
    unittest.main()