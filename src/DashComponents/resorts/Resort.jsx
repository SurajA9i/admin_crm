import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FetchResort, deleteResort } from '../../../services/ResortApi';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { update } from 'immutable';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';

const Resorts = () => {
  const Navigate = useNavigate();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const updateState = (key, value) => {
    setState((prevstate) => ({
      ...prevstate,
      [key]: value
    }));
  };

  const getData = async () => {
    const res = await FetchResort(state);
    setData(res?.data?.data?.result || []);
    setTotalPages(res?.data?.data?.totalPages || 1);
    console.log(res);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500);
    return () => clearTimeout(timer);
  }, [state.page, state.limit, state.search]);

  // const handleStatusToggle = (id) => {
  //   setData((prevData) => prevData.map((item) => (item.id === id ? { ...item, status: !item.status } : item)));
  // };

  const handleDelete = async (id) => {
    try {
      const res = await deleteResort(id);
      if (res?.status) {
        await getData();
        showSuccessToast('Item Deleted Successfully');
      }
      getData();
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
              <h5> Resorts</h5>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => Navigate('/add-resorts')}>
                Add Resort
              </Button>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="entriesPerPage">
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
                <th>S.No</th>
                <th>Heading</th>
                <th>Resort Name</th>
                <th>Image</th> {/* New Image Column */}
                <th>Description</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id}>
                  <td>{(state.page - 1) * state.limit + index + 1}</td>
                  <td>{item.heading}</td>
                  <td>{item.title}</td>
                  <td>
                    {/* Displaying the image */}
                    <img src={`${ImgUrl}${item.image}`} alt={item.name} width={50} height={50} />
                  </td>

                  <td>
                    <TruncatedText text={item.description && StripTag(item.description)} />

                    {/* {item.description &&StripTag(item.description)} */}
                  </td>
                  <td>
                     {item.currency === 'INR' && '₹'} {item.currency === 'USD' && '$'} {item.price}
                  </td>
                  <td>
                    <Button variant="primary" size="sm" className="me-2" onClick={() => Navigate(`/edit-resorts/${item._id}`)}>
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
              {[...Array(totalPages).keys()].map((_, index) => (
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

export default Resorts;
