import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FetchBlogs, deleteBlog, UpdateBlog } from '../../../services/BlogPost.jsx';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const App = () => {
  const Navigate = useNavigate();

  //copy this
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    category_id: null
  });

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1); //copy this

  // copy this
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const allBlogs = async () => {
    try {
      const res = await FetchBlogs(state);
      setData(res?.data?.data?.result || []); // Update data with the fetched results
      setTotalPages(res?.data?.data?.totalPages || 1); // Update total pages
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // copy this
  useEffect(() => {
    const timer = setTimeout(() => {
      allBlogs();
    }, 500);

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit, state.category_id]);

  // Function to handle blog deletion
  const handleDelete = async (id) => {
    const res = await deleteBlog(id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      allBlogs(); // Refresh the data
    }
  };

  // Function to toggle the status
  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        status: status
      };
      const res = await UpdateBlog(id, data);
      if (res?.status) {
        showSuccessToast(res?.data?.message || 'Status changed Successfully.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5> Blogs</h5>
            </Col>
            <Col className="text-end">
              <Button
                className="mb-0"
                variant="success"
                onClick={() => {
                  Navigate('/addBlog');
                }}
              >
                Add Blog
              </Button>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <Row className="mb-3">
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
                  <tr key={item._id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{item.title}</td>
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
                      <Button variant="primary" size="sm" className="me-2" onClick={() => Navigate(`/edit-blog/${item._id}`)}>
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
