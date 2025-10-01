import React, { useEffect, useState } from 'react';
import { Form as RouterForm, useNavigate } from 'react-router-dom';
import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
import { formattedDate } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { fetchExpeditions, updateExpeditions, deleteExpeditions } from '../../../services/ExpeditionsApi';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';

const Expeditions = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    category_id: null
  });

  const [expeditionData, setExpeditionData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const getExpeditions = async () => {
    try {
      const response = await fetchExpeditions(state);
      if (response?.status) {
        setExpeditionData(response?.data?.data?.result);
        setTotalPages(response?.data?.data?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch expeditions:', error);
    }
  };

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleDelete = async (id) => {
    const res = await deleteExpeditions(id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      getExpeditions();
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
        getExpeditions();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getExpeditions();
    }, 300);
    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Expeditions</h5>
            </Col>
            <Col className="text-end">
              <Button
                className="mb-0"
                variant="success"
                onClick={() => {
                  navigate('/jungle-expeditions/add-expeditions');
                }}
              >
                Add Expeditions
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
                <th>Type</th>
                <th>Date</th>
                <th>Description</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expeditionData?.map((item, index) => (
                <tr key={item._id}>
                  <td>{(state.page - 1) * state.limit + index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item?.date && formattedDate(item.date)}</td>
                  <td>  <TruncatedText text={item.description && StripTag(item.description)} /></td>
                  <td>{item.location}</td>
                  <td>{item.price}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={`status-switch-${item._id}`}
                      defaultChecked={item.status}
                      onChange={(e) => handleStatusToggle(item._id, e)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/jungle-expeditions/edit-expeditions/${item._id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteConfirmation(() => handleDelete(item._id))}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>
              Showing {expeditionData?.length} of {totalPages * state.limit} entries
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

export default Expeditions;
