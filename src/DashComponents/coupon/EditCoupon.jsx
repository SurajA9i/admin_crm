import React, { useEffect, useState } from 'react';
import { Form, Button, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCouponById, editCoupon } from '../../../services/CouponApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import Select from 'react-select';
import { ImgUrl } from '../../../utils/Constant';
import { FetchResort } from '../../../services/ResortApi';
import { FetchPackage } from '../../../services/PackageApi';

const EditCoupon = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [state] = useState({
    search: '',
    page: 1,
    limit: 50
  });
  const [couponData, setCouponData] = useState(null);
  const [selecteList, setSelecteList] = useState([]);
  const [showUserId, setShowUserId] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchSingleCoupon = async () => {
      try {
        const res = await getCouponById(id);
        if (res?.status) {
          setCouponData(res.data.data);
          //   setShowUserId(res.data.data.type === 'user-specific');
        }
      } catch (error) {
        console.error('Error fetching coupon:', error);
      }
    };
    fetchSingleCoupon();
  }, [id]);
  const fetchSelectFor = async (selectedType) => {
    try {
      let response;
      if (selectedType === 'resort') {
        response = await FetchResort(state);
      } else if (selectedType === 'package') {
        response = await FetchPackage(state);
      }

      if (response?.status) {
        const options = response?.data?.data?.result.map((value) => ({
          value: value._id,
          label: value.title
        }));
        console.log(options, 'optionsoptions');
        setSelecteList(options || []);
      }
    } catch (error) {
      console.error('Error fetching selections:', error);
    }
  };
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue('banner', file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    try {
      const res = await editCoupon(id, formData);
      if (res?.status) {
        showSuccessToast('Coupon Edited Successfully!');
        navigate('/user-coupons');
      }
    } catch (error) {
      console.error('Error editing coupon:', error);
    }
  };

  const validationSchema = Yup.object({
    code: Yup.string().required('Coupon Code is required'),
    for: Yup.string().required('Coupon For is required'),
    valid_from: Yup.string().required('Valid From is required'),
    valid_upto: Yup.string().required('Valid Upto is required'),
    percentage_off: Yup.number().required('Percentage Off is required').positive()
  });

  return (
    <div className="container mt-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/user-coupons">Coupons</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Coupon</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="align-items-center">
            <Col>
              <h5>Edit Coupon</h5>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          {couponData && (
            <Formik
              initialValues={{
                code: couponData.code || '',
                valid_from: couponData.valid_from ? couponData.valid_from.split('T')[0] : '',
                valid_upto: couponData.valid_upto ? couponData.valid_upto.split('T')[0] : '',
                percentage_off: couponData.percentage_off || '',
                min_amount: couponData.min_amount || '',
                for: couponData.for || '',
                user_id: couponData.user_id || '',
                banner: couponData.banner || ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, touched, errors }) => {
                console.log('Form Values: ', values);
                console.log('Form Errors: ', errors);
                return (
                  <FormikForm className="row">
                    <Form.Group controlId="for" className="col-lg-6 mb-4">
                      <Form.Label>
                        Coupon For <span className="text-danger">*</span>
                      </Form.Label>
                      <Field
                        name="for"
                        as="select"
                        className="form-select"
                        onChange={(e) => {
                          const selectedType = e.target.value;
                          fetchSelectFor(selectedType);
                          setFieldValue('for', selectedType);
                          setShowUserId(selectedType);
                        }}
                      >
                        <option value="">Select Coupon For</option>
                        <option value="package">Expedition</option>
                        <option value="resort">Resort</option>
                      </Field>
                      <ErrorMessage name="for" component="div" className="text-danger" />
                    </Form.Group>
                    {showUserId === 'resort' && (
                      <Form.Group controlId="resortId" className="col-lg-6 mb-4">
                        <label htmlFor="resortId" className="form-label">
                          Select Resort <span className="text-danger">*</span>
                        </label>
                        <Select
                          id="resortId"
                          options={selecteList}
                          onChange={(selectedOption) => {
                            const resortId = selectedOption ? selectedOption.value : null;
                            setFieldValue('resortId', resortId); // Update Formik field with the correct ID
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select Resort"
                        />
                        <ErrorMessage name="resortId" component="div" className="text-danger" />
                      </Form.Group>
                    )}

                    {showUserId === 'package' && (
                      <Form.Group controlId="packageId" className="col-lg-6 mb-4">
                        <label htmlFor="packageId" className="form-label">
                          Select Expedition <span className="text-danger">*</span>
                        </label>
                        <Select
                          id="packageId"
                          options={selecteList}
                          onChange={(selectedOption) => {
                            const packageId = selectedOption ? selectedOption.value : null;
                            setFieldValue('packageId', packageId); // Update Formik field with the correct ID
                          }}
                          classNamePrefix="react-select"
                          placeholder="Select Expedition"
                        />
                        <ErrorMessage name="packageId" component="div" className="text-danger" />
                      </Form.Group>
                    )}
                    <Form.Group className="col-lg-6 mb-4">
                      <Form.Label>Coupon Code</Form.Label>
                      <Field name="code" className="form-control" />
                      <ErrorMessage name="code" component="div" className="text-danger" />
                    </Form.Group>

                    <Form.Group className="col-lg-6 mb-4">
                      <Form.Label>Valid From</Form.Label>
                      <Field type="date" name="valid_from" className="form-control" />
                      <ErrorMessage name="valid_from" component="div" className="text-danger" />
                    </Form.Group>

                    <Form.Group className="col-lg-6 mb-4">
                      <Form.Label>Valid Upto</Form.Label>
                      <Field type="date" name="valid_upto" className="form-control" />
                      <ErrorMessage name="valid_upto" component="div" className="text-danger" />
                    </Form.Group>

                    <Form.Group className="col-lg-6 mb-4">
                      <Form.Label>Percentage Off</Form.Label>
                      <Field
                        name="percentage_off"
                        className="form-control"
                        onInput={(e) => {
                          // Remove any character that's not a digit or a decimal point
                          e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                          // Prevent multiple decimal points
                          if (e.target.value.split('.').length > 2) {
                            e.target.value = e.target.value.slice(0, -1);
                          }
                        }}
                      />
                      <ErrorMessage name="percentage_off" component="div" className="text-danger" />
                    </Form.Group>
                    {/* <Form.Group className="col-lg-6 mb-4">
                      <Form.Label>Banner</Form.Label>
                      <input type="file" className="form-control" onChange={(e) => handleFileChange(e, setFieldValue)} />
                      {previewUrl ? (
                        <div className="mt-2">
                          <img src={previewUrl} alt="Preview" width="100" />
                          <div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setFieldValue('banner', null);
                                setPreviewUrl(null); 
                              }}
                            >
                              x
                            </Button>
                          </div>
                        </div>
                      ) : couponData.banner ? (
                        <div className="mt-2">
                          <img src={`${ImgUrl}${couponData.banner}`} alt="Current Banner" width="100" />
                          <div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setFieldValue('banner', null);
                                setPreviewUrl(null); 
                              }}
                            >
                              X
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </Form.Group> */}
                    <div className="text-center">
                      <Button type="submit" variant="primary" className="mt-3">
                        Update
                      </Button>
                    </div>
                  </FormikForm>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
