// CRMLayout.jsx - Main layout component for CRM system
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CRMNavigation from './CRMNavigation';
import CRMDashboard from './CRMDashboard';
import ContactManager from './ContactManager';
import CampaignManager from './CampaignManager';
import UnifiedInbox from './UnifiedInbox';
import './CRMLayout.scss';

// Placeholder components for routes not yet created
const CRMTemplates = () => (
  <div className="crm-page-placeholder">
    <div className="placeholder-content">
      <i className="fas fa-file-alt"></i>
      <h3>Message Templates</h3>
      <p>Create and manage reusable message templates for your campaigns.</p>
      <div className="coming-soon">Coming Soon</div>
    </div>
  </div>
);

const CRMAutomation = () => (
  <div className="crm-page-placeholder">
    <div className="placeholder-content">
      <i className="fas fa-cogs"></i>
      <h3>Automation Workflows</h3>
      <p>Set up automated responses and workflow triggers.</p>
      <div className="coming-soon">Coming Soon</div>
    </div>
  </div>
);

const CRMAnalytics = () => (
  <div className="crm-page-placeholder">
    <div className="placeholder-content">
      <i className="fas fa-chart-bar"></i>
      <h3>Analytics & Reports</h3>
      <p>Detailed analytics and performance metrics for your campaigns.</p>
      <div className="coming-soon">Coming Soon</div>
    </div>
  </div>
);

const CRMSettings = () => (
  <div className="crm-page-placeholder">
    <div className="placeholder-content">
      <i className="fas fa-cog"></i>
      <h3>CRM Settings</h3>
      <p>Configure your CRM system, integrations, and preferences.</p>
      <div className="coming-soon">Coming Soon</div>
    </div>
  </div>
);

const CRMLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize CRM system
    const initializeCRM = async () => {
      try {
        // Simulate initialization process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check WhatsApp connection status
        // This would be replaced with actual API call
        setConnectionStatus('connected');
        setIsLoading(false);
      } catch (error) {
        console.error('CRM initialization failed:', error);
        setConnectionStatus('error');
        setIsLoading(false);
      }
    };

    initializeCRM();
  }, []);

  if (isLoading) {
    return (
      <div className="crm-loading">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <h3>Initializing CRM System</h3>
          <p>Setting up your customer management platform...</p>
          <div className="loading-steps">
            <div className="step active">
              <i className="fas fa-check"></i>
              <span>Loading Configuration</span>
            </div>
            <div className="step active">
              <i className="fas fa-check"></i>
              <span>Connecting to Database</span>
            </div>
            <div className="step loading">
              <div className="step-spinner"></div>
              <span>Establishing WhatsApp Connection</span>
            </div>
            <div className="step">
              <i className="fas fa-circle"></i>
              <span>Ready to Use</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-layout">
      {/* Navigation Sidebar */}
      <CRMNavigation />

      {/* Main Content Area */}
      <div className="crm-content">
        <div className="crm-content-wrapper">
          <Routes>
            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/admin/crm/dashboard" replace />} />
            
            {/* Main CRM Routes */}
            <Route path="/dashboard" element={<CRMDashboard />} />
            <Route path="/contacts" element={<ContactManager />} />
            <Route path="/campaigns" element={<CampaignManager />} />
            <Route path="/inbox" element={<UnifiedInbox />} />
            <Route path="/templates" element={<CRMTemplates />} />
            <Route path="/automation" element={<CRMAutomation />} />
            <Route path="/analytics" element={<CRMAnalytics />} />
            <Route path="/settings" element={<CRMSettings />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/admin/crm/dashboard" replace />} />
          </Routes>
        </div>

        {/* Connection Status Toast */}
        {connectionStatus === 'error' && (
          <div className="connection-toast error">
            <div className="toast-content">
              <i className="fas fa-exclamation-triangle"></i>
              <div className="toast-text">
                <strong>Connection Failed</strong>
                <p>Unable to connect to WhatsApp Business API</p>
              </div>
              <button className="toast-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        {connectionStatus === 'connecting' && (
          <div className="connection-toast connecting">
            <div className="toast-content">
              <div className="toast-spinner"></div>
              <div className="toast-text">
                <strong>Connecting...</strong>
                <p>Establishing WhatsApp connection</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global CRM Modals/Overlays */}
      <div id="crm-modal-root"></div>
    </div>
  );
};

export default CRMLayout;