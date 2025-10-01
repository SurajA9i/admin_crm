import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Breadcrumb } from 'react-bootstrap';
import { FetchSubscription } from '../../services/EmailSubcriptionApi';
import { formattedDate } from '../../utils/Constant';
import { Link } from 'react-router-dom';

const App = () => {
  // Sample data for the table
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const getData = async () => {
    const res = await FetchSubscription(state);
    setData(res?.data?.data?.result);
    setTotalPages(res?.data?.data?.totalPages, 'pages');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500);

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <div className="container mt-4">
      {/* <Row className="mb-3">
        <Col>
          <Form.Group controlId="entriesPerPage">
            <Form.Label>Show entries</Form.Label>
            <Form.Control
              as="select"
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col className="text-end">
          <InputGroup>
            <FormControl placeholder="Search" value={search} onChange={handleSearch} />
          </InputGroup>
        </Col>
      </Row> */}
      <Breadcrumb>
      <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Email Subscribed</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <h5>Email Subscribed</h5>
        </div>
        <Row className=" mt-3">
          {/* copy this */}
          <Col>
            <Form.Group controlId="limit">
              <Form.Label>Show entries</Form.Label>
              <Form.Control
                as="select"
                value={state.limit}
                onChange={(e) => updateState('limit', Number(e.target.value))}
                style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
              >
                <option value={3}>3</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col className="text-end">
            <InputGroup>
              <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
            </InputGroup>
          </Col>
        </Row>
        <div className="card-body">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>SL</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{(state.page - 1) * state.limit + index + 1}</td>
                  <td>{item.email}</td>
                  <td>{formattedDate(item.createdAt)}</td>
                  {/* <td>
                <Form.Check
                  type="switch"
                  id={`status-switch-${item.id}`}
                  checked={item.status}
                  onChange={() => handleStatusToggle(item.id)}
                />
              </td> */}
                  {/* <td>
                <Button variant="primary" size="sm" className="me-2">
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              Showing {data.length} of {totalPages * state.limit} entries
            </div>
            <Pagination>
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
