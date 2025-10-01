import React, { useState } from 'react';
import { Form, Button, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { createCoupon } from '../../../services/CouponApi';
import { FetchResort } from '../../../services/ResortApi';
import { FetchPackage } from '../../../services/PackageApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import Select from 'react-select';

const AddCoupon = () => {
  const navigate = useNavigate();
  const [showUserId, setShowUserId] = useState(false);
  const [selecteList, setSelecteList] = useState([]);
  const [state] = useState({
    search: '',
    page: 1,
    limit: 50
  });

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

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values, 'valuesvalues');
    try {
      const formData = new FormData();
      formData.append('code', values.code);
      // formData.append('banner', values.banner);
      formData.append('for', values.for);
      formData.append('valid_from', values.valid_from);
      formData.append('valid_upto', values.valid_upto);
      showUserId === 'resort' && formData.append('resortId', values.resortId);
      showUserId === 'package' && formData.append('packageId', values.packageId);
      formData.append('percentage_off', values.percentage_off);
      if (values.type === 'user-specific') {
        formData.append('userId', values.userId);
      }

      const res = await createCoupon(formData);
      if (res?.status) {
        navigate('/user-coupons');
        showSuccessToast('Coupon added Successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    code: Yup.string().required('Coupon code is required'),
    valid_from: Yup.string().required('Valid From is required'),
    valid_upto: Yup.string().required('Valid Upto is required'),
    percentage_off: Yup.string()
      .matches(/^\d+(\.\d{1,2})?$/, 'Must be a valid number')
      .required('Percentage Off is required'),
    for: Yup.string().required('Coupon for type is required'),
    publish: Yup.string().required('Publish status is required')
  });

  return (
    <div className="container mt-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/user-coupons">Coupon</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Add Coupon</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Add Coupon</h5>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Formik
            initialValues={{
              code: '',
              valid_from: '',
              valid_upto: '',
              percentage_off: '',
              // banner: null,
              min_amount: '',
              for: '',
              publish: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <FormikForm className="row">
                {/* Coupon For Dropdown */}
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

                {/* Coupon Code Field */}
                <Form.Group controlId="code" className="col-lg-6 mb-4">
                  <Form.Label>Coupon Code</Form.Label>
                  <Field
                    name="code"
                    type="text"
                    placeholder="Enter coupon code"
                    className="form-control"
                    onChange={(e) => setFieldValue('code', e.target.value.toUpperCase())}
                  />
                  <ErrorMessage name="code" component="div" className="text-danger" />
                </Form.Group>

                {/* Valid From & Valid Upto */}
                <Form.Group controlId="valid_from" className="col-lg-6 mb-4">
                  <Form.Label>Valid From</Form.Label>
                  <Field name="valid_from" type="date" className="form-control" />
                  <ErrorMessage name="valid_from" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group controlId="valid_upto" className="col-lg-6 mb-4">
                  <Form.Label>Valid Upto</Form.Label>
                  <Field name="valid_upto" type="date" className="form-control" />
                  <ErrorMessage name="valid_upto" component="div" className="text-danger" />
                </Form.Group>

                {/* Percentage Off */}
                <Form.Group controlId="percentage_off" className="col-lg-6 mb-4">
                  <Form.Label>Percentage Off</Form.Label>
                  <Field
                    name="percentage_off"
                    className="form-control"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                      if (e.target.value.split('.').length > 2) {
                        e.target.value = e.target.value.slice(0, -1);
                      }
                    }}
                  />
                  <ErrorMessage name="percentage_off" component="div" className="text-danger" />
                </Form.Group>

                {/* Publish Status */}
                <Form.Group controlId="publish" className="col-lg-6 mb-4">
                  <Form.Label>
                    Publish <span className="text-danger">*</span>
                  </Form.Label>
                  <Field name="publish" as="select" className="form-select">
                    <option value="">Select Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Field>
                  <ErrorMessage name="publish" component="div" className="text-danger" />
                </Form.Group>
                {/* <Form.Group controlId="banner" className="col-lg-6 mb-4">
                  <label htmlFor="banner" className="form-label">
                    Upload Banner <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    id="banner"
                    className="form-control"
                    accept="image/*, video/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue('banner', file); // Update Formik field with file
                    }}
                  />
                  <ErrorMessage name="banner" component="div" className="text-danger" />
                </Form.Group> */}

                {/* Submit Button */}
                <div className="text-center">
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddCoupon;
