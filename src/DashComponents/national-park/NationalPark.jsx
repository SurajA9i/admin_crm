import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Breadcrumb, Form, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { formattedDate } from '../../../utils/Constant';
import { FetchNationalPark, deleteNationalPark } from '../../../services/NationalParkApi';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';

const NationalPark = () => {
  const [surveyData, setSurveyData] = useState([]);
  const navigate = useNavigate();
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const getData = async () => {
    const res = await FetchNationalPark(state);
    setSurveyData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const deleteData = async (id) => {
    const res = await deleteNationalPark(id);
    try {
      if (res?.status) {
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500);

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit]);

  return (
    <Container className="mt-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>

        <Breadcrumb.Item active>National Parks</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          {/* Header and Button */}
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>National Park</h5>
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                onClick={() => {
                  navigate('/add-national-parks');
                }}
              >
                Add National Park
              </Button>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          {/* Search and Rows Per Page */}
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

          {/* Table */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SL</th>
                <th>Name</th>
                <th>Location</th>
                <th>Region</th>
                <th>Category</th>
                <th>Created At</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveyData?.map((survey, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>{survey?.name || '-'}</td>
                  <td>{survey?.location || '-'}</td>
                  <td>{survey?.region || '-'}</td>
                  <td>{survey?.category || '-'}</td>
                  <td>{survey?.createdAt && formattedDate(survey?.createdAt)}</td>
                  <td>
                    <TruncatedText text={survey?.description && StripTag(survey?.description)} />
                  </td>
                  <td>
                    <Button variant="btn btn-primary btn-sm" size="sm" onClick={(_id) => navigate(`/edit-national-parks/${survey?._id}`)}>
                      Edit
                    </Button>
                    <Button
                      variant="me-2 btn btn-danger btn-sm"
                      size="sm"
                      onClick={(_id) => {
                        deleteConfirmation(() => deleteData(survey?._id));
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between">
            <div>
              Showing {surveyData.length} of {totalPages * state.limit} entries
            </div>
            <Pagination>
              {[...Array(totalPages)]?.map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NationalPark;
