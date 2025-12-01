// Fixed version of CropDiseaseDetection component
import React, { useState, useEffect, ChangeEvent, DragEvent, FormEvent } from 'react';
import axios from 'axios';
import './CropDiseaseDetection.css';

// Make sure API URL matches backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
console.log("API Base URL:", API_BASE_URL);

interface PredictionResult {
  filename?: string;
  prediction: string;
  confidence: number;
  possible_treatments: string[];
  image_url?: string;
}

const CropDiseaseDetection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string>('');
  
  // Add this for debugging
  useEffect(() => {
    console.log("Result state changed:", result);
  }, [result]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to analyze');
      return;
    }
    
    // Check if file is an image
    if (!selectedFile.type.match('image.*')) {
      setError('Please select a valid image file');
      return;
    }
    
    setIsAnalyzing(true);
    setError('');
    
    // Clear any previous result to ensure proper rerender
    setResult(null);
    
    // Log for debugging
    console.log("Starting analysis process...");
    
    try {
      console.log("Starting image analysis process...");
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Try to get token from localStorage
      const token = localStorage.getItem('token');
      console.log("Authentication token available:", !!token);
      
      // Headers configuration
      const headers: Record<string, string> = {};
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Use public endpoint if no token, or authenticated endpoint if token exists
      const endpoint = token 
        ? `${API_BASE_URL}/api/predictions/crop-disease`
        : `${API_BASE_URL}/api/public/predict-disease`;
      
      console.log("Making API request to:", endpoint);
      
      try {
        const response = await axios.post<PredictionResult>(
          endpoint,
          formData,
          { headers }
        );
        
        console.log("API Response received:", response.data);
        
        if (!response.data || !response.data.prediction) {
          console.error("Invalid response format:", response.data);
          throw new Error("Invalid response from server");
        }
        
        // Create a clean result object
        const resultData: PredictionResult = {
          prediction: String(response.data.prediction),
          confidence: Number(response.data.confidence),
          possible_treatments: Array.isArray(response.data.possible_treatments) 
            ? response.data.possible_treatments.map((t: string) => String(t))
            : ["No specific treatments available"],
          filename: response.data.filename,
          image_url: response.data.image_url
        };
        
        console.log("Setting result state with:", resultData);
        setResult(resultData);
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      const err = error as any;
      
      let errorMessage = 'Failed to analyze image. Please try again.';
      
      if (err.response) {
        console.error('Error response:', err.response.data);
        errorMessage = err.response.data?.detail || errorMessage;
      } else if (err.request) {
        console.error('Error request:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('Error message:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
      console.log("Analysis completed, isAnalyzing set to false");
      console.log("Final state - result:", result, "error:", error);
    }
  };
  
  // Helper function to format disease name for display
  const formatDiseaseName = (name: string): string => {
    if (!name) return '';
    return String(name).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="crop-disease-container">
      <h2>Crop Disease Detection</h2>
      <p className="description">
        Upload an image of your crop to detect diseases and get treatment recommendations.
      </p>
      
      <div 
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!preview ? (
          <>
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <p>Drag & Drop an image here or click to browse</p>
            <input 
              type="file" 
              id="file-upload" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="upload-button">
              Select Image
            </label>
          </>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <button 
              className="change-image"
              onClick={() => {
                setSelectedFile(null);
                setPreview('');
                setResult(null);
              }}
            >
              Change Image
            </button>
          </div>
        )}
      </div>
      
      {selectedFile && !result && (
        <button 
          className="analyze-button" 
          onClick={handleSubmit}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
        </button>
      )}
      
      {error && <p className="error-message">{error}</p>}
      
      {result && (
        <div className="result-container">
          <h3 className={`disease-name ${result.prediction.toLowerCase() === 'healthy' ? 'healthy' : 'disease'}`}>
            {formatDiseaseName(result.prediction)}
          </h3>
          
          <div className="confidence">
            <p className="confidence-text">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            <div className="confidence-bar">
              <div 
                className={`confidence-level ${result.confidence > 0.7 ? 'high-confidence' : 'medium-confidence'}`}
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="treatments">
            <h4 className="treatments-title">Recommended Treatments:</h4>
            {result.possible_treatments.length === 0 ? (
              <p className="no-treatments">No treatments needed.</p>
            ) : (
              <ul className="treatments-list">
                {result.possible_treatments.map((treatment, index) => (
                  <li key={index}>
                    {treatment}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="actions">
            <button 
              className="action-button print-button"
              onClick={() => window.print()}
            >
              Print Report
            </button>
            <button 
              className="action-button analyze-again-button"
              onClick={() => {
                setSelectedFile(null);
                setPreview('');
                setResult(null);
              }}
            >
              Analyze Another Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiseaseDetection;