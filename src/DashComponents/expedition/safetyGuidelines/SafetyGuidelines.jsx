import React, { useEffect, useState } from 'react';
import { Form as RouterForm, useNavigate } from 'react-router-dom';
import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
import { formattedDate } from '../../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../../toastsAlert/Alert.jsx';
import { getSafetyGuidelines, deleteSafetyGuidelines } from '../../../../services/ExpeditionsApi';
import SkeletonLoader from 'components/Loader/SkeletonLoader';

const SafetyGuidelines = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    category_id: null
  });

  const [safetyData, setSafetyData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSafetyApi = async () => {
    setLoading(true);
    try {
      const response = await getSafetyGuidelines(state);
      if (response?.status) {
        setSafetyData(response?.data?.data?.result);
        setTotalPages(response?.data?.data?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch expeditions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleDelete = async (id) => {
    const res = await deleteSafetyGuidelines(id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      fetchSafetyApi();
    }
  };

  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = { status };
      const res = await updateExpeditions(id, data);
      if (res?.status) {
        showSuccessToast(res?.data?.message || 'Status changed successfully.');
        fetchSafetyApi();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSafetyApi();
    }, 300);
    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Safety Guidelines</h5>
            </Col>
            <Col className="text-end">
              <Button
                className="mb-0"
                variant="success"
                onClick={() => {
                  navigate('/expeditions/safety-guidelines/add-safety');
                }}
              >
                Add Safety Guidelines
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
                  <option value={5}>5</option>
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
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Page Title</th>
                <th>Created At</th>
                <th>Emergency Email</th>
                <th>Emergency Support</th>
                <th>Media Title</th>
                <th>Media Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonLoader rows={5} columns={9} />
              ) : safetyData?.length > 0 ? (
                safetyData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{item.category_name}</td>
                    <td>{item.page_title}</td>
                    <td>{item?.createdAt && formattedDate(item.createdAt)}</td>
                    <td>{item.emergency_email}</td>
                    <td>{item.emergency_support}</td>
                    <td>{item?.media?.title}</td>
                    <td>{item?.media?.type}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/expeditions/safety-guidelines/edit-safety/${item._id}`)}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => deleteConfirmation(() => handleDelete(item._id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">
                    No Record Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              Showing {safetyData?.length} of {totalPages * state.limit} entries
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

export default SafetyGuidelines;
