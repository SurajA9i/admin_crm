import React, { useState } from 'react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const [analyticsData] = useState({
    overview: {
      totalMessages: 12456,
      deliveryRate: 94.2,
      openRate: 68.5,
      clickRate: 23.1,
      responseRate: 15.7
    },
    campaigns: [
      { name: 'Summer Promotion', sent: 3200, delivered: 3015, opened: 2187, clicked: 456, revenue: '$12,340' },
      { name: 'Welcome Series', sent: 1800, delivered: 1752, opened: 1234, clicked: 287, revenue: '$5,670' },
      { name: 'Booking Reminders', sent: 4500, delivered: 4328, opened: 2876, clicked: 892, revenue: '$8,920' }
    ],
    timeData: [
      { period: 'Week 1', messages: 2800, opens: 1904, clicks: 532 },
      { period: 'Week 2', messages: 3200, opens: 2176, clicks: 608 },
      { period: 'Week 3', messages: 2900, opens: 1972, clicks: 551 },
      { period: 'Week 4', messages: 3556, opens: 2427, clicks: 689 }
    ]
  });

  return (
    <div className="analytics">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">📊 CRM Analytics</h5>
                  <p className="card-text mb-0">Comprehensive CRM analytics and reporting</p>
                </div>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                  </select>
                  <button className="btn btn-outline-primary">Export Report</button>
                </div>
              </div>
              <div className="card-body">
                {/* Key Metrics */}
                <div className="row mb-4">
                  <div className="col-md-2">
                    <div className="card bg-primary text-white">
                      <div className="card-body text-center">
                        <h4>{analyticsData.overview.totalMessages.toLocaleString()}</h4>
                        <p className="mb-0">Total Messages</p>
                        <small>+12% vs last period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-success text-white">
                      <div className="card-body text-center">
                        <h4>{analyticsData.overview.deliveryRate}%</h4>
                        <p className="mb-0">Delivery Rate</p>
                        <small>+2.3% vs last period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-info text-white">
                      <div className="card-body text-center">
                        <h4>{analyticsData.overview.openRate}%</h4>
                        <p className="mb-0">Open Rate</p>
                        <small>+5.1% vs last period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-warning text-white">
                      <div className="card-body text-center">
                        <h4>{analyticsData.overview.clickRate}%</h4>
                        <p className="mb-0">Click Rate</p>
                        <small>+1.8% vs last period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-secondary text-white">
                      <div className="card-body text-center">
                        <h4>{analyticsData.overview.responseRate}%</h4>
                        <p className="mb-0">Response Rate</p>
                        <small>+3.2% vs last period</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="card bg-dark text-white">
                      <div className="card-body text-center">
                        <h4>$26.9K</h4>
                        <p className="mb-0">Revenue</p>
                        <small>+18.5% vs last period</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <div className="card">
                      <div className="card-header">
                        <h6>Message Performance Over Time</h6>
                      </div>
                      <div className="card-body">
                        <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div className="text-center">
                            <h5>📈 Interactive Chart</h5>
                            <p>Message performance trends would be displayed here</p>
                            <small className="text-muted">Integration with Chart.js or similar library needed</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header">
                        <h6>Top Performing Campaigns</h6>
                      </div>
                      <div className="card-body">
                        {analyticsData.campaigns.slice(0, 3).map((campaign, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                              <strong>{campaign.name}</strong>
                              <br />
                              <small className="text-muted">{campaign.sent.toLocaleString()} sent</small>
                            </div>
                            <div className="text-end">
                              <div className="text-success fw-bold">{campaign.revenue}</div>
                              <small>{Math.round((campaign.opened/campaign.sent)*100)}% open rate</small>
                            </div>
                          </div>
                        ))}\n                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Performance Table */}
                <div className="card">
                  <div className="card-header">
                    <h6>Campaign Performance Details</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Campaign Name</th>
                            <th>Messages Sent</th>
                            <th>Delivered</th>
                            <th>Opened</th>
                            <th>Clicked</th>
                            <th>Open Rate</th>
                            <th>Click Rate</th>
                            <th>Revenue</th>
                            <th>ROI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.campaigns.map((campaign, index) => (
                            <tr key={index}>
                              <td><strong>{campaign.name}</strong></td>
                              <td>{campaign.sent.toLocaleString()}</td>
                              <td>{campaign.delivered.toLocaleString()}</td>
                              <td>{campaign.opened.toLocaleString()}</td>
                              <td>{campaign.clicked.toLocaleString()}</td>
                              <td>
                                <span className="badge bg-info">
                                  {Math.round((campaign.opened/campaign.sent)*100)}%
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success">
                                  {Math.round((campaign.clicked/campaign.opened)*100)}%
                                </span>
                              </td>
                              <td className="text-success fw-bold">{campaign.revenue}</td>
                              <td>
                                <span className="badge bg-primary">
                                  {(Math.random() * 5 + 2).toFixed(1)}x
                                </span>
                              </td>
                            </tr>
                          ))}\n                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Weekly Performance */}
                <div className="card mt-4">
                  <div className="card-header">
                    <h6>Weekly Performance Breakdown</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {analyticsData.timeData.map((week, index) => (
                        <div key={index} className="col-md-3 mb-3">
                          <div className="card border-primary">
                            <div className="card-body text-center">
                              <h6 className="text-primary">{week.period}</h6>
                              <div className="row">
                                <div className="col-12">
                                  <strong>{week.messages.toLocaleString()}</strong>
                                  <br />
                                  <small>Messages Sent</small>
                                </div>
                              </div>
                              <hr />
                              <div className="row">
                                <div className="col-6">
                                  <strong>{week.opens.toLocaleString()}</strong>
                                  <br />
                                  <small>Opens</small>
                                </div>
                                <div className="col-6">
                                  <strong>{week.clicks.toLocaleString()}</strong>
                                  <br />
                                  <small>Clicks</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default Analytics;