import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, InputGroup, FormControl, Pagination, Container } from 'react-bootstrap';
import { getCoupon, updateCouponStatus, deleteCoupon } from '../../../services/CouponApi';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { formattedDate, ImgUrl } from '../../../utils/Constant';

const CouponList = () => {
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
  const fetchCoupons = async () => {
    try {
      const res = await getCoupon(state);
      if (res?.status) {
        setMedia(res?.data?.data?.result || []);
        setTotalPages(res?.data?.data?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleToggleStatus = async (id, e) => {
    try {
      const checked = e.target.checked;
      const status = checked ? true : false;
      const data = {
        publish: status
      };
      const res = await updateCouponStatus(id, data);
      if (res?.status) {
        showSuccessToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCoupon(id);
    if (res?.status) {
      await fetchCoupons();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 500);
    return () => clearTimeout(timer); // Cleanup previous timer
  }, [state.search, state.page, state.limit]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5> All Coupons </h5>
            </Col>
            <Col className="text-end">
              <Button
                variant="success"
                className="mb-0"
                onClick={() => {
                  Navigate('/user-coupons/add-coupon');
                }}
              >
                Add Coupon
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col className="text-end">
              <InputGroup>
                <FormControl
                  placeholder="Search coupon code"
                  value={state.search}
                  onChange={(e) => updateState('search', e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S. No</th>
              <th>Coupon Code</th>
              <th>Percentage Off</th>
              <th>Coupon For</th>
              <th>Valid From</th>
              <th>Valid Upto</th>
              <th>Publish</th>
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
            ) : (
              media?.map((item, index) => (
                <tr key={item._id}>
                  <td>{(state.page - 1) * state.limit + index + 1}</td>
                  <td>{item.code}</td>
                  <td> {item.percentage_off ? `${item.percentage_off} %` : 0} </td>
                  <td>{item.for === 'package' ? 'Expeditions' : 'Resort'} </td>
                  <td>{item?.valid_from && formattedDate(item.valid_from)}</td>
                  <td>{item?.valid_upto && formattedDate(item.valid_upto)}</td>
                  {/* <td>
                    {item?.banner ? (
                      <img src={`${ImgUrl}${item.banner}`} alt="Media" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    ) : (
                      'No Banner Available.'
                    )}
                  </td> */}
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
                    <Button style={{ background: '#1e2d27' }} onClick={() => Navigate(`/user-coupons/edit-coupon/${item._id}`)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={(_id) => deleteConfirmation(() => handleDelete(item._id))} className="ms-2">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {media?.length > 0 && (
          <div className="d-flex justify-content-between">
            <div>
              {/* Showing {media?.length} of {totalPages * state?.limit} entries */}
              Showing {media?.length} of {(state?.page - 1) * state?.limit + media?.length} entries
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

export default CouponList;
