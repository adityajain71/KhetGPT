"""
AgriSense: AI-Powered Agricultural Monitoring Platform

This is the main entry point for the AgriSense application.
"""

import os
import sys
import logging
from datetime import datetime
import argparse

# Add the src directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.data_acquisition.data_collector import DataCollector
from src.image_processing.image_processor import ImageProcessor
from src.ml_models.model_manager import ModelManager
from src.visualization.dashboard import Dashboard

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f"logs/agrisense_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='AgriSense - AI-Powered Agricultural Monitoring Platform')
    parser.add_argument('--config', type=str, default='config/default.yaml',
                        help='Path to configuration file')
    parser.add_argument('--mode', type=str, choices=['full', 'analysis', 'visualization'],
                        default='full', help='Operation mode')
    parser.add_argument('--input-dir', type=str, help='Directory containing input data')
    parser.add_argument('--output-dir', type=str, default='output',
                        help='Directory to save results')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    
    return parser.parse_args()

def setup_environment():
    """Set up the necessary environment for the application."""
    # Create output directory if it doesn't exist
    os.makedirs('output', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Check for required dependencies
    try:
        import numpy
        import pandas
        import tensorflow
        logger.info("Core dependencies verified.")
    except ImportError as e:
        logger.error(f"Missing dependency: {e}")
        logger.info("Please install all required dependencies using: pip install -r requirements.txt")
        sys.exit(1)

def main():
    """Main function to run the AgriSense platform."""
    args = parse_arguments()
    
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
        
    logger.info("Starting AgriSense platform...")
    
    # Setup environment
    setup_environment()
    
    try:
        # Initialize components
        data_collector = DataCollector(config_path=args.config)
        image_processor = ImageProcessor()
        model_manager = ModelManager()
        dashboard = Dashboard()
        
        if args.mode in ['full', 'analysis']:
            # Collect and process data
            logger.info("Collecting data...")
            data = data_collector.collect_data(args.input_dir)
            
            logger.info("Processing images...")
            processed_images = image_processor.process_images(data['images'])
            
            logger.info("Analyzing data with AI models...")
            results = model_manager.analyze(processed_images, data['sensor_data'])
            
            # Save results
            output_path = os.path.join(args.output_dir, f"analysis_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
            model_manager.save_results(results, output_path)
            logger.info(f"Results saved to {output_path}")
        
        if args.mode in ['full', 'visualization']:
            # Launch dashboard
            logger.info("Starting visualization dashboard...")
            dashboard.run()
            
        logger.info("AgriSense platform execution completed successfully.")
        
    except Exception as e:
        logger.error(f"Error during execution: {e}", exc_info=True)
        return 1
        
    return 0

if __name__ == "__main__":
    sys.exit(main())