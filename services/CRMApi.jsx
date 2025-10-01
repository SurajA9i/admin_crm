import { ApiUrl } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

const CRMApi = {
  
  // ===== DASHBOARD APIS =====
  getDashboardStats: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/dashboard/stats?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getQuickStats: async () => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/dashboard/quick-stats`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== INBOX APIS =====
  getUnifiedInbox: async (filters = {}, page = 1, limit = 50) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/inbox?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getConversationMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (conversationId, messageData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/conversations/${conversationId}/messages`,
        messageData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateConversation: async (conversationId, updates) => {
    try {
      const response = await httpServiceInstance.patch(
        `${ApiUrl.CRM_BASE}/conversations/${conversationId}`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addConversationNote: async (conversationId, note, isPrivate = true) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/conversations/${conversationId}/notes`,
        { note, isPrivate }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== CONTACT APIS =====
  getContacts: async (filters = {}, page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContact: async (contactId) => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/${contactId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createContact: async (contactData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/contacts`,
        contactData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateContact: async (contactId, updates) => {
    try {
      const response = await httpServiceInstance.patch(
        `${ApiUrl.CRM_BASE}/contacts/${contactId}`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteContact: async (contactId) => {
    try {
      const response = await httpServiceInstance.delete(
        `${ApiUrl.CRM_BASE}/contacts/${contactId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContactSegments: async (segmentRules) => {
    try {
      const params = new URLSearchParams();
      Object.keys(segmentRules).forEach(key => {
        if (segmentRules[key]) {
          if (Array.isArray(segmentRules[key])) {
            params.append(key, segmentRules[key].join(','));
          } else {
            params.append(key, segmentRules[key]);
          }
        }
      });
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/segments/list?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== IMPORT APIS =====
  previewImportFile: async (formData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/import/preview`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  importContacts: async (contactsData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/contacts/import`,
        { contacts: contactsData }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  downloadImportTemplate: async () => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/import/template`,
        {
          responseType: 'blob',
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contact_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Template downloaded successfully' };
    } catch (error) {
      throw error;
    }
  },

  getImportStats: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/import/stats?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== CAMPAIGN APIS =====
  getCampaigns: async (filters = {}, page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      params.append('page', page);
      params.append('limit', limit);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/campaigns?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCampaign: async (campaignData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns`,
        campaignData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCampaign: async (campaignId, updates) => {
    try {
      const response = await httpServiceInstance.patch(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  executeCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/execute`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBroadcast: async (broadcastData) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/broadcast`,
        broadcastData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCampaignAnalytics: async (campaignId) => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/analytics`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== UTILITY FUNCTIONS =====
  formatError: (error) => {
    if (error.response && error.response.data) {
      return error.response.data.error || error.response.data.message || 'An error occurred';
    }
    return error.message || 'Network error occurred';
  },

  // ===== ADDITIONAL CAMPAIGN MANAGEMENT APIS =====
  updateCampaign: async (campaignId, data) => {
    try {
      const response = await httpServiceInstance.put(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.delete(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  pauseCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/pause`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resumeCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/resume`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  duplicateCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/duplicate`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkCampaignAction: async (action, campaignIds) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/bulk`,
        { action, campaignIds }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== ADDITIONAL CONTACT MANAGEMENT APIS =====
  updateContact: async (contactId, data) => {
    try {
      const response = await httpServiceInstance.put(
        `${ApiUrl.CRM_BASE}/contacts/${contactId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkContactAction: async (action, contactIds, data = {}) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/contacts/bulk`,
        { action, contactIds, data }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportContacts: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (Array.isArray(filters[key])) {
            params.append(key, filters[key].join(','));
          } else {
            params.append(key, filters[key]);
          }
        }
      });
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/export?${params}`,
        { responseType: format === 'csv' ? 'blob' : 'json' }
      );
      
      if (format === 'csv') {
        // Handle CSV download
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return { success: true, message: 'Export downloaded successfully' };
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContactAnalytics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/analytics?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== REAL-TIME METRICS =====
  getRealTimeMetrics: async () => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/dashboard/realtime-metrics`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== HEALTH CHECK =====
  healthCheck: async () => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/health`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== CAMPAIGN ANALYTICS =====
  getCampaignPerformance: async (campaignId, startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/analytics?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== CAMPAIGN BUILDER HELPERS =====
  validateCampaignData: (campaignData) => {
    const errors = {};
    
    // Basic Info validation
    if (!campaignData.name?.trim()) {
      errors.name = 'Campaign name is required';
    }
    
    if (!campaignData.type) {
      errors.type = 'Campaign type is required';
    }
    
    // Audience validation
    if (!campaignData.targetContacts?.length && 
        !campaignData.targetSegments?.length && 
        !campaignData.targetTags?.length) {
      errors.audience = 'At least one target audience must be selected';
    }
    
    // Message validation
    if (!campaignData.message?.trim()) {
      errors.message = 'Campaign message is required';
    }
    
    // Schedule validation
    if (campaignData.scheduleType === 'scheduled' && !campaignData.scheduledDate) {
      errors.schedule = 'Scheduled date is required for scheduled campaigns';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // ===== MOCK DATA GENERATORS FOR DEVELOPMENT =====
  generateMockDashboardData: () => ({
    totalContacts: 1245,
    totalCampaigns: 23,
    activeConversations: 45,
    messagesSent: 8943,
    engagementRate: 67.3,
    growthRate: 12.5,
    platforms: {
      whatsapp: 856,
      messenger: 234,
      instagram: 155
    },
    recentActivity: [
      { type: 'contact', message: 'New contact added: John Doe', time: '2 minutes ago' },
      { type: 'campaign', message: 'Campaign "Safari Special" launched', time: '15 minutes ago' },
      { type: 'message', message: '12 new messages received', time: '1 hour ago' }
    ]
  }),

  // ===== REAL-TIME METRICS API =====
  getRealTimeMetrics: async () => {
    try {
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/dashboard/realtime-metrics`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== ADDITIONAL CONTACT MANAGEMENT APIS =====
  updateContact: async (contactId, data) => {
    try {
      const response = await httpServiceInstance.put(
        `${ApiUrl.CRM_BASE}/contacts/${contactId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkContactOperations: async (action, contactIds, data = {}) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/contacts/bulk`,
        { action, contactIds, data }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportContacts: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/export?${params}`,
        { responseType: format === 'csv' ? 'blob' : 'json' }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getContactAnalytics: async (startDate, endDate) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await httpServiceInstance.get(
        `${ApiUrl.CRM_BASE}/contacts/analytics?${params}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== ADDITIONAL CAMPAIGN MANAGEMENT APIS =====
  pauseCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/pause`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resumeCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/resume`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  duplicateCampaign: async (campaignId) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/${campaignId}/duplicate`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkCampaignOperations: async (action, campaignIds) => {
    try {
      const response = await httpServiceInstance.post(
        `${ApiUrl.CRM_BASE}/campaigns/bulk`,
        { action, campaignIds }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateMockContactData: () => Array.from({ length: 50 }, (_, i) => ({
    id: `contact_${i + 1}`,
    name: `Contact ${i + 1}`,
    phone: `+91987654${3210 + i}`,
    email: `contact${i + 1}@example.com`,
    platform: ['whatsapp', 'messenger', 'instagram'][i % 3],
    stage: ['lead', 'prospect', 'customer'][i % 3],
    tags: [`tag${i % 5 + 1}`, `segment${i % 3 + 1}`],
    lastInteraction: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    totalInteractions: Math.floor(Math.random() * 50) + 1
  })),

  generateMockCampaignData: () => Array.from({ length: 20 }, (_, i) => ({
    id: `campaign_${i + 1}`,
    name: `Campaign ${i + 1}`,
    type: ['broadcast', 'drip', 'triggered'][i % 3],
    status: ['draft', 'running', 'completed', 'paused'][i % 4],
    targetCount: Math.floor(Math.random() * 1000) + 100,
    sentCount: Math.floor(Math.random() * 800) + 50,
    deliveredCount: Math.floor(Math.random() * 700) + 40,
    readCount: Math.floor(Math.random() * 400) + 20,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    platforms: ['whatsapp', 'messenger']
  })),

  // Notification helpers
  showSuccess: (message) => {
    // Integrate with your existing toast/notification system
    console.log('SUCCESS:', message);
  },

  showError: (message) => {
    // Integrate with your existing toast/notification system
    console.error('ERROR:', message);
  }
};

export default CRMApi;