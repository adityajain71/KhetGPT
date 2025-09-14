import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
import base64
from typing import Dict, Any, List, Tuple, Union
import os
from pathlib import Path

def create_disease_visualization(
    image: Union[str, Image.Image, np.ndarray],
    prediction: Dict[str, Any]
) -> Image.Image:
    """
    Create a visualization of the crop disease prediction.
    
    Args:
        image: Original image path, PIL Image, or numpy array
        prediction: Dictionary containing prediction results
        
    Returns:
        PIL Image with visualization
    """
    # Load the image if it's a file path
    if isinstance(image, str):
        img = Image.open(image)
    elif isinstance(image, np.ndarray):
        img = Image.fromarray(image)
    else:
        img = image
    
    # Create a figure with two subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
    
    # Display the original image
    ax1.imshow(img)
    ax1.set_title("Original Image")
    ax1.axis('off')
    
    # Create a text box with prediction information
    disease = prediction.get('prediction', 'Unknown')
    confidence = prediction.get('confidence', 0)
    treatments = prediction.get('treatments', [])
    
    # Format the disease name for display
    disease_display = disease.replace('_', ' ').title()
    
    # Set color based on disease status
    title_color = 'green' if disease == 'healthy' else 'red'
    
    # Add disease prediction and confidence
    text = f"Prediction: {disease_display}\n"
    text += f"Confidence: {confidence*100:.1f}%\n\n"
    
    # Add treatment recommendations
    text += "Recommended Treatments:"
    for i, treatment in enumerate(treatments, 1):
        text += f"\n{i}. {treatment}"
    
    # Set the text in the right subplot
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.5)
    ax2.text(0.05, 0.95, text, transform=ax2.transAxes, fontsize=12,
             verticalalignment='top', bbox=props)
    
    # Add a title to the right subplot
    ax2.set_title("Analysis Results", color=title_color, fontsize=14)
    ax2.axis('off')
    
    # Adjust the layout
    plt.tight_layout()
    
    # Save the visualization to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='jpg', dpi=150, bbox_inches='tight')
    plt.close(fig)
    
    # Create a PIL image from the BytesIO object
    buf.seek(0)
    result_img = Image.open(buf)
    
    return result_img

def generate_report(
    image_path: str,
    prediction: Dict[str, Any],
    output_path: str = None
) -> str:
    """
    Generate a detailed report with the disease prediction and recommendations.
    
    Args:
        image_path: Path to the original image
        prediction: Dictionary containing prediction results
        output_path: Path to save the report. If None, a default path will be used.
        
    Returns:
        Path to the saved report
    """
    # Create the visualization
    img = Image.open(image_path)
    viz_image = create_disease_visualization(img, prediction)
    
    # Create an HTML report
    disease = prediction.get('prediction', 'Unknown').replace('_', ' ').title()
    confidence = prediction.get('confidence', 0)
    treatments = prediction.get('treatments', [])
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Crop Disease Report</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            .report-container {{
                max-width: 900px;
                margin: 0 auto;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .report-header {{
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
                margin-bottom: 20px;
            }}
            h1 {{
                color: {'green' if disease.lower() == 'healthy' else '#d9534f'};
            }}
            .report-image {{
                width: 100%;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .report-section {{
                margin-bottom: 30px;
            }}
            .confidence-bar {{
                height: 20px;
                background: #e9ecef;
                border-radius: 10px;
                overflow: hidden;
                margin: 10px 0;
            }}
            .confidence-level {{
                height: 100%;
                background: {'#28a745' if disease.lower() == 'healthy' else '#d9534f'};
                width: {confidence*100}%;
                border-radius: 10px;
            }}
            .treatment-item {{
                padding: 10px;
                background: #fff;
                border-left: 4px solid {'#28a745' if disease.lower() == 'healthy' else '#d9534f'};
                margin-bottom: 10px;
                border-radius: 0 5px 5px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 40px;
                color: #777;
                font-size: 0.8em;
            }}
        </style>
    </head>
    <body>
        <div class="report-container">
            <div class="report-header">
                <h1>Crop Disease Analysis Report</h1>
                <p>Generated on {datetime.now().strftime('%B %d, %Y at %H:%M')}</p>
            </div>
            
            <div class="report-section">
                <h2>Analysis Results</h2>
                <p><strong>Detected Condition:</strong> {disease}</p>
                <p><strong>Confidence Level:</strong> {confidence*100:.1f}%</p>
                <div class="confidence-bar">
                    <div class="confidence-level"></div>
                </div>
            </div>
            
            <div class="report-section">
    """
    
    # Convert the visualization to base64 for embedding in the HTML
    buffered = io.BytesIO()
    viz_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    html_content += f"""
                <img src="data:image/jpeg;base64,{img_str}" alt="Crop Analysis" class="report-image">
            </div>
            
            <div class="report-section">
                <h2>Recommended Treatments</h2>
    """
    
    if disease.lower() == 'healthy':
        html_content += """
                <div class="treatment-item">
                    <p>Your crop appears healthy. Continue with regular maintenance and monitoring.</p>
                </div>
        """
    else:
        for treatment in treatments:
            html_content += f"""
                <div class="treatment-item">
                    <p>{treatment}</p>
                </div>
            """
    
    html_content += """
            </div>
            
            <div class="footer">
                <p>This report was automatically generated by the KhetGPT Crop Disease Detection System.</p>
                <p>Please consult with an agricultural expert before applying any treatments.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Determine output path if not provided
    if output_path is None:
        report_dir = Path("app/ml_models/crop_disease/reports")
        report_dir.mkdir(exist_ok=True, parents=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = str(report_dir / f"report_{timestamp}.html")
    
    # Write the HTML content to a file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    return output_path


def export_visualization(
    image: Union[str, Image.Image],
    prediction: Dict[str, Any],
    output_path: str = None,
    format: str = 'jpg'
) -> str:
    """
    Export the visualization to an image file.
    
    Args:
        image: Original image path or PIL Image
        prediction: Dictionary containing prediction results
        output_path: Path to save the visualization. If None, a default path will be used.
        format: Image format to save as (jpg, png, etc.)
        
    Returns:
        Path to the saved visualization
    """
    # Create the visualization
    viz_image = create_disease_visualization(image, prediction)
    
    # Determine output path if not provided
    if output_path is None:
        viz_dir = Path("app/ml_models/crop_disease/visualizations")
        viz_dir.mkdir(exist_ok=True, parents=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = str(viz_dir / f"viz_{timestamp}.{format}")
    
    # Save the image
    viz_image.save(output_path, format=format.upper())
    
    return output_path


# Import datetime at the top if not already imported
from datetime import datetime