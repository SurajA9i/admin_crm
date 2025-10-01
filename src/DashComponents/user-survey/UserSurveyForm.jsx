import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Breadcrumb, InputGroup, FormControl, Form, Pagination } from 'react-bootstrap';
import AddSurveyForm from './modals/AddSurveyForm';
import { FetchSurveyForm, deleteSurveyForm } from '../../../services/UserSurveyApi';
import EditSurveyForm from './modals/EditSurveyForm';
import { deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { Link } from 'react-router-dom';

const UserSurveyManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [ModalId, setModalId] = useState('');
  const [SurveyData, setSurveyData] = useState([]);

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
  //add
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  //edit
  const handleEditOpenModal = () => setEditModal(true);
  const handleEditCloseModal = () => setEditModal(false);

  //delete
  const getUserSurvey = async () => {
    const res = await FetchSurveyForm(state);
    setSurveyData(res?.data?.data?.result, []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleDelete = async (id) => {
    const res = await deleteSurveyForm(id);
    if (res?.status) {
      getUserSurvey(); // Refresh the data
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getUserSurvey();
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
                <h5>User Survey Management</h5>
              </Col>
              <Col className="text-end">
                <Button variant="success" onClick={handleOpenModal}>
                  Add Survey
                </Button>
              </Col>
            </Row>
            <Row className="mt-3">
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
          </div>
          <div className="card-body">
            {/* Table */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Form Name</th>
                  <th>Form Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {SurveyData?.map((survey, index) => (
                  <tr key={index}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>{survey.name}</td>
                    <td>{survey.title}</td>
                    <td>{survey.description}</td>
                    <td>{survey.active === true ? 'Active' : 'InActive'}</td>
                    <td>
                      <Button
                        variant="me-2 btn btn-primary btn-sm"
                        onClick={() => {
                          handleEditOpenModal();
                          setModalId(survey._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={(_id) => deleteConfirmation(() => handleDelete(survey._id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between">
              <div>
                Showing {SurveyData.length} of {totalPages * state.limit} entries
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
      <AddSurveyForm showModal={showModal} handleCloseModal={handleCloseModal} getUserSurvey={getUserSurvey} />
      <EditSurveyForm editModal={editModal} handleEditCloseModal={handleEditCloseModal} getUserSurvey={getUserSurvey} ModalId={ModalId} />
    </>
  );
};

export default UserSurveyManagement;
