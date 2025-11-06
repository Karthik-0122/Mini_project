import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Upload } from 'lucide-react';
import useDashboardStore from '../store'; // Import the store

export default function Navbar() {
  const navigate = useNavigate();
  const clearAnalysisData = useDashboardStore((state) => state.clearAnalysisData);

  const handleNewUpload = () => {
    // Clear the global data store
    clearAnalysisData();
    // Navigate back to the home (upload) page
    navigate('/');
  };

  return (
    <div className="card nav-bar" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '16px 24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Database size={28} color="var(--primary-blue)" />
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>DATASTREAM</span>
      </div>
      <button className="secondary-button" onClick={handleNewUpload}>
        <Upload size={16} />
        New Upload
      </button>
    </div>
  );
}