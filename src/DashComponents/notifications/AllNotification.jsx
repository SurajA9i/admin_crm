import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Breadcrumb, ButtonGroup } from 'react-bootstrap';
import { FetchNotfi, deleteNotfi } from '../../../services/NotificationApi';
import { formattedDate } from '../../../utils/Constant';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import TruncatedText from 'common/TruncatedText';

const AllNotification = () => {
  // Sample data for the table
  const Navigate = useNavigate();
  const [data, setData] = useState([]);

  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const getData = async () => {
    const res = await FetchNotfi();
    console.log(res);
    setData(res?.data?.data?.result);
  };

  const handleDelete = async (id) => {
    const res = await deleteNotfi(id);
    if (res?.status) {
      getData();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtered and paginated data
  const filteredData =
    data?.length > 0 &&
    data.filter(
      (item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.slug.toLowerCase().includes(search.toLowerCase())
    );
  const totalPages = filteredData && Math.ceil(filteredData.length / entriesPerPage);
  const displayedData = filteredData && filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mt-4">
      {/* <Row className="mb-3">
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
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Notifications</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Notifications</h5>
            </Col>
            <Col className="text-end">
              <Button variant="success" onClick={() => Navigate('/create-notifications')}>
                Add Notification
              </Button>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Message</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedData?.length > 0 &&
                displayedData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      {' '}
                      <TruncatedText text={item.message} />
                    </td>
                    <td> {formattedDate(item.createdAt)}</td>
                    {/* <td>
                    <Form.Check
                      type="switch"
                      id={`status-switch-${item.id}`}
                      checked={item.status}
                      onChange={() => handleStatusToggle(item.id)}
                    />
                  </td> */}
                    <td>
                      {/* <Button variant="primary" size="sm" className="me-2">
                      Edit
                    </Button> */}
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
              Showing {displayedData.length} of {filteredData.length} entries
            </div>
            <Pagination>
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
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

export default AllNotification;
