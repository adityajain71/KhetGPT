import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CropDiseaseDetection from './components/CropDiseaseDetection';

// Mock result for debugging
const mockResult = {
  prediction: "Powdery",
  confidence: 0.85,
  possible_treatments: [
    "Apply fungicides with sulfur or potassium bicarbonate",
    "Ensure proper air circulation around plants",
    "Remove and dispose of infected plant parts"
  ]
};

// Define global type for window to include our test function
declare global {
  interface Window {
    testSetResult: (result: any) => void;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Crop Disease Detection Test</h1>
      <CropDiseaseDetection />
      
      <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc' }}>
        <h2>Manual Test Section</h2>
        <p>Click the button below to manually set a mock result (bypassing the API):</p>
        <button 
          onClick={() => {
            // Try to find the result state setter in the CropDiseaseDetection component
            // This is a hack and only for testing
            try {
              const component = document.querySelector('.crop-disease-container');
              console.log("Found component:", component);
              alert("Please use the 'Test Display (Debug)' button inside the component");
            } catch (e) {
              console.error("Error accessing component:", e);
            }
          }}
          style={{ padding: '10px 20px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Set Mock Result
        </button>
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// Add a global test function to manually set the result
window.testSetResult = (result: any) => {
  console.log("Setting test result:", result);
  // This won't work directly, it's just an example
  // Would need to use React context or state management for this
};

export {};