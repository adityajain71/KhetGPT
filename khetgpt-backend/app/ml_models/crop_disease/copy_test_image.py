import shutil
from pathlib import Path

# Source image path - using an image from the frontend public folder
source_image = Path("../../khedgpt-frontend/public/images/seedling.jpg")

# Destination path
dest_dir = Path("test_images")
dest_dir.mkdir(exist_ok=True)
dest_path = dest_dir / "sample.jpg"

# Copy the image
if source_image.exists():
    shutil.copy(source_image, dest_path)
    print(f"Copied {source_image} to {dest_path}")
else:
    print(f"Source image not found: {source_image}")