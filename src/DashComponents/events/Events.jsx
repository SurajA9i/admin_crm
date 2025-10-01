import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Breadcrumb, Form, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import EventFormModal from './AddForm';
import { FetchEvent, deleteEvent } from '../../../services/EventApi';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import TruncatedText from 'common/TruncatedText';
import StripTag from 'config/StripTag';
import { formattedDate } from '../../../utils/Constant';

const UserSurveyManagement = () => {
  const navigate = useNavigate();
  const [surveyData, setSurveyData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
    // category_id: null
  });
  const [totalPages, setTotalPages] = useState(1);
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleShow = () => setModalShow(true);
  const handleClose = () => setModalShow(false);
  const handleDelete = async (id) => {
    try {
      const res = await deleteEvent(id);
      if (res?.status) {
        Events();
        showSuccessToast('Item deleted successfully!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Events = async () => {
    const res = await FetchEvent(state);
    setSurveyData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      Events();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  return (
    <>
      <Container className="mt-4">
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Events</Breadcrumb.Item>
        </Breadcrumb>

        <div className="card">
          <div className="card-header">
            {/* Header and Button */}
            <Row className="align-items-center">
              <Col>
                <h5>Events</h5>
              </Col>
              <Col className="text-end m-0">
                <Button onClick={handleShow} variant="success">
                  Add Event
                </Button>
              </Col>
            </Row>
          </div>

          <div className="card-body">
            <Row className="align-items-center mb-3">
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
            {/* Table */}
            <Table striped bordered hover responsive className=" mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Event Date</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveyData?.map((survey, index) => (
                  <tr key={survey._id}>
                    <td>
                      <td>{(state.page - 1) * state.limit + index + 1}</td>
                    </td>
                    <td>{survey.title}</td>
                    <td>{survey.type}</td>
                    <td>{survey.location}</td>
                    <td>{survey.date && formattedDate(survey.date)}</td>
                    <td>
                      <TruncatedText text={survey.description && StripTag(survey.description)} />
                    </td>
                    <td>
                      <Button variant="btn btn-primary btn-sm" size="sm" onClick={(_id) => navigate(`/edit-events/${survey._id}`)}>
                        Edit
                      </Button>
                      <Button
                        variant="me-2 btn btn-danger btn-sm"
                        size="sm"
                        onClick={(_id) => {
                          deleteConfirmation(() => handleDelete(survey._id));
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
      <div className="d-flex justify-content-between">
        <div>
          Showing {surveyData.length} of {totalPages * state.limit} entries
        </div>
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
      <EventFormModal show={modalShow} handleClose={handleClose} Events={Events} />
    </>
  );
};

export default UserSurveyManagement;
