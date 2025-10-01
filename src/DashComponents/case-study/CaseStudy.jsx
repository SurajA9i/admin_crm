import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination } from 'react-bootstrap';
import { FetchCaseStudy, deleteCaseStudy, UpdateCaseStudy } from '../../../services/CaseStudtApi';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const App = () => {
  // Sample data for the table
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    category_id: null
  });
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const navigate = useNavigate();

  const getCaseStudies = async () => {
    const res = await FetchCaseStudy(state);
    setData(res?.data?.data?.result);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      getCaseStudies();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.value;
      const status = checked ? true : false;
      const data = {
        status: status
      };
      const res = await UpdateCaseStudy(id, data);
      if (res?.status) {
        showSuccessToast('Status Updated');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (_id) => {
    const res = await deleteCaseStudy(_id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      getCaseStudies();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        {/* <div className="card-header">
          <h5 className="card-title">Case Study</h5>
        </div> */}

        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5 className="card-title">Case Study</h5>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => navigate('/create-case-study')}>
                Add Case Study
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
                <th>SL</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{item.title}</td>
                    <td>{item.slug}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`status-switch-${item._id}`}
                        defaultChecked={item.status}
                        onChange={(e) => handleStatusToggle(item._id, e)}
                      />
                    </td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={(_id) => navigate(`/edit-case-study/${item._id}`)}>
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
                  <td colSpan={7} className="text-center">
                    No Record Found
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
    </div>
  );
};

export default App;
