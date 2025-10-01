import React, { useEffect, useState } from 'react';
import { Breadcrumb, Table, Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FetchSocialLinks } from '../../../services/SocialLinksApi';

const SocialLinksTable = () => {
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState([]);

  const linkData = async () => {
    const res = await FetchSocialLinks();
    setSocialLinks(res?.data?.data);
  };

  useEffect(() => {
    linkData();
  }, []);

  return (
    <div className="container mt-4">
      {/* <div className="d-flex justify-content-between ">
        <h4>Social Links</h4>
        <Button variant="primary" size="sm" className=" px-5" onClick={() => navigate(`/edit-social-links`)}>
          Edit
        </Button>
      </div> */}

      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Social Links</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        {/* Page Heading */}
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Social Links</h5>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => navigate(`/edit-social-links`)}>
                Edit
              </Button>
            </Col>
          </Row>
        </div>
        {/* Breadcrumbs */}

        <div className="card-body">
          {/* Table */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Platform</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(socialLinks)
                .filter(([key]) => key !== '_id' && key !== 'updatedAt')
                .map(([key, value], index) => (
                  <tr key={key}>
                    <td>{index + 1}</td>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksTable;
