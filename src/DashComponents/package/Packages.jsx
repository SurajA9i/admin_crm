import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Card, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FetchPackage, deletePackage } from '../../../services/PackageApi';
import { ImgUrl } from '../../../utils/Constant';
import { deleteConfirmation } from '../toastsAlert/Alert.jsx';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';

const Package = () => {
  // Sample data for the table with image URLs
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [totalPages, setTotalPages] = useState(1);

  const getData = async () => {
    const res = await FetchPackage(state);
    setData(res?.data?.data?.result);
    setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleDelete = async (id) => {
    const res = await deletePackage(id);
    try {
      if (res?.status) {
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Dynamic state update function
  const handlePageChange = (currentPage) => {
    setState((prevState) => ({
      ...prevState,
      page: currentPage
    }));
  };

  useEffect(() => {
    getData();
  }, [state.page]);
  return (
    <div className="container mt-4">
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#">Package  </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Package</Breadcrumb.Item>
      </Breadcrumb> */}

      <div className="card">
        <div className="card-header">
          {/* Header and Button */}
          <Row className="mb-0 align-items-center">
            <Col>
            {/* renamed from Packages to Junglore Expeditions */}
              <h5>Junglore Expeditions</h5> 
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                onClick={() => {
                  navigate('/add-package');
                }}
              >
                Add Package
              </Button>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          {/* <Row className="mb-3">
            <Card.Header>
              <span className="text-muted"></span>
            </Card.Header>
            <Col>
              <Form.Group controlId="entriesPerPage">
                <Form.Label>Show entries</Form.Label>
                <Form.Control
                  as="select"
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
                <FormControl placeholder="Search" value={search} onChange={handleSearch} />
              </InputGroup>
            </Col>
          </Row> */}
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Heading</th>
                <th>Title</th>
                <th>Image</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Region</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => (
                <tr key={item.id}>
                  {/* <td>{index + 1}</td> */}
                  <td>{(state.page - 1) * state.limit + index + 1}</td>

                  <td>{item.heading}</td>
                  <td>{item.title}</td>
                  <td className="img_sizes">
                    {/* Displaying the image */}
                    <img src={`${ImgUrl}${item?.image}`} alt={item.name} width={50} height={50} />
                  </td>

                  <td>
                    {' '}
                    <TruncatedText text={item.description && StripTag(item.description)} />{' '}
                  </td>
                  <td>{item.duration}</td>
                  <td>{item.region || 'Not Set'}</td>
                  <td>
                    {item.currency === 'INR' && '₹'} {item.currency === 'USD' && '$'} {item.price}
                  </td>

                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        navigate(`/edit-Package/${item._id}`);
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
            <div>{/* Showing {displayedData.length} of {filteredData.length} entries */}</div>
            <Pagination>
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item key={page + 1} active={page + 1 === state.page} onClick={() => handlePageChange(page + 1)}>
                  {page + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Package;