import requests
import os
from pathlib import Path

# Define the API endpoint URL
API_URL = "http://localhost:8000/api/public/predict-disease"

# Get the current directory
current_dir = Path(__file__).parent.absolute()
print(f"Current directory: {current_dir}")

# Find a jpg file in the current directory to use as test
test_files = list(current_dir.glob("*.jpg"))
if test_files:
    test_image_path = test_files[0]
    print(f"Found image file: {test_image_path}")
else:
    # Try looking in the frontend public images directory
    frontend_dir = Path(current_dir).parent / "khedgpt-frontend" / "public" / "images"
    if frontend_dir.exists():
        test_files = list(frontend_dir.glob("*.jpg"))
        if test_files:
            test_image_path = test_files[0]
            print(f"Found image file in frontend directory: {test_image_path}")
        else:
            print(f"No jpg files found in {frontend_dir}")
            exit(1)
    else:
        print(f"Frontend directory not found: {frontend_dir}")
        exit(1)

# Check if the image file exists
if not test_image_path.exists():
    print(f"Error: Test image file not found at {test_image_path}")
    exit(1)

print(f"Using test image: {test_image_path}")

# Prepare the files parameter for the request
files = {
    'file': (test_image_path.name, open(test_image_path, 'rb'), 'image/jpeg')
}

print(f"Sending request to {API_URL} with image {test_image_path}")

# Make the POST request
try:
    response = requests.post(API_URL, files=files)
    
    # Check if the request was successful
    if response.status_code == 200:
        print("Request successful!")
        print("Response content:")
        print(response.json())
    else:
        print(f"Request failed with status code: {response.status_code}")
        print("Response content:")
        print(response.text)
except Exception as e:
    print(f"Error sending request: {str(e)}")