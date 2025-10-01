import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Breadcrumb } from 'react-bootstrap';
import { deleteBlogCategory, UpdateCategory, getAllCategory } from '../../../services/BlogPost.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const App = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
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
  const [totalPages, setTotalPages] = useState(1);

  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        status: status
      };
      const res = await UpdateCategory(id, data);
      if (res?.status) {
        showSuccessToast(res?.data?.message || 'status changed Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteBlogCategory(id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      categoryData(); // Refresh the data
    }
  };

  const categoryData = async () => {
    const res = await getAllCategory(state);
    setData(res?.data?.data?.result);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      categoryData();
    }, 500);

    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">Blog Category</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5> Blog Category </h5>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => navigate('/blogs/blog-catagory')}>
                Add Blog Category
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
                  <option value={1}>1</option>
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
                <th>S.No</th>
                <th>Name</th>
                {/* <th>Slug</th> */}
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data?.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{item.name}</td>
                    {/* <td>{item.slug}</td> */}
                    <td>
                      <Form.Check
                        type="switch"
                        id={`status-switch-${item._id}`}
                        defaultChecked={item.status}
                        onChange={(e) => handleStatusToggle(item._id, e)}
                      />
                    </td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2" onClick={(_id) => navigate(`/edit-blog-category/${item._id}`)}>
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
          {data?.length > 0 && (
            <div className="d-flex justify-content-between">
              <div>
                Showing {data?.length} of {(state?.page - 1) * state?.limit + data?.length} entries
              </div>
              <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
