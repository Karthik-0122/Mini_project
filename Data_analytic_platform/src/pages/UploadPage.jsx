import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useDashboardStore from '../store';
import { UploadAnimation } from '../components/UploadAnimation';
import { UploadCloud, FileCheck, Loader, ArrowRight } from 'lucide-react';
import Papa from 'papaparse'; // Import the CSV parser

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [fileHeaders, setFileHeaders] = useState([]); // To store column names
  const [step, setStep] = useState(1); // 1: Upload, 2: Map Columns
  
  // State for user's column choices
  const [distColumn, setDistColumn] = useState('');
  const [timeColumn, setTimeColumn] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setAnalysisData = useDashboardStore((state) => state.setAnalysisData);

  // --- Step 1: User selects a file ---
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setAnalysisData(null);

    // --- NEW: Parse headers on select ---
    Papa.parse(selectedFile, {
      preview: 1, // Only read the first row
      complete: (results) => {
        setFileHeaders(results.data[0]); // Save the array of column names
        setDistColumn(results.data[0][0]); // Set default dropdown values
        setTimeColumn(results.data[0][0]); // Set default dropdown values
        setStep(2); // Move to the column mapping step
      }
    });
  };

  // --- Step 2: User clicks "Analyze" ---
  const handleRunAnalysis = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    
    // --- NEW: Append the user's column choices ---
    formData.append('col_dist_target', distColumn);
    formData.append('col_time_target', timeColumn);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/analyze", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAnalysisData(response.data);
      setIsLoading(false);

      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (err) {
      setIsLoading(false);
      const errorMsg = err.response ? err.response.data.detail : "An error occurred during analysis.";
      setError(errorMsg);
      console.error(err);
    }
  };

  // --- Helper to reset the page ---
  const resetUpload = () => {
    setFile(null);
    setFileHeaders([]);
    setStep(1);
  };

  return (
    <div className="upload-page-container">
      <div className="upload-box" style={{width: '600px'}}>
        
        {/* --- STEP 1: UPLOAD FILE --- */}
        {step === 1 && (
          <>
            <UploadAnimation />
            <h2>AI-Powered Data Platform</h2>
            <p>Upload your CSV file to begin analysis.</p>
            <label className="upload-button">
              <UploadCloud size={20} />
              Select File to Analyze
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".csv"
              />
            </label>
          </>
        )}

        {/* --- STEP 2: MAP COLUMNS --- */}
        {step === 2 && (
          <>
            <h2 style={{marginBottom: '20px'}}>Map Your Data Columns</h2>
            <p>Your file **{file.name}** is ready. Tell us which columns to analyze.</p>
            
            <div className="column-mapper">
              <label>
                Column for **Distribution Chart**:
                <select value={distColumn} onChange={(e) => setDistColumn(e.target.value)}>
                  {fileHeaders.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </label>
              <label>
                Column for **Trend Chart**:
                <select value={timeColumn} onChange={(e) => setTimeColumn(e.target.value)}>
                  {fileHeaders.map(header => (
                    <option key={header} value={header}>{header}</option>
                  ))}
                </select>
              </label>
            </div>
            
            {error && (
              <p style={{ color: 'var(--red-accent)', marginTop: '20px' }}>
                <strong>Analysis Failed:</strong> {error}
              </p>
            )}

            <div style={{display: 'flex', gap: '15px', marginTop: '30px'}}>
              <button 
                className="secondary-button" 
                onClick={resetUpload} 
                disabled={isLoading}
                style={{flex: 1, justifyContent: 'center'}}
              >
                Cancel
              </button>
              <button 
                className="primary-button" 
                onClick={handleRunAnalysis} 
                disabled={isLoading}
                style={{flex: 2, justifyContent: 'center'}}
              >
                {isLoading ? (
                  <Loader size={20} className="spinner" />
                ) : (
                  <ArrowRight size={20} />
                )}
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}