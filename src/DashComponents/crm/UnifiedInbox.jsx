import React, { useState, useEffect, useRef } from 'react';
import './UnifiedInbox.scss';
import CRMApi from '../../../services/CRMApi';

const UnifiedInbox = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    status: '',
    assignedAgent: ''
  });
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [filters]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await CRMApi.getUnifiedInbox(filters);
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      CRMApi.showError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setMessageLoading(true);
      const response = await CRMApi.getConversationMessages(conversationId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      CRMApi.showError('Failed to load messages');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        content: newMessage,
        type: 'text'
      };

      await CRMApi.sendMessage(selectedConversation._id, messageData);
      setNewMessage('');
      
      // Refresh messages
      await fetchMessages(selectedConversation._id);
      
      CRMApi.showSuccess('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      CRMApi.showError('Failed to send message');
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    setMessages([]);
  };

  const updateConversationStatus = async (status) => {
    if (!selectedConversation) return;

    try {
      await CRMApi.updateConversation(selectedConversation._id, { status });
      
      // Update local state
      setSelectedConversation(prev => ({ ...prev, status }));
      setConversations(prev => 
        prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { ...conv, status }
            : conv
        )
      );
      
      CRMApi.showSuccess(`Conversation marked as ${status}`);
    } catch (error) {
      console.error('Error updating conversation:', error);
      CRMApi.showError('Failed to update conversation status');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'success',
      pending: 'warning',
      closed: 'secondary',
      resolved: 'info'
    };
    return colors[status] || 'secondary';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      whatsapp: { icon: 'fab fa-whatsapp', color: '#25D366' },
      messenger: { icon: 'fab fa-facebook-messenger', color: '#0084FF' },
      instagram: { icon: 'fab fa-instagram', color: '#E4405F' },
      email: { icon: 'fas fa-envelope', color: '#EA4335' },
      website: { icon: 'fas fa-globe', color: '#6366F1' }
    };
    return icons[platform] || { icon: 'fas fa-comment', color: '#6B7280' };
  };

  if (loading) {
    return (
      <div className="inbox-loading">
        <div className="loading-spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="unified-inbox">
      {/* Conversations Sidebar */}
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <h3>Messages</h3>
          <div className="header-actions">
            <button className="btn-icon" title="Refresh">
              <i className="fas fa-sync-alt"></i>
            </button>
            <button className="btn-icon" title="Filters">
              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="conversation-filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="closed">Closed</option>
            <option value="resolved">Resolved</option>
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
            <option value="website">Website</option>
          </select>
        </div>

        {/* Conversation List */}
        <div className="conversation-list">
          {conversations.length > 0 ? (
            conversations.map(conversation => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                isSelected={selectedConversation?._id === conversation._id}
                onClick={() => handleConversationClick(conversation)}
                getPlatformIcon={getPlatformIcon}
                getStatusColor={getStatusColor}
              />
            ))
          ) : (
            <div className="empty-conversations">
              <i className="fas fa-inbox"></i>
              <p>No conversations found</p>
              <small>Try adjusting your filters</small>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="contact-info">
                <div className="contact-avatar">
                  <img 
                    src={selectedConversation.contactId?.profilePicture || '/default-avatar.png'}
                    alt={selectedConversation.contactId?.name || 'Contact'}
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div 
                    className="platform-indicator"
                    style={{ color: getPlatformIcon(selectedConversation.platform).color }}
                  >
                    <i className={getPlatformIcon(selectedConversation.platform).icon}></i>
                  </div>
                </div>
                <div className="contact-details">
                  <h4>{selectedConversation.contactId?.name || 'Unknown Contact'}</h4>
                  <p>
                    {selectedConversation.contactId?.phone || selectedConversation.contactId?.email || 'No contact info'}
                  </p>
                </div>
              </div>

              <div className="chat-actions">
                <div className="status-selector">
                  <select
                    value={selectedConversation.status}
                    onChange={(e) => updateConversationStatus(e.target.value)}
                    className={`status-select ${getStatusColor(selectedConversation.status)}`}
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                
                <button className="btn-icon" title="Contact Info">
                  <i className="fas fa-info-circle"></i>
                </button>
                <button className="btn-icon" title="More Options">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="messages-container">
              {messageLoading ? (
                <div className="message-loading">
                  <div className="loading-spinner small"></div>
                  <p>Loading messages...</p>
                </div>
              ) : (
                <>
                  {messages.map(message => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Composer */}
            <div className="message-composer">
              <form onSubmit={handleSendMessage} className="composer-form">
                <div className="composer-input">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows="1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <div className="composer-actions">
                    <button type="button" className="btn-icon" title="Attach File">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <button type="button" className="btn-icon" title="Emoji">
                      <i className="fas fa-smile"></i>
                    </button>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="send-button"
                  disabled={!newMessage.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <i className="fas fa-comments"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Info Panel */}
      <div className="contact-panel">
        {selectedConversation && (
          <ContactInfoPanel
            contact={selectedConversation.contactId}
            conversation={selectedConversation}
          />
        )}
      </div>
    </div>
  );
};

// Conversation Item Component
const ConversationItem = ({ conversation, isSelected, onClick, getPlatformIcon, getStatusColor }) => {
  const platformInfo = getPlatformIcon(conversation.platform);
  
  return (
    <div
      className={`conversation-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        <img
          src={conversation.contactId?.profilePicture || '/default-avatar.png'}
          alt={conversation.contactId?.name || 'Contact'}
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div className="platform-badge" style={{ color: platformInfo.color }}>
          <i className={platformInfo.icon}></i>
        </div>
        {conversation.unreadCount > 0 && (
          <span className="unread-count">{conversation.unreadCount}</span>
        )}
      </div>

      <div className="conversation-content">
        <div className="conversation-header">
          <h5 className="contact-name">
            {conversation.contactId?.name || 'Unknown Contact'}
          </h5>
          <span className="timestamp">
            {formatTimestamp(conversation.lastMessageAt)}
          </span>
        </div>

        <div className="last-message">
          <p>{conversation.lastMessage?.content || 'No messages yet'}</p>
        </div>

        <div className="conversation-meta">
          <span className={`status-badge ${getStatusColor(conversation.status)}`}>
            {conversation.status}
          </span>
          {conversation.priority !== 'medium' && (
            <span className={`priority-badge ${conversation.priority}`}>
              {conversation.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isOutbound = message.direction === 'outbound';
  
  return (
    <div className={`message-bubble ${isOutbound ? 'outbound' : 'inbound'}`}>
      <div className="bubble-content">
        <p>{message.content}</p>
        {message.mediaUrl && (
          <div className="message-media">
            {message.type === 'image' ? (
              <img src={message.mediaUrl} alt="Shared image" />
            ) : (
              <div className="media-placeholder">
                <i className="fas fa-file"></i>
                <span>Media file</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="message-meta">
        <span className="timestamp">{formatTimestamp(message.createdAt)}</span>
        {isOutbound && (
          <div className="message-status">
            {getMessageStatusIcon(message.status)}
          </div>
        )}
      </div>
    </div>
  );
};

// Contact Info Panel Component
const ContactInfoPanel = ({ contact, conversation }) => {
  if (!contact) return null;

  return (
    <div className="contact-info-panel">
      <div className="panel-header">
        <h4>Contact Information</h4>
      </div>

      <div className="contact-profile">
        <div className="profile-avatar">
          <img
            src={contact.profilePicture || '/default-avatar.png'}
            alt={contact.name}
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        <h3>{contact.name}</h3>
        <p className="contact-stage">{contact.stage}</p>
      </div>

      <div className="contact-details">
        <div className="detail-item">
          <label>Platform</label>
          <span>{contact.platform}</span>
        </div>
        
        {contact.phone && (
          <div className="detail-item">
            <label>Phone</label>
            <span>{contact.phone}</span>
          </div>
        )}
        
        {contact.email && (
          <div className="detail-item">
            <label>Email</label>
            <span>{contact.email}</span>
          </div>
        )}
        
        <div className="detail-item">
          <label>Total Interactions</label>
          <span>{contact.totalInteractions || 0}</span>
        </div>
        
        <div className="detail-item">
          <label>Last Interaction</label>
          <span>{formatTimestamp(contact.lastInteraction)}</span>
        </div>
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="contact-tags">
          <label>Tags</label>
          <div className="tags-list">
            {contact.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="panel-actions">
        <button className="btn-outline">View Full Profile</button>
        <button className="btn-primary">Edit Contact</button>
      </div>
    </div>
  );
};

// Helper Functions
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  
  return date.toLocaleDateString();
};

const getMessageStatusIcon = (status) => {
  const statusIcons = {
    sent: 'fas fa-check',
    delivered: 'fas fa-check-double',
    read: 'fas fa-check-double read',
    failed: 'fas fa-exclamation-triangle'
  };
  
  return <i className={statusIcons[status] || 'fas fa-clock'}></i>;
};

export default UnifiedInbox;