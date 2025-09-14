import os
import shutil
from pathlib import Path
import random
import numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from typing import List, Tuple, Dict, Union, Optional

def create_dataset_structure(
    base_dir: str,
    class_names: List[str]
) -> Dict[str, str]:
    """
    Create a standard dataset directory structure.
    
    Args:
        base_dir: Base directory for the dataset
        class_names: List of class names (folder names)
        
    Returns:
        Dictionary with paths to train, validation, and test directories
    """
    # Create base directory if it doesn't exist
    base_path = Path(base_dir)
    base_path.mkdir(exist_ok=True, parents=True)
    
    # Create train, validation, and test directories
    train_dir = base_path / "train"
    val_dir = base_path / "validation"
    test_dir = base_path / "test"
    
    train_dir.mkdir(exist_ok=True)
    val_dir.mkdir(exist_ok=True)
    test_dir.mkdir(exist_ok=True)
    
    # Create class subdirectories in each split
    for class_name in class_names:
        (train_dir / class_name).mkdir(exist_ok=True)
        (val_dir / class_name).mkdir(exist_ok=True)
        (test_dir / class_name).mkdir(exist_ok=True)
    
    return {
        "base_dir": str(base_path),
        "train_dir": str(train_dir),
        "val_dir": str(val_dir),
        "test_dir": str(test_dir)
    }

