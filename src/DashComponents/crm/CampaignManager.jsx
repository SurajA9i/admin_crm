import React, { useState, useEffect } from 'react';
import './CampaignManager.scss';
import CRMApi from '../../../services/CRMApi';
import CampaignBuilder from './CampaignBuilder';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table'
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    platform: ''
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 12
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filters, pagination.currentPage]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await CRMApi.getCampaigns(filters, pagination.currentPage, pagination.limit);
      
      setCampaigns(response.data.campaigns || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      CRMApi.showError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setShowCampaignModal(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleDeleteCampaign = async (campaignId) => {
    const confirmed = window.confirm('Are you sure you want to delete this campaign?');
    if (!confirmed) return;

    try {
      await CRMApi.deleteCampaign(campaignId);
      await fetchCampaigns();
      CRMApi.showSuccess('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      CRMApi.showError('Failed to delete campaign');
    }
  };

  const handleLaunchCampaign = async (campaignId) => {
    const confirmed = window.confirm('Are you sure you want to launch this campaign?');
    if (!confirmed) return;

    try {
      await CRMApi.launchCampaign(campaignId);
      await fetchCampaigns();
      CRMApi.showSuccess('Campaign launched successfully');
    } catch (error) {
      console.error('Error launching campaign:', error);
      CRMApi.showError('Failed to launch campaign');
    }
  };

  const handlePauseCampaign = async (campaignId) => {
    try {
      await CRMApi.pauseCampaign(campaignId);
      await fetchCampaigns();
      CRMApi.showSuccess('Campaign paused successfully');
    } catch (error) {
      console.error('Error pausing campaign:', error);
      CRMApi.showError('Failed to pause campaign');
    }
  };

  const handleCampaignSelect = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(c => c._id));
    }
  };

  const handleBulkAction = async (action) => {
    if (!selectedCampaigns.length) return;

    const confirmed = window.confirm(`Are you sure you want to ${action} ${selectedCampaigns.length} campaign(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedCampaigns.map(campaignId => {
          switch (action) {
            case 'delete':
              return CRMApi.deleteCampaign(campaignId);
            case 'pause':
              return CRMApi.pauseCampaign(campaignId);
            case 'launch':
              return CRMApi.launchCampaign(campaignId);
            default:
              return Promise.resolve();
          }
        })
      );
      
      setSelectedCampaigns([]);
      await fetchCampaigns();
      CRMApi.showSuccess(`Successfully ${action}ed ${selectedCampaigns.length} campaign(s)`);
    } catch (error) {
      console.error(`Error ${action}ing campaigns:`, error);
      CRMApi.showError(`Failed to ${action} campaigns`);
    }
  };

  return (
    <div className="campaign-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <h2>Campaign Management</h2>
          <p>{pagination.totalCount} total campaigns</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-primary" onClick={handleCreateCampaign}>
            <i className="fas fa-plus"></i>
            Create Campaign
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="manager-toolbar">
        <div className="search-section">
          <div className="search-input">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search campaigns by name or description..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div className="filter-section">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="broadcast">Broadcast</option>
            <option value="nurture">Nurture</option>
            <option value="promotional">Promotional</option>
            <option value="newsletter">Newsletter</option>
            <option value="welcome">Welcome</option>
            <option value="follow-up">Follow-up</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Platforms</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="messenger">Messenger</option>
            <option value="instagram">Instagram</option>
            <option value="email">Email</option>
          </select>
        </div>

        <div className="view-section">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCampaigns.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-info">
            <span>{selectedCampaigns.length} campaign(s) selected</span>
          </div>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkAction('launch')} className="bulk-btn">
              <i className="fas fa-play"></i>
              Launch
            </button>
            <button onClick={() => handleBulkAction('pause')} className="bulk-btn">
              <i className="fas fa-pause"></i>
              Pause
            </button>
            <button onClick={() => handleBulkAction('delete')} className="bulk-btn danger">
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="campaigns-loading">
          <div className="loading-spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      ) : (
        <>
          {/* Content Based on View Mode */}
          {viewMode === 'cards' && (
            <CampaignCards
              campaigns={campaigns}
              selectedCampaigns={selectedCampaigns}
              onCampaignSelect={handleCampaignSelect}
              onSelectAll={handleSelectAll}
              onEditCampaign={handleEditCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onLaunchCampaign={handleLaunchCampaign}
              onPauseCampaign={handlePauseCampaign}
            />
          )}
          
          {viewMode === 'table' && (
            <CampaignTable
              campaigns={campaigns}
              selectedCampaigns={selectedCampaigns}
              onCampaignSelect={handleCampaignSelect}
              onSelectAll={handleSelectAll}
              onEditCampaign={handleEditCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onLaunchCampaign={handleLaunchCampaign}
              onPauseCampaign={handlePauseCampaign}
            />
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="page-btn"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="page-btn"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <CampaignModal
          campaign={editingCampaign}
          onClose={() => setShowCampaignModal(false)}
          onSave={fetchCampaigns}
        />
      )}
    </div>
  );
};

// Campaign Cards View Component
const CampaignCards = ({ 
  campaigns, 
  selectedCampaigns, 
  onCampaignSelect, 
  onSelectAll, 
  onEditCampaign, 
  onDeleteCampaign,
  onLaunchCampaign,
  onPauseCampaign
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="empty-campaigns">
        <i className="fas fa-bullhorn"></i>
        <h3>No campaigns found</h3>
        <p>Create your first campaign to get started</p>
      </div>
    );
  }

  return (
    <div className="campaigns-cards">
      <div className="cards-header">
        <label className="select-all">
          <input
            type="checkbox"
            checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
            onChange={onSelectAll}
          />
          Select All
        </label>
      </div>
      
      <div className="cards-grid">
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign._id}
            campaign={campaign}
            isSelected={selectedCampaigns.includes(campaign._id)}
            onSelect={() => onCampaignSelect(campaign._id)}
            onEdit={() => onEditCampaign(campaign)}
            onDelete={() => onDeleteCampaign(campaign._id)}
            onLaunch={() => onLaunchCampaign(campaign._id)}
            onPause={() => onPauseCampaign(campaign._id)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Campaign Card Component
const CampaignCard = ({ 
  campaign, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onLaunch, 
  onPause 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      draft: '#6b7280',
      scheduled: '#f59e0b',
      active: '#10b981',
      paused: '#ef4444',
      completed: '#3b82f6',
      cancelled: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getTypeIcon = (type) => {
    const icons = {
      broadcast: 'fas fa-broadcast-tower',
      nurture: 'fas fa-seedling',
      promotional: 'fas fa-percentage',
      newsletter: 'fas fa-newspaper',
      welcome: 'fas fa-hand-wave',
      'follow-up': 'fas fa-reply'
    };
    return icons[type] || 'fas fa-bullhorn';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`campaign-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-header">
        <label className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
          />
        </label>
        
        <div className="campaign-type">
          <i className={getTypeIcon(campaign.type)}></i>
        </div>

        <div className="card-actions">
          <div className="dropdown">
            <button className="action-btn dropdown-toggle">
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <div className="dropdown-menu">
              <button onClick={onEdit}>
                <i className="fas fa-edit"></i>
                Edit
              </button>
              {campaign.status === 'draft' && (
                <button onClick={onLaunch}>
                  <i className="fas fa-play"></i>
                  Launch
                </button>
              )}
              {campaign.status === 'active' && (
                <button onClick={onPause}>
                  <i className="fas fa-pause"></i>
                  Pause
                </button>
              )}
              <button onClick={onDelete} className="danger">
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <h4 className="campaign-name">{campaign.name}</h4>
        <p className="campaign-description">{campaign.description || 'No description'}</p>

        <div className="campaign-status">
          <span 
            className="status-badge"
            style={{ 
              backgroundColor: `${getStatusColor(campaign.status)}20`, 
              color: getStatusColor(campaign.status) 
            }}
          >
            {campaign.status}
          </span>
        </div>

        <div className="campaign-stats">
          <div className="stat-group">
            <div className="stat">
              <span className="stat-label">Recipients</span>
              <span className="stat-value">{campaign.recipientCount || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Sent</span>
              <span className="stat-value">{campaign.sentCount || 0}</span>
            </div>
          </div>
          
          <div className="stat-group">
            <div className="stat">
              <span className="stat-label">Opens</span>
              <span className="stat-value">{campaign.openCount || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Clicks</span>
              <span className="stat-value">{campaign.clickCount || 0}</span>
            </div>
          </div>
        </div>

        <div className="campaign-meta">
          <div className="platform-indicators">
            {campaign.platforms && campaign.platforms.map(platform => {
              const platformIcons = {
                whatsapp: { icon: 'fab fa-whatsapp', color: '#25D366' },
                messenger: { icon: 'fab fa-facebook-messenger', color: '#0084FF' },
                instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
                email: { icon: 'fas fa-envelope', color: '#EA4335' }
              };
              const platformInfo = platformIcons[platform];
              
              return (
                <div key={platform} className="platform-indicator">
                  <i 
                    className={platformInfo?.icon || 'fas fa-question'} 
                    style={{ color: platformInfo?.color || '#6B7280' }}
                  ></i>
                </div>
              );
            })}
          </div>
          
          <div className="date-info">
            <span className="date-label">
              {campaign.status === 'scheduled' ? 'Scheduled for' : 'Created'}
            </span>
            <span className="date-value">
              {formatDate(campaign.scheduledAt || campaign.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${campaign.recipientCount ? (campaign.sentCount / campaign.recipientCount) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <span className="progress-text">
            {campaign.recipientCount ? Math.round((campaign.sentCount / campaign.recipientCount) * 100) : 0}% sent
          </span>
        </div>
      </div>
    </div>
  );
};

// Campaign Table View Component
const CampaignTable = ({ 
  campaigns, 
  selectedCampaigns, 
  onCampaignSelect, 
  onSelectAll, 
  onEditCampaign, 
  onDeleteCampaign,
  onLaunchCampaign,
  onPauseCampaign
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="empty-campaigns">
        <i className="fas fa-bullhorn"></i>
        <h3>No campaigns found</h3>
        <p>Create your first campaign to get started</p>
      </div>
    );
  }

  return (
    <div className="campaigns-table">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedCampaigns.length === campaigns.length && campaigns.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th>Campaign</th>
            <th>Type</th>
            <th>Status</th>
            <th>Platforms</th>
            <th>Recipients</th>
            <th>Progress</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <CampaignTableRow
              key={campaign._id}
              campaign={campaign}
              isSelected={selectedCampaigns.includes(campaign._id)}
              onSelect={() => onCampaignSelect(campaign._id)}
              onEdit={() => onEditCampaign(campaign)}
              onDelete={() => onDeleteCampaign(campaign._id)}
              onLaunch={() => onLaunchCampaign(campaign._id)}
              onPause={() => onPauseCampaign(campaign._id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Campaign Table Row Component
const CampaignTableRow = ({ 
  campaign, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onLaunch, 
  onPause 
}) => {
  const getStatusColor = (status) => {
    const colors = {
      draft: '#6b7280',
      scheduled: '#f59e0b',
      active: '#10b981',
      paused: '#ef4444',
      completed: '#3b82f6',
      cancelled: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <tr className={isSelected ? 'selected' : ''}>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
      <td>
        <div className="campaign-info">
          <div className="campaign-name">{campaign.name}</div>
          <div className="campaign-description">{campaign.description}</div>
        </div>
      </td>
      <td>
        <span className="campaign-type">{campaign.type}</span>
      </td>
      <td>
        <span 
          className="status-badge"
          style={{ 
            backgroundColor: `${getStatusColor(campaign.status)}20`, 
            color: getStatusColor(campaign.status) 
          }}
        >
          {campaign.status}
        </span>
      </td>
      <td>
        <div className="platform-list">
          {campaign.platforms && campaign.platforms.map(platform => (
            <span key={platform} className="platform-tag">{platform}</span>
          ))}
        </div>
      </td>
      <td>{campaign.recipientCount || 0}</td>
      <td>
        <div className="progress-mini">
          <div className="progress-bar-mini">
            <div 
              className="progress-fill-mini"
              style={{ 
                width: `${campaign.recipientCount ? (campaign.sentCount / campaign.recipientCount) * 100 : 0}%` 
              }}
            ></div>
          </div>
          <span className="progress-percent">
            {campaign.recipientCount ? Math.round((campaign.sentCount / campaign.recipientCount) * 100) : 0}%
          </span>
        </div>
      </td>
      <td>{formatDate(campaign.createdAt)}</td>
      <td>
        <div className="table-actions">
          <button onClick={onEdit} className="action-btn" title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          {campaign.status === 'draft' && (
            <button onClick={onLaunch} className="action-btn success" title="Launch">
              <i className="fas fa-play"></i>
            </button>
          )}
          {campaign.status === 'active' && (
            <button onClick={onPause} className="action-btn warning" title="Pause">
              <i className="fas fa-pause"></i>
            </button>
          )}
          <button onClick={onDelete} className="action-btn danger" title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Campaign Modal Component
const CampaignModal = ({ campaign, onClose, onSave }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content campaign-builder-modal" onClick={e => e.stopPropagation()}>
        <CampaignBuilder campaign={campaign} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
};

export default CampaignManager;