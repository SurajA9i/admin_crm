import React, { useState, useEffect } from 'react';
import './ContactManager.scss';
import CRMApi from '../../../services/CRMApi';
import ContactImport from './ContactImport';

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table', 'kanban'
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    stage: '',
    tags: '',
    isBlocked: ''
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20
  });

  // Sample data for demo
  const [sampleContacts] = useState([
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      phone: '+1234567890', 
      platform: 'WhatsApp', 
      stage: 'Lead', 
      tags: ['VIP', 'Travel Enthusiast'], 
      lastActivity: '2025-09-30',
      isBlocked: false,
      notes: 'Interested in safari packages'
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      phone: '+1234567891', 
      platform: 'WhatsApp', 
      stage: 'Customer', 
      tags: ['Regular', 'Repeat Customer'], 
      lastActivity: '2025-09-29',
      isBlocked: false,
      notes: 'Booked 3 trips this year'
    },
    { 
      id: 3, 
      firstName: 'Mike', 
      lastName: 'Johnson', 
      phone: '+1234567892', 
      platform: 'WhatsApp', 
      stage: 'Prospect', 
      tags: ['New'], 
      lastActivity: '2025-09-28',
      isBlocked: false,
      notes: 'Downloaded brochure'
    }
  ]);

  useEffect(() => {
    // Use sample data instead of API call for demo
    setContacts(sampleContacts);
    setLoading(false);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalCount: sampleContacts.length,
      limit: 20
    });
  }, [filters, pagination.currentPage, sampleContacts]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await CRMApi.getContacts(filters, pagination.currentPage, pagination.limit);
      
      // For demo, use sample data
      setContacts(sampleContacts);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalCount: sampleContacts.length,
        limit: 20
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      CRMApi.showError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = (contactId) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c._id));
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowContactModal(true);
  };

  const handleCreateContact = () => {
    setEditingContact(null);
    setShowContactModal(true);
  };

  const handleDeleteContacts = async () => {
    if (!selectedContacts.length) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`);
    if (!confirmed) return;

    try {
      // Delete contacts one by one (could be optimized with bulk delete API)
      await Promise.all(
        selectedContacts.map(contactId => CRMApi.deleteContact(contactId))
      );
      
      setSelectedContacts([]);
      await fetchContacts();
      CRMApi.showSuccess(`${selectedContacts.length} contact(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      CRMApi.showError('Failed to delete contacts');
    }
  };

  const handleBulkTag = async (tag) => {
    if (!selectedContacts.length) return;

    try {
      // Update contacts with new tag
      await Promise.all(
        selectedContacts.map(async (contactId) => {
          const contact = contacts.find(c => c._id === contactId);
          const updatedTags = [...new Set([...contact.tags, tag])];
          return CRMApi.updateContact(contactId, { tags: updatedTags });
        })
      );
      
      await fetchContacts();
      setSelectedContacts([]);
      CRMApi.showSuccess(`Tag "${tag}" added to ${selectedContacts.length} contact(s)`);
    } catch (error) {
      console.error('Error adding tags:', error);
      CRMApi.showError('Failed to add tags');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="contact-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <h2>Contact Management</h2>
          <p>{pagination.totalCount} total contacts</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => setShowImportModal(true)}
          >
            <i className="fas fa-upload"></i>
            Import Contacts
          </button>
          <button 
            className="btn-primary"
            onClick={handleCreateContact}
          >
            <i className="fas fa-plus"></i>
            Add Contact
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
              placeholder="Search contacts by name, email, or phone..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>

        <div className="filter-section">
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
            <option value="website">Website</option>
          </select>

          <select
            value={filters.stage}
            onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Stages</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="customer">Customer</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            type="text"
            placeholder="Filter by tags..."
            value={filters.tags}
            onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
            className="filter-input"
          />
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
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <i className="fas fa-columns"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bulk-actions">
          <div className="selected-info">
            <span>{selectedContacts.length} contact(s) selected</span>
          </div>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkTag('priority')} className="bulk-btn">
              <i className="fas fa-tag"></i>
              Add Tag
            </button>
            <button onClick={() => {}} className="bulk-btn">
              <i className="fas fa-paper-plane"></i>
              Send Message
            </button>
            <button onClick={handleDeleteContacts} className="bulk-btn danger">
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="contacts-loading">
          <div className="loading-spinner"></div>
          <p>Loading contacts...</p>
        </div>
      ) : (
        <>
          {/* Content Based on View Mode */}
          {viewMode === 'cards' && (
            <ContactCards
              contacts={contacts}
              selectedContacts={selectedContacts}
              onContactSelect={handleContactSelect}
              onSelectAll={handleSelectAll}
              onEditContact={handleEditContact}
            />
          )}
          
          {viewMode === 'table' && (
            <ContactTable
              contacts={contacts}
              selectedContacts={selectedContacts}
              onContactSelect={handleContactSelect}
              onSelectAll={handleSelectAll}
              onEditContact={handleEditContact}
            />
          )}
          
          {viewMode === 'kanban' && (
            <ContactKanban
              contacts={contacts}
              onEditContact={handleEditContact}
            />
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="page-btn"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="page-btn"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showContactModal && (
        <ContactModal
          contact={editingContact}
          onClose={() => setShowContactModal(false)}
          onSave={fetchContacts}
        />
      )}

      {showImportModal && (
        <ContactImportModal
          onClose={() => setShowImportModal(false)}
          onImportComplete={fetchContacts}
        />
      )}
    </div>
  );
};

