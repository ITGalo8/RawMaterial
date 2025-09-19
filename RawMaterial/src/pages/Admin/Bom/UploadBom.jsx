import React, { useState } from 'react';
import './UploadBom.css';
import Api from '../../../Auth/Api';

const UploadBom = () => {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type by extension since file.type may be unreliable
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        setUploadStatus({ 
          type: 'error', 
          message: 'Please select a valid Excel file (.xlsx, .xls)' 
        });
        return;
      }
      
      setExcelFile(file);
      setUploadStatus(null);
    }
  };

  const uploadBomData = async () => {
    if (!excelFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file first' });
      return;
    }

    setLoading(true);
    setUploadStatus(null);
    

    try {
      const formData = new FormData();
      formData.append('file', excelFile);

      console.log('Uploading file:', formData);

      const response = await Api.post(
        `/admin/addBOMByExcel`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Add timeout to prevent hanging requests
          timeout: 30000,
        }
      );
      
      if (response.data && response.data.success) {
        setUploadStatus({ 
          type: 'success', 
          message: response.data.message || 'BOM data uploaded successfully!' 
        });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowUploadModal(false);
          setExcelFile(null);
        }, 2000);
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: response.data?.message || 'Failed to upload BOM data' 
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload BOM data';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Other errors
        errorMessage = err.message || errorMessage;
      }
      
      setUploadStatus({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const validateExcelFile = () => {
    if (!excelFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file first' });
      return false;
    }

    // For now, just proceed with upload since validation will happen on the server
    // In a real application, you might want to do some client-side validation first
    uploadBomData();
  };

  const downloadTemplate = () => {
    // Create template data with proper formatting
    const templateData = [
      { 
        'itemName': 'Example Motor', 
        'rawMaterialName': 'Example Material', 
        'quantity': 10, 
        'unit': 'Pcs/Nos' 
      },
      { 
        'itemName': 'Example Pump', 
        'rawMaterialName': 'Another Material', 
        'quantity': 5, 
        'unit': 'Mtr' 
      }
    ];
    
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BOM Template');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, 'BOM_Upload_Template.xlsx');
    
    setUploadStatus({ 
      type: 'success', 
      message: 'Template downloaded successfully!' 
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload({ target: { files } });
    }
  };

  return (
    <div className="bom-excel-container">
      <div className="bom-excel-header">
        <h1><i className="fas fa-file-excel"></i> BOM Excel Upload</h1>
        <p>Easily upload and manage your Bill of Materials with Excel</p>
      </div>
      
      <div className="bom-excel-content">
        <div className="bom-excel-action-section">
          <div className="bom-excel-action-card">
            <div className="bom-excel-action-icon">
              <i className="fas fa-download"></i>
            </div>
            <h3>Download Template</h3>
            <p>Get our pre-formatted Excel template to ensure your data is structured correctly</p>
            <button 
              className="bom-excel-action-button"
              onClick={downloadTemplate}
            >
              <i className="fas fa-download"></i> Download Template
            </button>
          </div>
          
          <div className="bom-excel-action-card">
            <div className="bom-excel-action-icon">
              <i className="fas fa-upload"></i>
            </div>
            <h3>Bulk Upload</h3>
            <p>Upload your completed Excel template to process multiple BOM entries at once</p>
            <button 
              className="bom-excel-action-button"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload"></i> Bulk Upload Excel
            </button>
          </div>
        </div>
        
        <div className="bom-excel-features">
          <div className="bom-excel-feature-card">
            <div className="bom-excel-feature-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Validation</h3>
            <p>Our system validates your Excel file to ensure all required data is present</p>
          </div>
          
          <div className="bom-excel-feature-card">
            <div className="bom-excel-feature-icon">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Quick Processing</h3>
            <p>Process hundreds of BOM entries in seconds with our optimized system</p>
          </div>
          
          <div className="bom-excel-feature-card">
            <div className="bom-excel-feature-icon">
              <i className="fas fa-database"></i>
            </div>
            <h3>Data Integrity</h3>
            <p>Maintain data consistency with our validation rules and error checking</p>
          </div>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="bom-excel-modal-overlay">
          <div className="bom-excel-modal">
            <div className="bom-excel-modal-header">
              <h2><i className="fas fa-file-excel"></i> Bulk Upload BOM Data</h2>
              <button 
                className="bom-excel-close-button"
                onClick={() => {
                  setShowUploadModal(false);
                  setExcelFile(null);
                  setUploadStatus(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="bom-excel-modal-body">
              <div className="bom-excel-instructions">
                <h3><i className="fas fa-info-circle"></i> Instructions</h3>
                <ul>
                  <li><i className="fas fa-check"></i> Download our template to ensure proper formatting</li>
                  <li><i className="fas fa-check"></i> Required columns: itemName, rawMaterialName, quantity, unit</li>
                  <li><i className="fas fa-check"></i> Save your file as .xlsx or .xls format</li>
                  <li><i className="fas fa-check"></i> Maximum file size: 10MB</li>
                </ul>
              </div>
              
              {uploadStatus && (
                <div className={`bom-excel-status-message ${
                  uploadStatus.type === 'error' ? 'bom-excel-error' : 'bom-excel-success'
                }`}>
                  {uploadStatus.message}
                </div>
              )}
              
              <div 
                className="bom-excel-file-upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <h3>Drag & Drop your Excel file here</h3>
                <p>or click to browse your files</p>
                <input
                  type="file"
                  name='file'
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="bom-excel-file-input"
                  disabled={loading}
                />
              </div>
              
              {excelFile && (
                <div className="bom-excel-file-info">
                  <p><span className="bom-excel-file-name">{excelFile.name}</span></p>
                  <p>Size: <span>{(excelFile.size / 1024).toFixed(2)} KB</span></p>
                </div>
              )}
            </div>
            
            <div className="bom-excel-modal-footer">
              <button 
                className="bom-excel-button bom-excel-secondary-button"
                onClick={() => {
                  setShowUploadModal(false);
                  setExcelFile(null);
                  setUploadStatus(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className={`bom-excel-button bom-excel-primary-button ${
                  loading || !excelFile ? 'bom-excel-button-disabled' : ''
                }`}
                onClick={validateExcelFile}
                disabled={loading || !excelFile}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload"></i> Upload File
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBom;