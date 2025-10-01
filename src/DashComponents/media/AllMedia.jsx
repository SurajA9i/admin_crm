import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, InputGroup, FormControl, Pagination, Container } from 'react-bootstrap';
import { FetchMedia, deleteMedia, UpdateMedia } from '../../../services/MediaApi';
import { ImgUrl } from '../../../utils/Constant';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const AllMedia = () => {
  const Navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const allMedia = async () => {
    try {
      const res = await FetchMedia(state);
      setMedia(res?.data?.data?.result || []); // Update data with the fetched results
      setTotalPages(res?.data?.data?.totalPages || 1); // Update total pages
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // copy this
  useEffect(() => {
    const timer = setTimeout(() => {
      allMedia();
    }, 500);

    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit]);

  const handleToggleStatus = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        publish: status
      };
      const res = await UpdateMedia(id, data);
      if (res?.status) {
        showSuccessToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteMedia(id);
    if (res?.status) {
      await allMedia();
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5> All Media</h5>
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                className="mb-0"
                onClick={() => {
                  Navigate('/add-media');
                }}
              >
                Add Media
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
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Title</th>
              <th>Media Type</th>
              <th>Media Preview</th>
              <th>Photographer's Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : media?.length > 0 ? (
              media?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>{item.media_type}</td>
                  {item.image ? (
                    <>
                      <td>
                        {item.image ? (
                          <img src={`${ImgUrl}${item.image}`} alt="Media" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        ) : (
                          'No Media'
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {item.video ? (
                          <>
                            <video width="100" height="100">
                              <source src={`${ImgUrl}${item.video}`} className="media-preview" type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </>
                        ) : (
                          'No Media'
                        )}
                      </td>
                    </>
                  )}
                  <td> {item?.photographer || 'N/A'}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      style={{ cursor: 'pointer' }}
                      id={`status-switch-${item._id}`}
                      defaultChecked={item.publish}
                      onChange={(e) => handleToggleStatus(item._id, e)}
                    />
                  </td>
                  <td>
                    <Button style={{ background: '#1e2d27' }} onClick={() => Navigate(`/edit-media/${item._id}`)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={(_id) => deleteConfirmation(() => handleDelete(item._id))} className="ms-2">
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

        {media?.length > 0 && (
          <div className="d-flex justify-content-between">
            <div>
              Showing {media?.length} of {totalPages * state?.limit} entries
            </div>
            <Pagination>
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === state?.page} onClick={() => updateState('page', index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMedia;
