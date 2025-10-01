import React from 'react';
import './ContactImport.scss';

const ContactImport = ({ onClose, onImportComplete }) => {
  return (
    <div className="contact-import-modal">
      <div className="import-header">
        <h3>Import Contacts</h3>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="import-body">
        <div className="import-step">
          <div className="upload-area">
            <div className="upload-content">
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h4>Import Contacts</h4>
              <p>Contact import functionality is temporarily disabled during deployment.</p>
              <p>This feature will be available soon with full Excel/CSV support!</p>
              
              <div className="alert alert-info mt-3">
                <h6>🚀 Coming Soon:</h6>
                <ul>
                  <li>✅ Excel (.xlsx, .xls) file support</li>
                  <li>✅ CSV file import</li>
                  <li>✅ Column mapping wizard</li>
                  <li>✅ Data validation</li>
                  <li>✅ Bulk contact import</li>
                  <li>✅ Template download</li>
                </ul>
              </div>

              <div className="button-group mt-4">
                <button onClick={onClose} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactImport;