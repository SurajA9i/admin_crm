import React, { useState, useRef, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import './FocalPointPicker.css';

// Helper function to simulate the getFocalPointPositionWithFallback function from the frontend
const simulateFocalPointPosition = (focalPoint, imageType = 'default') => {
  // If focal point exists, use it directly
  if (focalPoint && typeof focalPoint.x === 'number' && typeof focalPoint.y === 'number') {
    // Clamp values to valid range (0-100)
    const x = Math.max(0, Math.min(100, focalPoint.x));
    const y = Math.max(0, Math.min(100, focalPoint.y));
    return `${x}% ${y}%`;
  }

  // Type-specific fallbacks for when no focal point is set
  switch (imageType) {
    case 'card':
      return 'center center';
    case 'hero':
      return 'center 30%'; // For hero banners, slight upward bias shows more landscape
    case 'thumbnail':
      return 'center center';
    default:
      return 'center center';
  }
};

const FocalPointPicker = ({ 
  imageUrl, 
  focalPoint, 
  onFocalPointChange, 
  disabled = false,
  label = "Select Focal Point"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const containerRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);

  const handleClick = useCallback((event) => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    onFocalPointChange({ x: clampedX, y: clampedY });
    
    // Hide tooltip immediately after clicking
    setShowTooltip(false);
    setIsHovering(false);
  }, [disabled, onFocalPointChange]);

  const handleMouseDown = (event) => {
    if (disabled) return;
    setIsDragging(true);
    handleClick(event);
  };

  const handleMouseMove = (event) => {
    if (!disabled && containerRef.current) {
      // Update tooltip position
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setTooltipPosition({ x, y });
    }

    if (!isDragging || disabled) return;
    handleClick(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovering(true);
      // Show tooltip after delay to avoid flashing
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true);
      }, 200);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setShowTooltip(false);
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (event) => {
      if (isDragging && !disabled) {
        handleClick(event);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [isDragging, disabled, handleClick]);

  if (!imageUrl) {
    return (
      <div className="focal-point-picker-placeholder">
        <Form.Label className="fw-bold">
          <i className="fas fa-crosshairs me-2 text-primary"></i>
          {label}
        </Form.Label>
        <div className="focal-point-placeholder-content">
          <div className="placeholder-icon-container">
            <i className="fas fa-image placeholder-icon text-muted"></i>
          </div>
          <p className="text-muted mb-0">Upload an image first to set focal point</p>
        </div>
      </div>
    );
  }

  return (
    <div className="focal-point-picker-wrapper">
      <div className="focal-point-header">
        <Form.Label className="focal-point-label">
          <i className="fas fa-crosshairs me-2 text-primary"></i>
          {label}
        </Form.Label>
        <p className="focal-point-instructions mb-2">
          Click on the most important part of the image for optimal cropping
        </p>
      </div>
      
      <div
        ref={containerRef}
        className={`focal-point-picker ${disabled ? 'disabled' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageUrl}
          alt="Focal point selection"
          className="focal-point-image"
          draggable={false}
        />
        
        {/* Rule of thirds grid overlay */}
        <div className="focal-point-grid">
          <div className="grid-line grid-line-vertical" style={{ left: '33.33%' }}></div>
          <div className="grid-line grid-line-vertical" style={{ left: '66.67%' }}></div>
          <div className="grid-line grid-line-horizontal" style={{ top: '33.33%' }}></div>
          <div className="grid-line grid-line-horizontal" style={{ top: '66.67%' }}></div>
        </div>
        
        {/* Focal point indicator */}
        {focalPoint && (
          <div
            className="focal-point-indicator"
            style={{
              left: `${focalPoint.x}%`,
              top: `${focalPoint.y}%`,
            }}
          >
            <div className="focal-point-crosshair">
              <div className="crosshair-center"></div>
              <div className="crosshair-horizontal"></div>
              <div className="crosshair-vertical"></div>
            </div>
          </div>
        )}

        {/* Improved tooltip that follows mouse */}
        {showTooltip && isHovering && !disabled && (
          <div 
            className="focal-point-tooltip"
            style={{
              left: `${Math.min(tooltipPosition.x, 200)}px`,
              top: `${Math.max(tooltipPosition.y - 35, 10)}px`
            }}
          >
            <span className="tooltip-text">Click to set focal point</span>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
      
      {/* Enhanced coordinates display */}
      {focalPoint && (
        <div className="focal-point-footer">
          <div className="focal-point-coordinates">
            <div className="coordinate-item">
              <span className="coordinate-label">X:</span>
              <span className="coordinate-value">{focalPoint.x.toFixed(1)}%</span>
            </div>
            <div className="coordinate-item">
              <span className="coordinate-label">Y:</span>
              <span className="coordinate-value">{focalPoint.y.toFixed(1)}%</span>
            </div>
            <div className="coordinate-item">
              <button 
                type="button"
                className="btn btn-sm btn-outline-info preview-button"
                onClick={() => setShowPreview(!showPreview)}
                disabled={disabled}
                title="Preview how this focal point will look in different crop ratios"
              >
                <i className="fas fa-eye me-1"></i>
                {showPreview ? 'Hide' : 'Preview'}
              </button>
            </div>
          </div>
          
          <button 
            type="button"
            className="btn btn-sm btn-outline-secondary reset-button"
            onClick={() => onFocalPointChange({ x: 50, y: 50 })}
            disabled={disabled}
          >
            <i className="fas fa-crosshairs me-1"></i>
            Reset to Center
          </button>
        </div>
      )}

      {/* Live Preview Section */}
      {showPreview && focalPoint && (
        <div className="focal-point-preview">
          <h6 className="preview-title">
            <i className="fas fa-crop-alt me-2"></i>
            Website Preview (Actual Appearance)
          </h6>
          <p className="text-muted mb-3">These previews show how your image will appear on the live website with the current focal point.</p>
          <div className="preview-grid">
            {[
              { name: 'Hero Banner (16:8)', ratio: 2, imageType: 'hero' },
              { name: 'Card Thumbnail (4:3)', ratio: 1.33, imageType: 'card' }
            ].map((format, index) => (
              <div key={index} className="preview-item">
                <div 
                  className="preview-crop"
                  style={{
                    aspectRatio: format.ratio,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: simulateFocalPointPosition(focalPoint, format.imageType),
                    backgroundSize: 'cover',
                    // Adding border and overflow properties to better simulate website containers
                    borderRadius: format.imageType === 'hero' ? '24px' : '12px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Add gradient overlay for hero banner to simulate website appearance */}
                  {format.imageType === 'hero' && (
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '50%',
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000 100%)',
                        zIndex: 2
                      }}
                    />
                  )}
                  <div className="preview-focal-point">
                    <div className="mini-crosshair"></div>
                  </div>
                </div>
                <small className="preview-label">{format.name}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocalPointPicker;