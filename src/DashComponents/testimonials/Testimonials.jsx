import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FetchTestimonial, deleteTestimonial, UpdateTestimonialStatus } from '../../../services/TestiminialsApi';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import TruncatedText from 'common/TruncatedText';

const Testimonials = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
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
    const res = await FetchTestimonial(state);
    setData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        status: status
      };
      showSuccessToast('Status Changed');
      const res = await UpdateTestimonialStatus(id, data);
      if (res?.status) {
        showSuccessToast('Status Changed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteTestimonial(id);
      if (res?.status) {
        getData();
      }
    } catch {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500);

    return () => clearTimeout(timer);
  }, [state.page, state.limit, state.search]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="d-flex card-header align-items-center justify-content-between">
          <h5>Testimonials</h5>
          <Col className="text-end">
            <Button variant="success" onClick={() => navigate('/add-testimonials')}>
              Add Testimonial
            </Button>
          </Col>
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
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>SL</th>
                <th>Name</th>
                <th>Image</th>
                <th>Position</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data?.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.type == 'image' ? (
                        <img src={`${ImgUrl}${item.media}`} alt={item.name} width={80} height={55} />
                      ) : (
                        <video className="mt-3" src={`${ImgUrl}${item.media}`} alt={item.name} controls height={55} width={80} />
                      )}
                    </td>
                    <td>{item.position}</td>
                    <td> <TruncatedText text={item.description} /></td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`status-switch-${item._id}`}
                        defaultChecked={item.status}
                        onChange={(e) => handleStatusToggle(item._id, e)}
                      />
                    </td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/edit-testimonials/${item._id}`)}>
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
                  <td colSpan={7} className="text-center mt-3 mb-3">
                    No Record Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>Showing {data?.length} entries</div>
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

export default Testimonials;
