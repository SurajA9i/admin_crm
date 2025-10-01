import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { FetchUsers, deleteUser, UpdateUser } from '../../../services/UserApi';
import { useNavigate } from 'react-router-dom';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const UserManagement = () => {
  const navigate = useNavigate();
  const [List, setList] = useState([]);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    category_id: null
  });

  const [totalPages, setTotalPages] = useState(1);
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const userList = async () => {
    const res = await FetchUsers(state);
    setList(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleDelete = async (id) => {
    const res = await deleteUser(id);
    if (res?.status) {
      showSuccessToast('Item deleted successfully!');
      userList(); // Refresh the data
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      userList();
    }, 500);

    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  const handleStatusToggle = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        isActive: status
      };
      const res = await UpdateUser(id, data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Users</Card.Title>
              <span className="text-muted">User Management - Users</span>
            </Card.Header>
            <Card.Body>
              <Table responsive bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {List?.map((user, index) => (
                    <tr key={user._id}>
                      <td>{(state.page - 1) * state.limit + index + 1}</td>
                      <td>
                        <img
                          src={`${ImgUrl}${user.image}`}
                          alt={user.name}
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Form>
                          <Form.Check
                            type="switch"
                            id={`status-switch-${user._id}`}
                            defaultChecked={user.isActive}
                            onChange={(e) => handleStatusToggle(user._id, e)}
                            // className="custom-switch"
                          />
                        </Form>
                      </td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={(_id) => deleteConfirmation(() => handleDelete(user._id))}
                        >
                          Delete
                        </Button>
                        <Button variant="primary" size="sm" onClick={(_id) => navigate(`/user-management/edit-create-users/${user._id}`)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between">
                <div>
                  Showing {List.length} of {totalPages * state.limit} entries
                </div>
                <Pagination>
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
                      {index + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserManagement;
