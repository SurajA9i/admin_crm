import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination } from 'react-bootstrap';
import { FetchDestination, deleteDestination } from '../../../services/DestinationApi';
import AddDestination from './AddDestination';
import EditDestination from './EditDestination';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const Destination = () => {
  // Sample data for the table with image URLs
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [Editmodal, setEditModal] = useState(false);
  const [modalID, setModalID] = useState(false);
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

  const handleShow = () => setModalShow(true);
  const handleClose = () => setModalShow(false);
  //edit
  const handleEditShow = () => setEditModal(true);
  const handleEditClose = () => setEditModal(false);

  const getData = async () => {
    const res = await FetchDestination(state);
    setData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit, state.category_id]);

  // const handleStatusToggle = (id) => {
  //   setData((prevData) => prevData.map((item) => (item.id === id ? { ...item, status: !item.status } : item)));
  // };

  const handleDelete = async (id) => {
    try {
      const res = await deleteDestination(id);
      if (res?.status) {
        await getData();
        showSuccessToast('Successfully Deleted');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5> Destinations</h5>
              </Col>
              <Col className="text-end">
                <Button variant="success" onClick={handleShow}>
                  Add Destination
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
                    <option value={3}>3</option>
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
                  <th>Image</th> {/* New Image Column */}
                  <th>Title</th>
                  <th>Description</th>
                  <th>price</th>
                  {/* <th>Status</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>
                      {/* Displaying the image */}
                      <img src={`${ImgUrl}${item.image}`} alt={item.name} width={50} height={50} />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    {/* <td>
                <Form.Check
                  type="switch"
                  id={`status-switch-${item.id}`}
                  checked={item.status}
                  onChange={() => handleStatusToggle(item.id)}
                />
              </td> */}
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          handleEditShow();
                          setModalID(item._id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={(_id) => deleteConfirmation(() => handleDelete(item._id))}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
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
      <AddDestination show={modalShow} handleClose={handleClose} getData={getData} />
      <EditDestination show={Editmodal} handleClose={handleEditClose} getData={getData} modalID={modalID} />
    </>
  );
};

export default Destination;
