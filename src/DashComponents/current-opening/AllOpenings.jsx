import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Pagination, Row, Col, FormControl, Container } from 'react-bootstrap';
import { FetchOpening, deleteOpening } from '../../../services/OpeningApi';
import { useNavigate } from 'react-router-dom';
import { formattedDate } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const CurrentOpenings = () => {
  const Navigate = useNavigate();
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
  const responseData = async () => {
    const res = await FetchOpening(state);
    console.log(res);
    setData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleDelete = async (id) => {
    const res = await deleteOpening(id);
    if (res?.status) {
      await responseData();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      responseData();
    }, 500);

    return () => clearTimeout(timer);
  }, [state.page, state.limit, state.search]);

  return (
    <Container className="mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Current Job Openings</h5>
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                onClick={() => {
                  Navigate('/add-current-openings');
                }}
              >
                Add Job
              </Button>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Row className="mb-3">
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
            <Col md={6}>
              <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
            </Col>
          </Row>
          <Table striped bordered hover responsive className="table-responsive-custom">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Perk</th>
                <th>Publish</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.perks && item.perks.length > 0 ? (
                        item.perks.map((perk, index) => <div key={index}>{perk}</div>)
                      ) : (
                        <span>No perks available</span>
                      )}
                    </td>

                    <td>{formattedDate(item.createdAt)}</td>
                    <td>{formattedDate(item.expiry)}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          Navigate(`/edit-current-openings/${item._id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={(_id) => deleteConfirmation(() => handleDelete(item._id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No data available in table
                  </td>
                </tr>
              )}
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
    </Container>
  );
};

export default CurrentOpenings;
