import React, { useState, useEffect } from 'react';
import './CRMDashboard.scss';
// import CRMApi from '../../../services/CRMApi';

const CRMDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 1247,
    activeCampaigns: 8,
    messagesSent: 12500,
    responseRate: 68.5,
    newContactsThisMonth: 156,
    campaignPerformance: 87.2
  });
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // fetchDashboardData(); // Disabled for demo
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Demo data - replace with actual API calls when backend is ready
      setTimeout(() => {
        setStats({
          totalContacts: 1247 + Math.floor(Math.random() * 100),
          activeCampaigns: 8 + Math.floor(Math.random() * 5),
          messagesSent: 12500 + Math.floor(Math.random() * 1000),
          responseRate: 68.5 + (Math.random() * 10 - 5),
          newContactsThisMonth: 156 + Math.floor(Math.random() * 50),
          campaignPerformance: 87.2 + (Math.random() * 10 - 5)
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      CRMApi.showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="crm-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading CRM Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="crm-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            <i className="fas fa-chart-line"></i>
            CRM Dashboard
          </h2>
          <p className="dashboard-subtitle">
            Manage your customer relationships and communications
          </p>
        </div>
        
        <div className="header-actions">
          <div className="date-range-selector">
            <label>From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="date-input"
            />
            <label>To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="date-input"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts || 0}
          change={`+${stats.newContacts || 0} this period`}
          icon="fas fa-users"
          color="primary"
        />
        <StatCard
          title="Active Conversations"
          value={stats.activeConversations || 0}
          change={stats.openConversations ? `${stats.openConversations} open` : ''}
          icon="fas fa-comments"
          color="success"
        />
        <StatCard
          title="Messages Today"
          value={stats.todayMessages || 0}
          change={`${stats.inboundMessages || 0} inbound`}
          icon="fas fa-envelope"
          color="info"
        />
        <StatCard
          title="Avg Response Time"
          value={`${stats.avgResponseTime || 0}m`}
          change="Response time"
          icon="fas fa-clock"
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h4>Message Volume</h4>
            <p>Messages over time</p>
          </div>
          <div className="chart-body">
            <MessageVolumeChart data={stats} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>Platform Distribution</h4>
            <p>Messages by platform</p>
          </div>
          <div className="chart-body">
            <PlatformDistributionChart data={stats.platformDistribution || []} />
          </div>
        </div>
      </div>

      {/* Activity Grid */}
      <div className="activity-grid">
        <div className="activity-card">
          <div className="card-header">
            <h4>Recent Activity</h4>
            <i className="fas fa-clock"></i>
          </div>
          <div className="card-body">
            <RecentActivityList />
          </div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h4>Quick Actions</h4>
            <i className="fas fa-bolt"></i>
          </div>
          <div className="card-body">
            <QuickActions />
          </div>
        </div>

        <div className="activity-card">
          <div className="card-header">
            <h4>Conversion Funnel</h4>
            <i className="fas fa-funnel-dollar"></i>
          </div>
          <div className="card-body">
            <ConversionFunnel stats={stats} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">
      <i className={icon}></i>
    </div>
    <div className="stat-content">
      <h3 className="stat-value">{value}</h3>
      <p className="stat-title">{title}</p>
      {change && (
        <div className="stat-change">
          <span>{change}</span>
        </div>
      )}
    </div>
  </div>
);

// Message Volume Chart Component
const MessageVolumeChart = ({ data }) => {
  return (
    <div className="volume-chart">
      <div className="chart-placeholder">
        <div className="metric-item">
          <span className="metric-label">Total Messages</span>
          <span className="metric-value">{data.totalMessages || 0}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Inbound</span>
          <span className="metric-value">{data.inboundMessages || 0}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Outbound</span>
          <span className="metric-value">{data.outboundMessages || 0}</span>
        </div>
        <div className="chart-note">
          📊 Chart visualization will be added with Chart.js integration
        </div>
      </div>
    </div>
  );
};

// Platform Distribution Chart Component
const PlatformDistributionChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="platform-chart">
      {data.length > 0 ? (
        data.map((platform, index) => (
          <div key={platform._id} className="platform-item">
            <div className="platform-info">
              <span className="platform-icon">
                {getPlatformIcon(platform._id)}
              </span>
              <span className="platform-name">
                {platform._id.charAt(0).toUpperCase() + platform._id.slice(1)}
              </span>
            </div>
            <div className="platform-stats">
              <span className="platform-count">{platform.count}</span>
              <span className="platform-percentage">
                {total > 0 ? Math.round((platform.count / total) * 100) : 0}%
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="no-data">
          <i className="fas fa-chart-pie"></i>
          <p>No platform data available</p>
        </div>
      )}
    </div>
  );
};

// Recent Activity Component
const RecentActivityList = () => {
  return (
    <div className="activity-list">
      <div className="activity-item">
        <div className="activity-icon success">
          <i className="fas fa-user-plus"></i>
        </div>
        <div className="activity-content">
          <p>New contact added from WhatsApp</p>
          <span className="activity-time">2 minutes ago</span>
        </div>
      </div>
      <div className="activity-item">
        <div className="activity-icon info">
          <i className="fas fa-paper-plane"></i>
        </div>
        <div className="activity-content">
          <p>Campaign "Wildlife Updates" sent to 150 contacts</p>
          <span className="activity-time">1 hour ago</span>
        </div>
      </div>
      <div className="activity-item">
        <div className="activity-icon warning">
          <i className="fas fa-upload"></i>
        </div>
        <div className="activity-content">
          <p>Contact import completed: 50 new contacts</p>
          <span className="activity-time">3 hours ago</span>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  return (
    <div className="quick-actions">
      <button className="action-btn primary">
        <i className="fas fa-plus"></i>
        New Campaign
      </button>
      <button className="action-btn secondary">
        <i className="fas fa-upload"></i>
        Import Contacts
      </button>
      <button className="action-btn info">
        <i className="fas fa-broadcast-tower"></i>
        Quick Broadcast
      </button>
      <button className="action-btn success">
        <i className="fas fa-download"></i>
        Export Data
      </button>
    </div>
  );
};

// Conversion Funnel Component
const ConversionFunnel = ({ stats }) => {
  const leads = stats.totalContacts || 0;
  const prospects = Math.floor(leads * 0.3); // Mock data
  const customers = Math.floor(leads * 0.1); // Mock data
  
  return (
    <div className="conversion-funnel">
      <div className="funnel-stage">
        <div className="stage-bar leads" style={{ width: '100%' }}>
          <span className="stage-label">Leads</span>
          <span className="stage-count">{leads}</span>
        </div>
      </div>
      <div className="funnel-stage">
        <div className="stage-bar prospects" style={{ width: '70%' }}>
          <span className="stage-label">Prospects</span>
          <span className="stage-count">{prospects}</span>
        </div>
      </div>
      <div className="funnel-stage">
        <div className="stage-bar customers" style={{ width: '40%' }}>
          <span className="stage-label">Customers</span>
          <span className="stage-count">{customers}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to get platform icons
const getPlatformIcon = (platform) => {
  const icons = {
    whatsapp: '📱',
    messenger: '💬',
    instagram: '📸',
    email: '📧',
    website: '🌐'
  };
  return icons[platform] || '📱';
};

export default CRMDashboard;