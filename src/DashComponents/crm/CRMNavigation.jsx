// CRMNavigation.jsx - Navigation component for CRM modules
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CRMNavigation.scss';

const CRMNavigation = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'fas fa-chart-line',
      path: '/admin/crm/dashboard',
      description: 'Overview and analytics'
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: 'fas fa-users',
      path: '/admin/crm/contacts',
      description: 'Manage customer contacts',
      badge: null
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      icon: 'fas fa-bullhorn',
      path: '/admin/crm/campaigns',
      description: 'Marketing campaigns'
    },
    {
      id: 'inbox',
      label: 'Unified Inbox',
      icon: 'fas fa-inbox',
      path: '/admin/crm/inbox',
      description: 'All conversations',
      badge: { count: 0, type: 'info' }
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: 'fas fa-file-alt',
      path: '/admin/crm/templates',
      description: 'Message templates'
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: 'fas fa-cogs',
      path: '/admin/crm/automation',
      description: 'Automated workflows'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'fas fa-chart-bar',
      path: '/admin/crm/analytics',
      description: 'Performance metrics'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'fas fa-cog',
      path: '/admin/crm/settings',
      description: 'CRM configuration'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`crm-navigation ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="nav-header">
        <div className="nav-brand">
          <div className="brand-icon">
            <i className="fas fa-headset"></i>
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <h3>CRM Suite</h3>
              <p>Customer Management</p>
            </div>
          )}
        </div>
        
        <button 
          className="collapse-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          <i className={`fas fa-angle-${isCollapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <ul className="nav-list">
          {navigationItems.map((item) => (
            <li key={item.id} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <div className="nav-icon">
                  <i className={item.icon}></i>
                </div>
                
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}

                {/* Badge for notifications/counts */}
                {!isCollapsed && item.badge && (
                  <div className={`nav-badge ${item.badge.type}`}>
                    {item.badge.count > 0 ? item.badge.count : ''}
                  </div>
                )}

                {/* Active indicator */}
                {isActiveRoute(item.path) && (
                  <div className="active-indicator"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="nav-footer">
        {!isCollapsed && (
          <div className="footer-content">
            <div className="connection-status">
              <div className="status-indicator online"></div>
              <span>WhatsApp Connected</span>
            </div>
            
            <div className="quick-stats">
              <div className="stat-item">
                <i className="fas fa-comments"></i>
                <span>24 Active Chats</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-clock"></i>
                <span>2 Pending</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Collapse toggle for footer */}
        {isCollapsed && (
          <div className="collapsed-footer">
            <div className="status-dot online" title="WhatsApp Connected"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CRMNavigation;