// Contact Cards View Component
const ContactCards = ({ contacts, selectedContacts, onContactSelect, onSelectAll, onEditContact }) => {
  if (contacts.length === 0) {
    return (
      <div className="empty-contacts">
        <i className="fas fa-address-book"></i>
        <h3>No contacts found</h3>
        <p>Try adjusting your search and filter criteria</p>
      </div>
    );
  }

  return (
    <div className="contacts-cards">
      <div className="cards-header">
        <label className="select-all">
          <input
            type="checkbox"
            checked={selectedContacts.length === contacts.length && contacts.length > 0}
            onChange={onSelectAll}
          />
          Select All
        </label>
      </div>
      
      <div className="cards-grid">
        {contacts.map(contact => (
          <ContactCard
            key={contact._id}
            contact={contact}
            isSelected={selectedContacts.includes(contact._id)}
            onSelect={() => onContactSelect(contact._id)}
            onEdit={() => onEditContact(contact)}
          />
        ))}
      </div>
    </div>
  );
};

// Individual Contact Card Component
const ContactCard = ({ contact, isSelected, onSelect, onEdit }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      whatsapp: { icon: 'fab fa-whatsapp', color: '#25D366' },
      messenger: { icon: 'fab fa-facebook-messenger', color: '#0084FF' },
      instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
      email: { icon: 'fas fa-envelope', color: '#EA4335' },
      website: { icon: 'fas fa-globe', color: '#6366F1' }
    };
    return icons[platform] || { icon: 'fas fa-user', color: '#6B7280' };
  };

  const getStageColor = (stage) => {
    const colors = {
      lead: '#f59e0b',
      prospect: '#3b82f6',
      customer: '#10b981',
      inactive: '#6b7280'
    };
    return colors[stage] || '#6b7280';
  };

  const platformInfo = getPlatformIcon(contact.platform);

  return (
    <div className={`contact-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-header">
        <label className="card-checkbox">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
          />
        </label>
        
        <div className="contact-avatar">
          <img
            src={contact.profilePicture || '/default-avatar.png'}
            alt={contact.name}
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div className="platform-indicator" style={{ color: platformInfo.color }}>
            <i className={platformInfo.icon}></i>
          </div>
        </div>

        <div className="card-actions">
          <button onClick={onEdit} className="action-btn">
            <i className="fas fa-edit"></i>
          </button>
        </div>
      </div>

      <div className="card-body">
        <h4 className="contact-name">{contact.name}</h4>
        <p className="contact-info">
          {contact.phone || contact.email || 'No contact info'}
        </p>

        <div className="contact-stage">
          <span 
            className="stage-badge"
            style={{ backgroundColor: `${getStageColor(contact.stage)}20`, color: getStageColor(contact.stage) }}
          >
            {contact.stage}
          </span>
        </div>

        {contact.tags && contact.tags.length > 0 && (
          <div className="contact-tags">
            {contact.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
            {contact.tags.length > 3 && (
              <span className="tag more">+{contact.tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="contact-stats">
          <div className="stat">
            <span className="stat-label">Interactions</span>
            <span className="stat-value">{contact.totalInteractions || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Last Contact</span>
            <span className="stat-value">
              {contact.lastInteraction ? formatDate(contact.lastInteraction) : 'Never'}
            </span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="quick-actions">
          <button className="quick-btn" title="Send Message">
            <i className="fas fa-comment"></i>
          </button>
          <button className="quick-btn" title="Add Note">
            <i className="fas fa-sticky-note"></i>
          </button>
          <button className="quick-btn" title="View History">
            <i className="fas fa-history"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// Contact Table View Component  
const ContactTable = ({ contacts, selectedContacts, onContactSelect, onSelectAll, onEditContact }) => {
  if (contacts.length === 0) {
    return (
      <div className="empty-contacts">
        <i className="fas fa-address-book"></i>
        <h3>No contacts found</h3>
        <p>Try adjusting your search and filter criteria</p>
      </div>
    );
  }

  return (
    <div className="contacts-table">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedContacts.length === contacts.length && contacts.length > 0}
                onChange={onSelectAll}
              />
            </th>
            <th>Contact</th>
            <th>Platform</th>
            <th>Stage</th>
            <th>Tags</th>
            <th>Last Interaction</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <ContactTableRow
              key={contact._id}
              contact={contact}
              isSelected={selectedContacts.includes(contact._id)}
              onSelect={() => onContactSelect(contact._id)}
              onEdit={() => onEditContact(contact)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Contact Table Row Component
const ContactTableRow = ({ contact, isSelected, onSelect, onEdit }) => {
  const getPlatformIcon = (platform) => {
    const icons = {
      whatsapp: { icon: 'fab fa-whatsapp', color: '#25D366' },
      messenger: { icon: 'fab fa-facebook-messenger', color: '#0084FF' },
      instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
      email: { icon: 'fas fa-envelope', color: '#EA4335' },
      website: { icon: 'fas fa-globe', color: '#6366F1' }
    };
    return icons[platform] || { icon: 'fas fa-user', color: '#6B7280' };
  };

  const platformInfo = getPlatformIcon(contact.platform);

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
        <div className="contact-info">
          <img
            src={contact.profilePicture || '/default-avatar.png'}
            alt={contact.name}
            className="table-avatar"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          <div>
            <div className="contact-name">{contact.name}</div>
            <div className="contact-details">
              {contact.phone || contact.email || 'No contact info'}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className="platform-cell">
          <i className={platformInfo.icon} style={{ color: platformInfo.color }}></i>
          <span>{contact.platform}</span>
        </div>
      </td>
      <td>
        <span className={`stage-badge ${contact.stage}`}>
          {contact.stage}
        </span>
      </td>
      <td>
        <div className="tags-cell">
          {contact.tags && contact.tags.slice(0, 2).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {contact.tags && contact.tags.length > 2 && (
            <span className="tag more">+{contact.tags.length - 2}</span>
          )}
        </div>
      </td>
      <td>
        {contact.lastInteraction ? formatDate(contact.lastInteraction) : 'Never'}
      </td>
      <td>
        <div className="table-actions">
          <button onClick={onEdit} className="action-btn" title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button className="action-btn" title="Message">
            <i className="fas fa-comment"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

// Contact Kanban View Component
const ContactKanban = ({ contacts, onEditContact }) => {
  const stages = ['lead', 'prospect', 'customer', 'inactive'];
  
  const getContactsByStage = (stage) => {
    return contacts.filter(contact => contact.stage === stage);
  };

  return (
    <div className="contacts-kanban">
      {stages.map(stage => (
        <div key={stage} className="kanban-column">
          <div className="column-header">
            <h4>{stage.charAt(0).toUpperCase() + stage.slice(1)}s</h4>
            <span className="count">{getContactsByStage(stage).length}</span>
          </div>
          <div className="column-body">
            {getContactsByStage(stage).map(contact => (
              <div key={contact._id} className="kanban-card" onClick={() => onEditContact(contact)}>
                <div className="card-avatar">
                  <img
                    src={contact.profilePicture || '/default-avatar.png'}
                    alt={contact.name}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div className="card-content">
                  <h5>{contact.name}</h5>
                  <p>{contact.phone || contact.email}</p>
                  <div className="card-tags">
                    {contact.tags && contact.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Contact Modal Component (placeholder)
const ContactModal = ({ contact, onClose, onSave }) => {
  // This will be expanded in the next iteration
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{contact ? 'Edit Contact' : 'Add New Contact'}</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p>Contact form will be implemented next...</p>
        </div>
      </div>
    </div>
  );
};

// Contact Import Modal Component
const ContactImportModal = ({ onClose, onImportComplete }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={e => e.stopPropagation()}>
        <ContactImport onClose={onClose} onImportComplete={onImportComplete} />
      </div>
    </div>
  );
};

// Helper Functions
const formatDate = (date) => {
  if (!date) return 'Never';
  const now = new Date();
  const contactDate = new Date(date);
  const diffInDays = Math.floor((now - contactDate) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return contactDate.toLocaleDateString();
};

export default ContactManager;