def split_dataset(
    source_dir: str,
    output_dir: str,
    train_ratio: float = 0.7,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    random_state: int = 42
) -> Dict[str, str]:
    """
    Split a dataset into train, validation, and test sets.
    
    Args:
        source_dir: Directory with original data organized in class subfolders
        output_dir: Directory to output the split dataset
        train_ratio: Proportion of data for training
        val_ratio: Proportion of data for validation
        test_ratio: Proportion of data for testing
        random_state: Random seed for reproducibility
        
    Returns:
        Dictionary with paths to train, validation, and test directories
    """
    # Validate the ratios
    if abs(train_ratio + val_ratio + test_ratio - 1.0) > 1e-10:
        raise ValueError("Train, validation, and test ratios must sum to 1.")
    
    source_path = Path(source_dir)
    if not source_path.exists() or not source_path.is_dir():
        raise ValueError(f"Source directory {source_dir} does not exist or is not a directory.")
    
    # Get class names from source directory
    class_names = [d.name for d in source_path.iterdir() if d.is_dir()]
    
    # Create dataset structure
    dataset_paths = create_dataset_structure(output_dir, class_names)
    
    # Process each class
    for class_name in class_names:
        class_dir = source_path / class_name
        image_files = [f for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        
        # Split the files
        train_files, temp_files = train_test_split(
            image_files, train_size=train_ratio, random_state=random_state
        )
        
        # Adjust the ratio for the remaining files
        val_test_ratio = val_ratio / (val_ratio + test_ratio)
        val_files, test_files = train_test_split(
            temp_files, train_size=val_test_ratio, random_state=random_state
        )
        
        # Copy files to their respective directories
        for file in train_files:
            shutil.copy2(file, Path(dataset_paths["train_dir"]) / class_name / file.name)
        
        for file in val_files:
            shutil.copy2(file, Path(dataset_paths["val_dir"]) / class_name / file.name)
        
        for file in test_files:
            shutil.copy2(file, Path(dataset_paths["test_dir"]) / class_name / file.name)
        
        print(f"Class {class_name}: {len(train_files)} train, {len(val_files)} validation, {len(test_files)} test")
    
    return dataset_paths

def augment_dataset(
    input_dir: str,
    output_dir: str = None,
    augmentation_factor: int = 5,
    random_state: int = 42
) -> str:
    """
    Augment a dataset by applying various transformations.
    
    Args:
        input_dir: Directory with original images organized in class subfolders
        output_dir: Directory to output the augmented dataset. If None, will append '_augmented' to input_dir
        augmentation_factor: Number of augmented images to generate per original image
        random_state: Random seed for reproducibility
        
    Returns:
        Path to the augmented dataset
    """
    random.seed(random_state)
    np.random.seed(random_state)
    
    input_path = Path(input_dir)
    if not input_path.exists() or not input_path.is_dir():
        raise ValueError(f"Input directory {input_dir} does not exist or is not a directory.")
    
    if output_dir is None:
        output_dir = str(input_path) + "_augmented"
    
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True, parents=True)
    
    # Get class names from input directory
    class_names = [d.name for d in input_path.iterdir() if d.is_dir()]
    
    # Create class subdirectories in output directory
    for class_name in class_names:
        (output_path / class_name).mkdir(exist_ok=True)
    
    # Define augmentation functions
    def random_rotation(img):
        return img.rotate(random.uniform(-30, 30))
    
    def random_flip(img):
        if random.choice([True, False]):
            return ImageOps.mirror(img)
        else:
            return img
    
    def random_brightness(img):
        factor = random.uniform(0.8, 1.2)
        return ImageEnhance.Brightness(img).enhance(factor)
    
    def random_contrast(img):
        factor = random.uniform(0.8, 1.2)
        return ImageEnhance.Contrast(img).enhance(factor)
    
    def random_color(img):
        factor = random.uniform(0.8, 1.2)
        return ImageEnhance.Color(img).enhance(factor)
    
    def random_sharpness(img):
        factor = random.uniform(0.8, 2.0)
        return ImageEnhance.Sharpness(img).enhance(factor)
    
    def add_noise(img):
        img_array = np.array(img).copy()
        noise = np.random.normal(0, 10, img_array.shape)
        noisy_img_array = np.clip(img_array + noise, 0, 255).astype(np.uint8)
        return Image.fromarray(noisy_img_array)
    
    def random_crop(img):
        width, height = img.size
        crop_size = min(width, height) * 0.8
        left = random.uniform(0, width - crop_size)
        top = random.uniform(0, height - crop_size)
        right = left + crop_size
        bottom = top + crop_size
        return img.crop((left, top, right, bottom)).resize((width, height))
    
    # List of augmentation functions
    augmentation_functions = [
        random_rotation,
        random_flip,
        random_brightness,
        random_contrast,
        random_color,
        random_sharpness,
        add_noise,
        random_crop
    ]
    
    # Process each class
    total_original = 0
    total_augmented = 0
    
    for class_name in class_names:
        class_dir = input_path / class_name
        output_class_dir = output_path / class_name
        image_files = [f for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        
        # Copy original images
        for file in image_files:
            shutil.copy2(file, output_class_dir / file.name)
        
        total_original += len(image_files)
        
        # Generate augmented images
        for i, file in enumerate(image_files):
            # Load the image
            img = Image.open(file)
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # Generate augmented images
            for j in range(augmentation_factor):
                # Apply random sequence of 2-4 augmentations
                num_augmentations = random.randint(2, 4)
                augmentation_seq = random.sample(augmentation_functions, num_augmentations)
                
                # Apply the augmentations
                augmented_img = img
                for aug_func in augmentation_seq:
                    augmented_img = aug_func(augmented_img)
                
                # Save the augmented image
                augmented_path = output_class_dir / f"{file.stem}_aug_{j}{file.suffix}"
                augmented_img.save(augmented_path)
                total_augmented += 1
            
            # Print progress
            if (i + 1) % 10 == 0:
                print(f"Processed {i+1}/{len(image_files)} images in class {class_name}")
    
    print(f"Dataset augmentation complete. {total_original} original images, {total_augmented} augmented images.")
    return str(output_path)

def visualize_dataset_samples(
    dataset_dir: str,
    samples_per_class: int = 5,
    random_state: int = 42
) -> None:
    """
    Visualize random samples from each class in a dataset.
    
    Args:
        dataset_dir: Directory with images organized in class subfolders
        samples_per_class: Number of samples to visualize per class
        random_state: Random seed for reproducibility
    """
    random.seed(random_state)
    
    dataset_path = Path(dataset_dir)
    if not dataset_path.exists() or not dataset_path.is_dir():
        raise ValueError(f"Dataset directory {dataset_dir} does not exist or is not a directory.")
    
    # Get class names from dataset directory
    class_names = [d.name for d in dataset_path.iterdir() if d.is_dir()]
    
    # Determine the grid size
    num_classes = len(class_names)
    fig, axs = plt.subplots(num_classes, samples_per_class, figsize=(samples_per_class*3, num_classes*3))
    
    for i, class_name in enumerate(class_names):
        class_dir = dataset_path / class_name
        image_files = [f for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        
        if len(image_files) < samples_per_class:
            print(f"Warning: Class {class_name} has fewer than {samples_per_class} images.")
            selected_files = image_files
        else:
            selected_files = random.sample(image_files, samples_per_class)
        
        for j, file in enumerate(selected_files):
            img = Image.open(file)
            
            # Handle grayscale images
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # Plot the image
            if num_classes == 1:
                axs[j].imshow(img)
                axs[j].set_title(f"{class_name}")
                axs[j].axis('off')
            else:
                axs[i, j].imshow(img)
                axs[i, j].set_title(f"{class_name}")
                axs[i, j].axis('off')
    
    plt.tight_layout()
    plt.show()

def display_dataset_stats(dataset_dir: str) -> Dict[str, Dict[str, int]]:
    """
    Display statistics about a dataset.
    
    Args:
        dataset_dir: Directory with images organized in class subfolders
        
    Returns:
        Dictionary with dataset statistics
    """
    dataset_path = Path(dataset_dir)
    if not dataset_path.exists() or not dataset_path.is_dir():
        raise ValueError(f"Dataset directory {dataset_dir} does not exist or is not a directory.")
    
    # Get class names from dataset directory
    class_names = [d.name for d in dataset_path.iterdir() if d.is_dir()]
    
    # Collect statistics
    stats = {}
    total_images = 0
    
    for class_name in class_names:
        class_dir = dataset_path / class_name
        image_files = [f for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
        stats[class_name] = len(image_files)
        total_images += len(image_files)
    
    # Print statistics
    print(f"Dataset Directory: {dataset_dir}")
    print(f"Total Classes: {len(class_names)}")
    print(f"Total Images: {total_images}")
    print("\nImages per Class:")
    for class_name, count in stats.items():
        print(f"  {class_name}: {count} images ({count/total_images*100:.1f}%)")
    
    return {
        "total_classes": len(class_names),
        "total_images": total_images,
        "class_distribution": stats
    }