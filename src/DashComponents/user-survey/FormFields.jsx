import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Breadcrumb, Pagination, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FetchFormField, deleteFormField } from '../../../services/UserSurveyApi';
import AddFieldForm from './modals/AddFieldForm';
import EditFieldForm from './modals/EditFieldForm';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { Link } from 'react-router-dom';

const UserSurveyManagement = () => {
  const [Field, setField] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalID, setModalId] = useState('');

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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);

  const fetchFields = async () => {
    const res = await FetchFormField(state);
    setField(res?.data?.data?.result, []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };
  const handleDelete = async (id) => {
    const res = await deleteFormField(id);
    try {
      if (res?.status) {
        fetchFields();
        showSuccessToast('Item Deleted');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFields();
    }, 500);

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <>
      <Container className="mt-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>User Surveys</Breadcrumb.Item>
        </Breadcrumb>

        {/* Header and Button */}
        <div className="card">
          <div className="card-header">
            <Row className="align-items-center">
              <Col>
                <h5>Form Fields</h5>
              </Col>
              <Col className="text-end">
                <Button variant="success" onClick={handleOpenModal}>
                  Add New Form Fields
                </Button>
              </Col>
            </Row>
          </div>

          <div className="card-body">
            {/* Table */}
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
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Field Name</th>
                  <th>Field Title</th>
                  <th>Firld Type</th>
                  <th>Is Required</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Field.map((firld, index) => (
                  <tr key={index}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{firld.name}</td>
                    <td>{firld.title}</td>
                    <td>{firld.field_type}</td>
                    <td>{firld.isRequired === true ? 'yes' : 'false'}</td>
                    <td>
                      <Button
                        variant="me-2 btn btn-primary btn-sm"
                        onClick={() => {
                          handleOpenEditModal(), setModalId(firld._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="btn btn-danger btn-sm" onClick={(_id) => deleteConfirmation(() => handleDelete(firld._id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between">
              <div>
                Showing {Field.length} of {totalPages * state.limit} entries
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
      <AddFieldForm showModal={showModal} handleCloseModal={handleCloseModal} fetchFields={fetchFields} fields={Field} />
      <EditFieldForm
        editModal={editModal}
        handleCloseEditModal={handleCloseEditModal}
        fetchFields={fetchFields}
        fields={Field}
        modalID={modalID}
      />
    </>
  );
};

export default UserSurveyManagement;
