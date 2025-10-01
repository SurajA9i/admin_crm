import React, { useState } from 'react';

const MessageTemplates = () => {
  const [templates] = useState([
    {
      id: 1,
      name: 'Welcome Message',
      status: 'Approved',
      category: 'Welcome',
      language: 'English',
      lastModified: '2025-09-30',
      content: 'Hello {{1}}, welcome to Junglore! We\'re excited to help you plan your next adventure.'
    },
    {
      id: 2,
      name: 'Booking Confirmation',
      status: 'Approved',
      category: 'Transactional',
      language: 'English',
      lastModified: '2025-09-29',
      content: 'Hi {{1}}, your booking #{{2}} for {{3}} has been confirmed. Check-in: {{4}}'
    },
    {
      id: 3,
      name: 'Special Offer',
      status: 'Pending',
      category: 'Promotional',
      language: 'English',
      lastModified: '2025-09-28',
      content: 'Exclusive offer for {{1}}! Save 20% on your next jungle adventure. Use code: JUNGLE20'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="message-templates">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">📝 Message Templates</h5>
                  <p className="card-text mb-0">Manage WhatsApp Business message templates</p>
                </div>
                <div>
                  <button className="btn btn-primary me-2">+ Create Template</button>
                  <button className="btn btn-outline-secondary">WhatsApp Guidelines</button>
                </div>
              </div>
              <div className="card-body">
                {/* Template Stats */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h4>12</h4>
                        <p className="mb-0">Approved Templates</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-warning text-white">
                      <div className="card-body text-center">
                        <h4>3</h4>
                        <p className="mb-0">Pending Approval</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-danger text-white">
                      <div className="card-body text-center">
                        <h4>1</h4>
                        <p className="mb-0">Rejected</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h4>2.3K</h4>
                        <p className="mb-0">Messages Sent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <input type="text" className="form-control" placeholder="Search templates..." />
                  </div>
                  <div className="col-md-2">
                    <select className="form-select">
                      <option>All Categories</option>
                      <option>Welcome</option>
                      <option>Transactional</option>
                      <option>Promotional</option>
                      <option>Reminder</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select className="form-select">
                      <option>All Status</option>
                      <option>Approved</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select className="form-select">
                      <option>All Languages</option>
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>

                {/* Templates Table */}
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Template Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Language</th>
                        <th>Last Modified</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {templates.map(template => (
                        <tr key={template.id}>
                          <td>
                            <div>
                              <strong>{template.name}</strong>
                              <br />
                              <small className="text-muted">
                                {template.content.substring(0, 60)}...
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{template.category}</span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusColor(template.status)}`}>
                              {template.status}
                            </span>
                          </td>
                          <td>{template.language}</td>
                          <td>{template.lastModified}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">Edit</button>
                              <button className="btn btn-outline-success">Preview</button>
                              <button className="btn btn-outline-info">Duplicate</button>
                              <button className="btn btn-outline-danger">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Template Guidelines */}
                <div className="mt-4">
                  <div className="card border-info">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">📋 WhatsApp Template Guidelines</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Do's:</h6>
                          <ul className="list-unstyled">
                            <li>✅ Use clear, concise language</li>
                            <li>✅ Include your business name</li>
                            <li>✅ Provide value to customers</li>
                            <li>✅ Use variables for personalization</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6>Don'ts:</h6>
                          <ul className="list-unstyled">
                            <li>❌ Use misleading content</li>
                            <li>❌ Include promotional language in transactional templates</li>
                            <li>❌ Use excessive formatting</li>
                            <li>❌ Include external links in media templates</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageTemplates;