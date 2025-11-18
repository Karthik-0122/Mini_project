import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ToolkitPage from './pages/ToolkitPage'; // This is your home page
import DashboardPage from './pages/DashboardPage';
import PipelinePage from './pages/PipelinePage';
import AIAnalysisPage from './pages/AIAnalysisPage';
import UploadPage from './pages/UploadPage';
import WorkspacePage from './pages/WorkspacePage';

// We use 'export default' to match your project's pattern
export default function App() {
  return (
    <>
      {/* No layout here, each page is full-screen */}
      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<ToolkitPage />} />
        
        {/* Tool Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/ai-analysis" element={<AIAnalysisPage />} />
        
        {/* Other pages */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        
        {/* Placeholder routes */}
        <Route path="/support" element={<div>Support Page</div>} />
        <Route path="/settings" element={<div>Settings Page</div>} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}
