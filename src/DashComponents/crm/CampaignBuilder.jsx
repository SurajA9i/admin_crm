import React, { useState, useEffect } from 'react';
import './CampaignBuilder.scss';
import CRMApi from '../../../services/CRMApi';

const CampaignBuilder = ({ campaign, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic, 2: Audience, 3: Message, 4: Schedule, 5: Review
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  const [campaignData, setCampaignData] = useState({
    // Step 1: Basic Info
    name: '',
    description: '',
    type: 'broadcast',
    platforms: ['whatsapp'],
    
    // Step 2: Audience
    audienceType: 'all', // 'all', 'segments', 'custom'
    segments: [],
    customContacts: [],
    audienceFilters: {
      stage: '',
      tags: [],
      platform: '',
      location: '',
      lastInteraction: ''
    },
    
    // Step 3: Message
    messageType: 'template', // 'template', 'custom'
    templateId: '',
    customMessage: {
      subject: '',
      content: '',
      mediaUrl: '',
      mediaType: '',
      buttons: []
    },
    personalization: {
      useContactName: true,
      useCompanyName: false,
      customFields: []
    },
    
    // Step 4: Schedule
    scheduleType: 'now', // 'now', 'scheduled', 'recurring'
    scheduledAt: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurringSettings: {
      frequency: 'weekly',
      days: [],
      time: '09:00',
      endDate: ''
    },
    
    // Step 5: Advanced
    trackingEnabled: true,
    unsubscribeEnabled: true,
    sendTestMessage: false,
    testContacts: []
  });

  const [errors, setErrors] = useState({});
  const [audiencePreview, setAudiencePreview] = useState([]);
  const [audienceCount, setAudienceCount] = useState(0);

  useEffect(() => {
    if (campaign) {
      setCampaignData(campaign);
    }
    fetchTemplates();
  }, [campaign]);

  useEffect(() => {
    if (currentStep === 2) {
      updateAudiencePreview();
    }
  }, [campaignData.audienceType, campaignData.segments, campaignData.audienceFilters, currentStep]);

  const fetchTemplates = async () => {
    try {
      const response = await CRMApi.getMessageTemplates();
      setTemplates(response.data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const updateAudiencePreview = async () => {
    try {
      let audienceData = [];
      
      if (campaignData.audienceType === 'all') {
        const response = await CRMApi.getContacts({}, 1, 50);
        audienceData = response.data.contacts || [];
        setAudienceCount(response.data.pagination?.totalCount || 0);
      } else if (campaignData.audienceType === 'segments') {
        const response = await CRMApi.getContactSegments(campaignData.audienceFilters);
        audienceData = response.data.contacts || [];
        setAudienceCount(response.data.totalCount || 0);
      } else if (campaignData.audienceType === 'custom') {
        audienceData = campaignData.customContacts;
        setAudienceCount(campaignData.customContacts.length);
      }
      
      setAudiencePreview(audienceData.slice(0, 10));
    } catch (error) {
      console.error('Error updating audience preview:', error);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!campaignData.name.trim()) newErrors.name = 'Campaign name is required';
        if (!campaignData.type) newErrors.type = 'Campaign type is required';
        if (!campaignData.platforms.length) newErrors.platforms = 'At least one platform is required';
        break;
        
      case 2:
        if (campaignData.audienceType === 'custom' && !campaignData.customContacts.length) {
          newErrors.audience = 'Please select at least one contact';
        }
        if (audienceCount === 0) {
          newErrors.audience = 'No contacts match your criteria';
        }
        break;
        
      case 3:
        if (campaignData.messageType === 'template' && !campaignData.templateId) {
          newErrors.template = 'Please select a message template';
        }
        if (campaignData.messageType === 'custom') {
          if (!campaignData.customMessage.content.trim()) {
            newErrors.content = 'Message content is required';
          }
        }
        break;
        
      case 4:
        if (campaignData.scheduleType === 'scheduled' && !campaignData.scheduledAt) {
          newErrors.schedule = 'Please select a schedule date and time';
        }
        if (campaignData.scheduleType === 'recurring') {
          if (!campaignData.recurringSettings.days.length) {
            newErrors.recurring = 'Please select at least one day for recurring campaign';
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const payload = {
        ...campaignData,
        status: 'draft'
      };
      
      if (campaign) {
        await CRMApi.updateCampaign(campaign._id, payload);
      } else {
        await CRMApi.createCampaign(payload);
      }
      
      CRMApi.showSuccess('Campaign saved as draft');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving campaign:', error);
      CRMApi.showError('Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!validateStep(5)) return;
    
    const confirmed = window.confirm(`Are you sure you want to launch this campaign to ${audienceCount} recipients?`);
    if (!confirmed) return;
    
    try {
      setLoading(true);
      const payload = {
        ...campaignData,
        status: campaignData.scheduleType === 'now' ? 'active' : 'scheduled'
      };
      
      if (campaign) {
        await CRMApi.updateCampaign(campaign._id, payload);
        await CRMApi.launchCampaign(campaign._id);
      } else {
        const response = await CRMApi.createCampaign(payload);
        await CRMApi.launchCampaign(response.data.campaign._id);
      }
      
      CRMApi.showSuccess('Campaign launched successfully');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error launching campaign:', error);
      CRMApi.showError('Failed to launch campaign');
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignData = (field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedData = (section, field, value) => {
    setCampaignData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="campaign-builder">
      <div className="builder-header">
        <h3>{campaign ? 'Edit Campaign' : 'Create New Campaign'}</h3>
        
        <div className="step-indicator">
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Audience'}
                {step === 3 && 'Message'}
                {step === 4 && 'Schedule'}
                {step === 5 && 'Review'}
              </div>
            </div>
          ))}
        </div>
        
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="builder-body">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <BasicInfoStep
            data={campaignData}
            errors={errors}
            onChange={updateCampaignData}
          />
        )}

        {/* Step 2: Audience Selection */}
        {currentStep === 2 && (
          <AudienceStep
            data={campaignData}
            errors={errors}
            audiencePreview={audiencePreview}
            audienceCount={audienceCount}
            onChange={updateCampaignData}
            onNestedChange={updateNestedData}
          />
        )}

        {/* Step 3: Message Creation */}
        {currentStep === 3 && (
          <MessageStep
            data={campaignData}
            errors={errors}
            templates={templates}
            onChange={updateCampaignData}
            onNestedChange={updateNestedData}
          />
        )}

        {/* Step 4: Schedule Settings */}
        {currentStep === 4 && (
          <ScheduleStep
            data={campaignData}
            errors={errors}
            onChange={updateCampaignData}
            onNestedChange={updateNestedData}
          />
        )}

        {/* Step 5: Review & Launch */}
        {currentStep === 5 && (
          <ReviewStep
            data={campaignData}
            audienceCount={audienceCount}
            templates={templates}
          />
        )}
      </div>

      <div className="builder-footer">
        <div className="footer-left">
          <button 
            onClick={handleSaveDraft}
            className="btn-secondary"
            disabled={loading}
          >
            <i className="fas fa-save"></i>
            Save Draft
          </button>
        </div>
        
        <div className="footer-right">
          {currentStep > 1 && (
            <button onClick={handlePrev} className="btn-secondary">
              <i className="fas fa-arrow-left"></i>
              Previous
            </button>
          )}
          
          {currentStep < 5 ? (
            <button onClick={handleNext} className="btn-primary">
              Next
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button 
              onClick={handleLaunchCampaign}
              className="btn-primary launch"
              disabled={loading}
            >
              <i className="fas fa-rocket"></i>
              {campaignData.scheduleType === 'now' ? 'Launch Now' : 'Schedule Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 1: Basic Information Component
const BasicInfoStep = ({ data, errors, onChange }) => {
  const campaignTypes = [
    { value: 'broadcast', label: 'Broadcast', desc: 'Send to multiple contacts at once' },
    { value: 'nurture', label: 'Nurture', desc: 'Educational and relationship building' },
    { value: 'promotional', label: 'Promotional', desc: 'Sales and special offers' },
    { value: 'newsletter', label: 'Newsletter', desc: 'Regular updates and news' },
    { value: 'welcome', label: 'Welcome', desc: 'Onboarding new contacts' },
    { value: 'follow-up', label: 'Follow-up', desc: 'Post-interaction engagement' }
  ];

  const platforms = [
    { value: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { value: 'messenger', label: 'Messenger', icon: 'fab fa-facebook-messenger', color: '#0084FF' },
    { value: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F' },
    { value: 'email', label: 'Email', icon: 'fas fa-envelope', color: '#EA4335' }
  ];

  const handlePlatformToggle = (platform) => {
    const currentPlatforms = data.platforms || [];
    const updatedPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    onChange('platforms', updatedPlatforms);
  };

  return (
    <div className="basic-info-step">
      <div className="step-header">
        <h4>Campaign Basic Information</h4>
        <p>Set up the fundamental details of your campaign</p>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <div className="form-group">
            <label>Campaign Name *</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Enter campaign name..."
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={data.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Describe your campaign purpose and goals..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Campaign Type *</label>
            <div className="type-grid">
              {campaignTypes.map(type => (
                <div
                  key={type.value}
                  className={`type-card ${data.type === type.value ? 'selected' : ''}`}
                  onClick={() => onChange('type', type.value)}
                >
                  <div className="type-label">{type.label}</div>
                  <div className="type-desc">{type.desc}</div>
                </div>
              ))}
            </div>
            {errors.type && <span className="error-text">{errors.type}</span>}
          </div>

          <div className="form-group">
            <label>Platforms *</label>
            <div className="platform-grid">
              {platforms.map(platform => (
                <div
                  key={platform.value}
                  className={`platform-card ${data.platforms?.includes(platform.value) ? 'selected' : ''}`}
                  onClick={() => handlePlatformToggle(platform.value)}
                >
                  <i className={platform.icon} style={{ color: platform.color }}></i>
                  <span>{platform.label}</span>
                </div>
              ))}
            </div>
            {errors.platforms && <span className="error-text">{errors.platforms}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Audience Selection Component
const AudienceStep = ({ data, errors, audiencePreview, audienceCount, onChange, onNestedChange }) => {
  const audienceTypes = [
    { value: 'all', label: 'All Contacts', desc: 'Send to all contacts in your database' },
    { value: 'segments', label: 'Smart Segments', desc: 'Use filters to target specific groups' },
    { value: 'custom', label: 'Custom Selection', desc: 'Manually select specific contacts' }
  ];

  const stages = ['lead', 'prospect', 'customer', 'inactive'];
  const platforms = ['whatsapp', 'messenger', 'instagram', 'email', 'website'];

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    onNestedChange('audienceFilters', 'tags', tags);
  };

  return (
    <div className="audience-step">
      <div className="step-header">
        <h4>Select Your Audience</h4>
        <p>Choose who will receive this campaign</p>
      </div>

      <div className="audience-types">
        {audienceTypes.map(type => (
          <div
            key={type.value}
            className={`audience-type-card ${data.audienceType === type.value ? 'selected' : ''}`}
            onClick={() => onChange('audienceType', type.value)}
          >
            <div className="type-header">
              <input
                type="radio"
                checked={data.audienceType === type.value}
                readOnly
              />
              <div className="type-info">
                <h5>{type.label}</h5>
                <p>{type.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Segments Filters */}
      {data.audienceType === 'segments' && (
        <div className="segment-filters">
          <h5>Audience Filters</h5>
          <div className="filter-grid">
            <div className="filter-group">
              <label>Stage</label>
              <select
                value={data.audienceFilters.stage}
                onChange={(e) => onNestedChange('audienceFilters', 'stage', e.target.value)}
              >
                <option value="">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Platform</label>
              <select
                value={data.audienceFilters.platform}
                onChange={(e) => onNestedChange('audienceFilters', 'platform', e.target.value)}
              >
                <option value="">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={data.audienceFilters.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="vip, priority, interested..."
              />
            </div>

            <div className="filter-group">
              <label>Last Interaction</label>
              <select
                value={data.audienceFilters.lastInteraction}
                onChange={(e) => onNestedChange('audienceFilters', 'lastInteraction', e.target.value)}
              >
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Audience Preview */}
      <div className="audience-preview">
        <div className="preview-header">
          <h5>Audience Preview</h5>
          <div className="audience-count">
            <span className="count">{audienceCount}</span>
            <span className="label">total recipients</span>
          </div>
        </div>

        {audiencePreview.length > 0 ? (
          <div className="preview-list">
            {audiencePreview.map(contact => (
              <div key={contact._id} className="contact-preview">
                <img
                  src={contact.profilePicture || '/default-avatar.png'}
                  alt={contact.name}
                  className="contact-avatar"
                />
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-details">
                    {contact.phone || contact.email} • {contact.stage}
                  </div>
                </div>
                <div className="contact-platform">
                  <span className={`platform-badge ${contact.platform}`}>
                    {contact.platform}
                  </span>
                </div>
              </div>
            ))}
            {audienceCount > 10 && (
              <div className="preview-more">
                +{audienceCount - 10} more contacts
              </div>
            )}
          </div>
        ) : (
          <div className="empty-preview">
            <i className="fas fa-users"></i>
            <p>No contacts match your criteria</p>
          </div>
        )}

        {errors.audience && <span className="error-text">{errors.audience}</span>}
      </div>
    </div>
  );
};

// Step 3: Message Creation Component
const MessageStep = ({ data, errors, templates, onChange, onNestedChange }) => {
  const [previewMessage, setPreviewMessage] = useState('');

  useEffect(() => {
    generatePreview();
  }, [data.messageType, data.templateId, data.customMessage, data.personalization]);

  const generatePreview = () => {
    let content = '';
    
    if (data.messageType === 'template' && data.templateId) {
      const template = templates.find(t => t._id === data.templateId);
      content = template ? template.content : '';
    } else if (data.messageType === 'custom') {
      content = data.customMessage.content;
    }
    
    // Apply personalization
    if (data.personalization.useContactName) {
      content = content.replace(/\{name\}/g, 'John Doe');
    }
    if (data.personalization.useCompanyName) {
      content = content.replace(/\{company\}/g, 'Example Company');
    }
    
    setPreviewMessage(content);
  };

  const handleAddButton = () => {
    const newButton = { text: '', action: 'url', value: '' };
    const updatedButtons = [...(data.customMessage.buttons || []), newButton];
    onNestedChange('customMessage', 'buttons', updatedButtons);
  };

  const handleUpdateButton = (index, field, value) => {
    const updatedButtons = [...data.customMessage.buttons];
    updatedButtons[index] = { ...updatedButtons[index], [field]: value };
    onNestedChange('customMessage', 'buttons', updatedButtons);
  };

  const handleRemoveButton = (index) => {
    const updatedButtons = data.customMessage.buttons.filter((_, i) => i !== index);
    onNestedChange('customMessage', 'buttons', updatedButtons);
  };

  return (
    <div className="message-step">
      <div className="step-header">
        <h4>Create Your Message</h4>
        <p>Design the content that will be sent to your audience</p>
      </div>

      <div className="message-options">
        <div className="message-types">
          <div
            className={`message-type-card ${data.messageType === 'template' ? 'selected' : ''}`}
            onClick={() => onChange('messageType', 'template')}
          >
            <input type="radio" checked={data.messageType === 'template'} readOnly />
            <div className="type-info">
              <h5>Use Template</h5>
              <p>Select from pre-designed message templates</p>
            </div>
          </div>

          <div
            className={`message-type-card ${data.messageType === 'custom' ? 'selected' : ''}`}
            onClick={() => onChange('messageType', 'custom')}
          >
            <input type="radio" checked={data.messageType === 'custom'} readOnly />
            <div className="type-info">
              <h5>Custom Message</h5>
              <p>Create a new message from scratch</p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        {data.messageType === 'template' && (
          <div className="template-selection">
            <label>Select Template *</label>
            <div className="template-grid">
              {templates.map(template => (
                <div
                  key={template._id}
                  className={`template-card ${data.templateId === template._id ? 'selected' : ''}`}
                  onClick={() => onChange('templateId', template._id)}
                >
                  <div className="template-header">
                    <h6>{template.name}</h6>
                    <span className="template-type">{template.type}</span>
                  </div>
                  <div className="template-preview">
                    {template.content.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
            {errors.template && <span className="error-text">{errors.template}</span>}
          </div>
        )}

        {/* Custom Message Creation */}
        {data.messageType === 'custom' && (
          <div className="custom-message">
            <div className="form-grid">
              <div className="form-group">
                <label>Subject (for email campaigns)</label>
                <input
                  type="text"
                  value={data.customMessage.subject}
                  onChange={(e) => onNestedChange('customMessage', 'subject', e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>

              <div className="form-group">
                <label>Message Content *</label>
                <textarea
                  value={data.customMessage.content}
                  onChange={(e) => onNestedChange('customMessage', 'content', e.target.value)}
                  placeholder="Write your message here... Use {name} for personalization"
                  rows="6"
                  className={errors.content ? 'error' : ''}
                />
                {errors.content && <span className="error-text">{errors.content}</span>}
              </div>

              <div className="form-group">
                <label>Media (optional)</label>
                <div className="media-upload">
                  <input
                    type="url"
                    value={data.customMessage.mediaUrl}
                    onChange={(e) => onNestedChange('customMessage', 'mediaUrl', e.target.value)}
                    placeholder="Enter media URL..."
                  />
                  <select
                    value={data.customMessage.mediaType}
                    onChange={(e) => onNestedChange('customMessage', 'mediaType', e.target.value)}
                  >
                    <option value="">Select type</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="message-buttons">
              <div className="buttons-header">
                <label>Action Buttons</label>
                <button type="button" onClick={handleAddButton} className="add-button-btn">
                  <i className="fas fa-plus"></i>
                  Add Button
                </button>
              </div>

              {data.customMessage.buttons?.map((button, index) => (
                <div key={index} className="button-editor">
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => handleUpdateButton(index, 'text', e.target.value)}
                    placeholder="Button text"
                  />
                  <select
                    value={button.action}
                    onChange={(e) => handleUpdateButton(index, 'action', e.target.value)}
                  >
                    <option value="url">Open URL</option>
                    <option value="phone">Call Phone</option>
                    <option value="reply">Quick Reply</option>
                  </select>
                  <input
                    type="text"
                    value={button.value}
                    onChange={(e) => handleUpdateButton(index, 'value', e.target.value)}
                    placeholder={button.action === 'url' ? 'https://...' : button.action === 'phone' ? '+1234567890' : 'Reply text'}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(index)}
                    className="remove-button-btn"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalization Settings */}
        <div className="personalization-settings">
          <h5>Personalization</h5>
          <div className="personalization-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.personalization.useContactName}
                onChange={(e) => onNestedChange('personalization', 'useContactName', e.target.checked)}
              />
              Use contact name ({'{name}'})
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={data.personalization.useCompanyName}
                onChange={(e) => onNestedChange('personalization', 'useCompanyName', e.target.checked)}
              />
              Use company name ({'{company}'})
            </label>
          </div>
        </div>
      </div>

      {/* Message Preview */}
      <div className="message-preview">
        <h5>Preview</h5>
        <div className="preview-container">
          <div className="preview-message">
            {data.customMessage.subject && (
              <div className="preview-subject">
                <strong>Subject:</strong> {data.customMessage.subject}
              </div>
            )}
            <div className="preview-content">
              {previewMessage || 'Your message will appear here...'}
            </div>
            {data.customMessage.mediaUrl && (
              <div className="preview-media">
                <i className="fas fa-paperclip"></i>
                Media: {data.customMessage.mediaType} attachment
              </div>
            )}
            {data.customMessage.buttons?.map((button, index) => (
              <div key={index} className="preview-button">
                📱 {button.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 4: Schedule Settings Component
const ScheduleStep = ({ data, errors, onChange, onNestedChange }) => {
  const scheduleTypes = [
    { value: 'now', label: 'Send Now', desc: 'Send immediately after launch' },
    { value: 'scheduled', label: 'Schedule', desc: 'Send at a specific date and time' },
    { value: 'recurring', label: 'Recurring', desc: 'Send repeatedly on schedule' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const days = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' }
  ];

  const handleDayToggle = (day) => {
    const currentDays = data.recurringSettings.days || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onNestedChange('recurringSettings', 'days', updatedDays);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="schedule-step">
      <div className="step-header">
        <h4>Schedule Your Campaign</h4>
        <p>When should this campaign be sent?</p>
      </div>

      <div className="schedule-types">
        {scheduleTypes.map(type => (
          <div
            key={type.value}
            className={`schedule-type-card ${data.scheduleType === type.value ? 'selected' : ''}`}
            onClick={() => onChange('scheduleType', type.value)}
          >
            <input type="radio" checked={data.scheduleType === type.value} readOnly />
            <div className="type-info">
              <h5>{type.label}</h5>
              <p>{type.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled Settings */}
      {data.scheduleType === 'scheduled' && (
        <div className="scheduled-settings">
          <div className="form-grid">
            <div className="form-group">
              <label>Schedule Date & Time *</label>
              <input
                type="datetime-local"
                value={data.scheduledAt}
                onChange={(e) => onChange('scheduledAt', e.target.value)}
                min={getMinDateTime()}
                className={errors.schedule ? 'error' : ''}
              />
              {errors.schedule && <span className="error-text">{errors.schedule}</span>}
            </div>

            <div className="form-group">
              <label>Timezone</label>
              <select
                value={data.timezone}
                onChange={(e) => onChange('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Dubai">Dubai</option>
                <option value="Asia/Kolkata">India</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Settings */}
      {data.scheduleType === 'recurring' && (
        <div className="recurring-settings">
          <div className="form-grid">
            <div className="form-group">
              <label>Frequency</label>
              <select
                value={data.recurringSettings.frequency}
                onChange={(e) => onNestedChange('recurringSettings', 'frequency', e.target.value)}
              >
                {frequencies.map(freq => (
                  <option key={freq.value} value={freq.value}>{freq.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={data.recurringSettings.time}
                onChange={(e) => onNestedChange('recurringSettings', 'time', e.target.value)}
              />
            </div>
          </div>

          {data.recurringSettings.frequency === 'weekly' && (
            <div className="days-selection">
              <label>Days of Week *</label>
              <div className="days-grid">
                {days.map(day => (
                  <div
                    key={day.value}
                    className={`day-card ${data.recurringSettings.days?.includes(day.value) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(day.value)}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
              {errors.recurring && <span className="error-text">{errors.recurring}</span>}
            </div>
          )}

          <div className="form-group">
            <label>End Date (optional)</label>
            <input
              type="date"
              value={data.recurringSettings.endDate}
              onChange={(e) => onNestedChange('recurringSettings', 'endDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="advanced-options">
        <h5>Advanced Options</h5>
        <div className="options-grid">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.trackingEnabled}
              onChange={(e) => onChange('trackingEnabled', e.target.checked)}
            />
            Enable tracking (opens, clicks, etc.)
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={data.unsubscribeEnabled}
              onChange={(e) => onChange('unsubscribeEnabled', e.target.checked)}
            />
            Include unsubscribe link
          </label>
        </div>
      </div>
    </div>
  );
};

// Step 5: Review & Launch Component
const ReviewStep = ({ data, audienceCount, templates }) => {
  const getSelectedTemplate = () => {
    if (data.messageType === 'template' && data.templateId) {
      return templates.find(t => t._id === data.templateId);
    }
    return null;
  };

  const formatSchedule = () => {
    if (data.scheduleType === 'now') return 'Send immediately';
    if (data.scheduleType === 'scheduled') {
      return `Send on ${new Date(data.scheduledAt).toLocaleString()}`;
    }
    if (data.scheduleType === 'recurring') {
      const freq = data.recurringSettings.frequency;
      const time = data.recurringSettings.time;
      const days = data.recurringSettings.days?.join(', ') || '';
      return `Send ${freq} at ${time}${days ? ` on ${days}` : ''}`;
    }
  };

  return (
    <div className="review-step">
      <div className="step-header">
        <h4>Review & Launch</h4>
        <p>Review your campaign details before launching</p>
      </div>

      <div className="review-sections">
        <div className="review-section">
          <h5>Campaign Details</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{data.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{data.type}</span>
            </div>
            <div className="detail-item">
              <span className="label">Platforms:</span>
              <span className="value">{data.platforms?.join(', ')}</span>
            </div>
            <div className="detail-item">
              <span className="label">Description:</span>
              <span className="value">{data.description || 'No description'}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h5>Audience</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Target:</span>
              <span className="value">{data.audienceType}</span>
            </div>
            <div className="detail-item">
              <span className="label">Recipients:</span>
              <span className="value">{audienceCount} contacts</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h5>Message</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Type:</span>
              <span className="value">{data.messageType}</span>
            </div>
            {data.messageType === 'template' && (
              <div className="detail-item">
                <span className="label">Template:</span>
                <span className="value">{getSelectedTemplate()?.name || 'Unknown'}</span>
              </div>
            )}
            {data.messageType === 'custom' && data.customMessage.subject && (
              <div className="detail-item">
                <span className="label">Subject:</span>
                <span className="value">{data.customMessage.subject}</span>
              </div>
            )}
          </div>
          
          <div className="message-preview-final">
            <h6>Message Preview:</h6>
            <div className="preview-content">
              {data.messageType === 'template' 
                ? getSelectedTemplate()?.content?.substring(0, 200) + '...'
                : data.customMessage.content?.substring(0, 200) + '...'
              }
            </div>
          </div>
        </div>

        <div className="review-section">
          <h5>Schedule</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">When:</span>
              <span className="value">{formatSchedule()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Timezone:</span>
              <span className="value">{data.timezone}</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h5>Settings</h5>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="label">Tracking:</span>
              <span className="value">{data.trackingEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Unsubscribe:</span>
              <span className="value">{data.unsubscribeEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="launch-summary">
        <div className="summary-box">
          <h6>Launch Summary</h6>
          <p>
            Your <strong>{data.type}</strong> campaign "<strong>{data.name}</strong>" 
            will be sent to <strong>{audienceCount} recipients</strong> 
            via <strong>{data.platforms?.join(', ')}</strong>.
          </p>
          <p>
            {formatSchedule()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilder;