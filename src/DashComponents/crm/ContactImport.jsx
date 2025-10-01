import React, { useState, useRef } from 'react';
// import * as XLSX from 'xlsx'; // Temporarily disabled for build
import './ContactImport.scss';
import CRMApi from '../../../services/CRMApi';

const ContactImport = ({ onClose, onImportComplete }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Map, 3: Preview, 4: Import
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Required fields for contact import
  const requiredFields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'phone', label: 'Phone Number', required: false },
    { key: 'email', label: 'Email', required: false },
    { key: 'platform', label: 'Platform', required: true }
  ];

  // Optional fields
  const optionalFields = [
    { key: 'company', label: 'Company' },
    { key: 'position', label: 'Position' },
    { key: 'stage', label: 'Stage' },
    { key: 'tags', label: 'Tags (comma-separated)' },
    { key: 'notes', label: 'Notes' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' }
  ];

  const allFields = [...requiredFields, ...optionalFields];

  // Step 1: File Upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    // Temporarily disabled for build - Excel/CSV import functionality
    alert('File import functionality is temporarily disabled during deployment. This feature will be available soon!');
    return;
  };

  const processFile = (file) => {
    // Temporarily disabled for build
    console.log('File processing temporarily disabled');
    return;

        if (jsonData.length < 2) {
          CRMApi.showError('File must contain at least a header row and one data row');
          return;
        }

        // Convert to object format
        const headers = jsonData[0];
        const rows = jsonData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });

        setExcelData(rows.filter(row => Object.values(row).some(val => val !== '')));
        setCurrentStep(2);
        
        // Auto-map obvious columns
        autoMapColumns(headers);

      } catch (error) {
        console.error('Error processing file:', error);
        CRMApi.showError('Error reading file. Please ensure it\'s a valid Excel/CSV file');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const autoMapColumns = (headers) => {
    const mapping = {};
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase().trim();
      
      // Auto-map common column names
      if (lowerHeader.includes('name') || lowerHeader.includes('full name') || lowerHeader.includes('contact name')) {
        mapping.name = header;
      } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile') || lowerHeader.includes('number')) {
        mapping.phone = header;
      } else if (lowerHeader.includes('email') || lowerHeader.includes('mail')) {
        mapping.email = header;
      } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
        mapping.company = header;
      } else if (lowerHeader.includes('platform') || lowerHeader.includes('source')) {
        mapping.platform = header;
      } else if (lowerHeader.includes('stage') || lowerHeader.includes('status')) {
        mapping.stage = header;
      } else if (lowerHeader.includes('tag') || lowerHeader.includes('label')) {
        mapping.tags = header;
      } else if (lowerHeader.includes('note') || lowerHeader.includes('comment')) {
        mapping.notes = header;
      } else if (lowerHeader.includes('position') || lowerHeader.includes('title') || lowerHeader.includes('job')) {
        mapping.position = header;
      } else if (lowerHeader.includes('address') || lowerHeader.includes('street')) {
        mapping.address = header;
      } else if (lowerHeader.includes('city')) {
        mapping.city = header;
      } else if (lowerHeader.includes('country')) {
        mapping.country = header;
      }
    });

    setColumnMapping(mapping);
  };

  // Step 2: Column Mapping
  const handleMappingChange = (fieldKey, excelColumn) => {
    setColumnMapping(prev => ({
      ...prev,
      [fieldKey]: excelColumn
    }));
  };

  const validateMapping = () => {
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (field.required && !columnMapping[field.key]) {
        errors.push(`${field.label} is required but not mapped`);
      }
    });

    // At least phone or email should be mapped
    if (!columnMapping.phone && !columnMapping.email) {
      errors.push('At least one contact method (Phone or Email) must be mapped');
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const proceedToPreview = () => {
    if (validateMapping()) {
      setCurrentStep(3);
    }
  };

  // Step 3: Preview Data
  const getPreviewData = () => {
    return excelData.slice(0, 5).map(row => {
      const mappedRow = {};
      Object.keys(columnMapping).forEach(fieldKey => {
        const excelColumn = columnMapping[fieldKey];
        mappedRow[fieldKey] = row[excelColumn] || '';
      });
      return mappedRow;
    });
  };

  const validatePreviewData = () => {
    const errors = [];
    const previewData = getPreviewData();
    
    previewData.forEach((row, index) => {
      // Validate required fields
      if (!row.name || row.name.trim() === '') {
        errors.push(`Row ${index + 1}: Name is required`);
      }
      
      // Validate platform
      if (row.platform) {
        const validPlatforms = ['whatsapp', 'messenger', 'instagram', 'email', 'website'];
        if (!validPlatforms.includes(row.platform.toLowerCase())) {
          errors.push(`Row ${index + 1}: Invalid platform "${row.platform}". Valid platforms: ${validPlatforms.join(', ')}`);
        }
      }
      
      // Validate stage
      if (row.stage) {
        const validStages = ['lead', 'prospect', 'customer', 'inactive'];
        if (!validStages.includes(row.stage.toLowerCase())) {
          errors.push(`Row ${index + 1}: Invalid stage "${row.stage}". Valid stages: ${validStages.join(', ')}`);
        }
      }
      
      // Validate email format
      if (row.email && !/\S+@\S+\.\S+/.test(row.email)) {
        errors.push(`Row ${index + 1}: Invalid email format`);
      }
    });
    
    setErrors(errors.slice(0, 10)); // Show only first 10 errors
    return errors.length === 0;
  };

  // Step 4: Import Process
  const startImport = async () => {
    if (!validatePreviewData()) {
      CRMApi.showError('Please fix validation errors before importing');
      return;
    }

    setIsImporting(true);
    setCurrentStep(4);
    setImportProgress(0);

    try {
      // Transform all data
      const transformedData = excelData.map(row => {
        const contact = {};
        
        Object.keys(columnMapping).forEach(fieldKey => {
          const excelColumn = columnMapping[fieldKey];
          let value = row[excelColumn] || '';
          
          // Transform specific fields
          if (fieldKey === 'platform' && value) {
            value = value.toLowerCase();
          }
          if (fieldKey === 'stage' && value) {
            value = value.toLowerCase();
          }
          if (fieldKey === 'tags' && value) {
            value = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          }
          
          contact[fieldKey] = value;
        });

        // Set defaults
        if (!contact.platform) contact.platform = 'website';
        if (!contact.stage) contact.stage = 'lead';
        
        return contact;
      });

      // Import in batches
      const batchSize = 10;
      const totalBatches = Math.ceil(transformedData.length / batchSize);
      let successCount = 0;
      let errorCount = 0;
      const importErrors = [];

      for (let i = 0; i < totalBatches; i++) {
        const batch = transformedData.slice(i * batchSize, (i + 1) * batchSize);
        
        try {
          const response = await CRMApi.importContacts(batch);
          successCount += response.data.successCount || batch.length;
          
          if (response.data.errors) {
            importErrors.push(...response.data.errors);
            errorCount += response.data.errors.length;
          }
        } catch (error) {
          console.error('Batch import error:', error);
          errorCount += batch.length;
          importErrors.push(`Batch ${i + 1}: ${error.message}`);
        }

        // Update progress
        const progress = ((i + 1) / totalBatches) * 100;
        setImportProgress(progress);
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setImportResults({
        total: transformedData.length,
        successful: successCount,
        failed: errorCount,
        errors: importErrors
      });

      if (successCount > 0) {
        CRMApi.showSuccess(`Successfully imported ${successCount} contacts`);
        onImportComplete();
      }

    } catch (error) {
      console.error('Import error:', error);
      CRMApi.showError('Import failed: ' + error.message);
      setImportResults({
        total: excelData.length,
        successful: 0,
        failed: excelData.length,
        errors: [error.message]
      });
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setCurrentStep(1);
    setFile(null);
    setExcelData([]);
    setColumnMapping({});
    setImportProgress(0);
    setImportResults(null);
    setIsImporting(false);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    // Temporarily disabled for build
    alert('Template download functionality is temporarily disabled during deployment. This feature will be available soon!');
  };

  return (
    <div className="contact-import-modal">
      <div className="import-header">
        <h3>Import Contacts</h3>
        <div className="step-indicator">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Upload'}
                {step === 2 && 'Map'}
                {step === 3 && 'Preview'}
                {step === 4 && 'Import'}
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="import-body">
        {/* Step 1: File Upload */}
        {currentStep === 1 && (
          <div className="upload-step">
            <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h4>Upload Excel or CSV File</h4>
              <p>Click to browse or drag and drop your file here</p>
              <p className="file-info">Supported formats: .xlsx, .xls, .csv</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div className="template-section">
              <h5>Need a template?</h5>
              <p>Download our sample template to see the expected format</p>
              <button onClick={downloadTemplate} className="btn-template">
                <i className="fas fa-download"></i>
                Download Template
              </button>
            </div>

            <div className="format-guide">
              <h5>Format Guidelines:</h5>
              <ul>
                <li>First row should contain column headers</li>
                <li>Name column is required</li>
                <li>At least one contact method (phone or email) is required</li>
                <li>Platform should be: whatsapp, messenger, instagram, email, or website</li>
                <li>Stage should be: lead, prospect, customer, or inactive</li>
                <li>Tags should be comma-separated</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {currentStep === 2 && (
          <div className="mapping-step">
            <div className="mapping-header">
              <h4>Map Your Columns</h4>
              <p>Match your Excel columns with our contact fields</p>
              <div className="file-info">
                <i className="fas fa-file-excel"></i>
                <span>{file?.name}</span>
                <span className="row-count">({excelData.length} rows)</span>
              </div>
            </div>

            <div className="mapping-grid">
              <div className="mapping-section">
                <h5>Required Fields</h5>
                {requiredFields.map(field => (
                  <div key={field.key} className="mapping-row">
                    <div className="field-info">
                      <label>{field.label}</label>
                      {field.required && <span className="required">*</span>}
                    </div>
                    <select
                      value={columnMapping[field.key] || ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className={`mapping-select ${field.required && !columnMapping[field.key] ? 'error' : ''}`}
                    >
                      <option value="">Select Column</option>
                      {excelData.length > 0 && Object.keys(excelData[0]).map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <div className="mapping-section">
                <h5>Optional Fields</h5>
                {optionalFields.map(field => (
                  <div key={field.key} className="mapping-row">
                    <div className="field-info">
                      <label>{field.label}</label>
                    </div>
                    <select
                      value={columnMapping[field.key] || ''}
                      onChange={(e) => handleMappingChange(field.key, e.target.value)}
                      className="mapping-select"
                    >
                      <option value="">Skip this field</option>
                      {excelData.length > 0 && Object.keys(excelData[0]).map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {errors.length > 0 && (
              <div className="error-list">
                <h5>Mapping Errors:</h5>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="step-actions">
              <button onClick={() => setCurrentStep(1)} className="btn-secondary">
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
              <button onClick={proceedToPreview} className="btn-primary">
                Preview Data
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <div className="preview-step">
            <div className="preview-header">
              <h4>Preview Import Data</h4>
              <p>Review the first 5 rows to ensure data is mapped correctly</p>
              <div className="preview-stats">
                <span className="total-rows">Total Rows: {excelData.length}</span>
              </div>
            </div>

            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    {allFields.filter(field => columnMapping[field.key]).map(field => (
                      <th key={field.key}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getPreviewData().map((row, index) => (
                    <tr key={index}>
                      {allFields.filter(field => columnMapping[field.key]).map(field => (
                        <td key={field.key}>
                          {field.key === 'tags' && Array.isArray(row[field.key])
                            ? row[field.key].join(', ')
                            : row[field.key] || '-'
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {errors.length > 0 && (
              <div className="error-list">
                <h5>Validation Errors:</h5>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="step-actions">
              <button onClick={() => setCurrentStep(2)} className="btn-secondary">
                <i className="fas fa-arrow-left"></i>
                Back to Mapping
              </button>
              <button 
                onClick={startImport}
                className="btn-primary"
                disabled={errors.length > 0}
              >
                Start Import
                <i className="fas fa-upload"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Import Progress */}
        {currentStep === 4 && (
          <div className="import-step">
            <div className="import-header">
              <h4>
                {isImporting ? 'Importing Contacts...' : 'Import Complete'}
              </h4>
            </div>

            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${importProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {Math.round(importProgress)}%
              </div>
            </div>

            {importResults && (
              <div className="import-results">
                <div className="results-grid">
                  <div className="result-card success">
                    <div className="result-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-number">{importResults.successful}</div>
                      <div className="result-label">Successful</div>
                    </div>
                  </div>

                  <div className="result-card error">
                    <div className="result-icon">
                      <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-number">{importResults.failed}</div>
                      <div className="result-label">Failed</div>
                    </div>
                  </div>

                  <div className="result-card total">
                    <div className="result-icon">
                      <i className="fas fa-list"></i>
                    </div>
                    <div className="result-info">
                      <div className="result-number">{importResults.total}</div>
                      <div className="result-label">Total</div>
                    </div>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div className="error-details">
                    <h5>Import Errors:</h5>
                    <div className="error-log">
                      {importResults.errors.slice(0, 10).map((error, index) => (
                        <div key={index} className="error-item">{error}</div>
                      ))}
                      {importResults.errors.length > 10 && (
                        <div className="error-item">... and {importResults.errors.length - 10} more errors</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="step-actions">
              <button onClick={resetImport} className="btn-secondary">
                <i className="fas fa-upload"></i>
                Import Another File
              </button>
              <button onClick={onClose} className="btn-primary">
                <i className="fas fa-check"></i>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactImport;