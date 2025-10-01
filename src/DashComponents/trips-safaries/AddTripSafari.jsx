import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Form, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { addTripSafari } from '../../../services/TripsAndSafari';
import { showFailureToast, showSuccessToast } from 'DashComponents/toastsAlert/Alert';
import { FetchResort } from '../../../services/ResortApi';
import Select from 'react-select';

// Validation Schema
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  type: Yup.string()
    .required('Type is required')
    .min(2, 'Type must be at least 2 characters'),
  price: Yup.string()
    .required('Price is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price (e.g. 100 or 100.99)'),
  currency: Yup.string()
    .required('Currency is required'),
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Date cannot be in the past'),
  // Optional fields
  image: Yup.mixed()
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true;
      return value.size <= 5000000; // 5MB
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),
  location: Yup.string()
    .min(2, 'Location must be at least 2 characters'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters'),
  medical_req: Yup.string(),
  accommodation: Yup.string(),
  accommodation_list: Yup.array()
});

const initialValues = {
  title: '',
  image: null,
  date: '',
  location: '',
  price: '',
  currency: '',
  description: '',
  type: '',
  accommodation: '',
  medical_req: '',
  accommodation_list: []
};

const AddTripSafari = () => {
  const Navigate = useNavigate();
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [editorValue, setEditorValue] = useState('');
  const [resortList, setResortList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('date', values.date);
    formData.append('location', values.location);
    formData.append('type', values.type);
    formData.append('image', values.image);
    formData.append('medical_req', values.medical_req);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('accommodation', values.accommodation);
    formData.append('accommodation_list', JSON.stringify(values.accommodation_list));
    formData.append('description', editorValue);
    try {
      const response = await addTripSafari(formData);
      if (response?.status) {
        showSuccessToast('Successfully Added Trips & safaries');
        Navigate('/trips-safari');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Add');
    }
  };

  const getAllResort = async () => {
    const response = await FetchResort(state);
    setResortList(response?.data?.data?.result || []);
    setTotalPages(response?.data?.data?.totalPages || 1);
  };

  useEffect(() => {
    getAllResort();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/trips-safari">Trips And Safari</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Trips And safari</Breadcrumb.Item>
      </Breadcrumb>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <FormikForm>
            <h3>Add Trips And Safari</h3>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="title">
                  <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                  <Field 
                    name="title" 
                    as={Form.Control} 
                    placeholder="Enter title"
                    className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="title" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <ReactQuill 
                    value={editorValue} 
                    onChange={(value) => {
                      setEditorValue(value);
                      setFieldValue('description', value);
                    }}
                    className={errors.description && touched.description ? 'is-invalid' : ''}
                    placeholder="Write the description here" 
                  />
                  <ErrorMessage name="description" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFieldValue('image', e.target.files[0])}
                    className={`form-control ${errors.image && touched.image ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="image" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="date">
                  <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                  <Field 
                    name="date" 
                    as={Form.Control} 
                    type="date"
                    className={`form-control ${errors.date && touched.date ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="date" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Field 
                    name="location" 
                    as={Form.Control} 
                    placeholder="Enter location"
                    className={`form-control ${errors.location && touched.location ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="location" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="price">
                  <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                  <Field
                    name="price"
                    as={Form.Control}
                    placeholder="Enter price"
                    type="text"
                    pattern="^\d+(\.\d{1,2})?$"
                    title="Please enter a valid price (e.g. 100 or 100.99)"
                    className={`form-control ${errors.price && touched.price ? 'is-invalid' : ''}`}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                      if (e.target.value.split('.').length > 2) {
                        e.target.value = e.target.value.slice(0, -1);
                      }
                    }}
                  />
                  <ErrorMessage name="price" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="currency">
                  <Form.Label>Currency <span className="text-danger">*</span></Form.Label>
                  <Field 
                    as={Form.Select} 
                    name="currency"
                    className={`form-select ${errors.currency && touched.currency ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </Field>
                  <ErrorMessage name="currency" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="type">
                  <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                  <Field 
                    name="type" 
                    as={Form.Control} 
                    placeholder="Enter type" 
                    type="text"
                    className={`form-control ${errors.type && touched.type ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="type" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="medical_req">
                  <Form.Label>Medical Requirement</Form.Label>
                  <Field 
                    name="medical_req" 
                    as={Form.Control} 
                    placeholder="Enter medical requirement" 
                    type="text"
                    className={`form-control ${errors.medical_req && touched.medical_req ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="medical_req" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="accommodation">
                  <Form.Label>Accommodation</Form.Label>
                  <Field 
                    name="accommodation" 
                    as={Form.Control} 
                    placeholder="Enter accommodation" 
                    type="text"
                    className={`form-control ${errors.accommodation && touched.accommodation ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="accommodation" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group className="col-lg-6 mb-4" controlId="accommodation_list">
                  <Form.Label>Select Resorts For Accommodation</Form.Label>
                  <Field name="accommodation_list">
                    {({ field, form }) => {
                      const selectedOptions = resortList?.filter((resort) => form.values.accommodation_list?.includes(resort._id));
                      const handleChange = (selectedOptions) => {
                        form.setFieldValue('accommodation_list', selectedOptions ? selectedOptions.map((option) => option.value) : []);
                      };
                      return (
                        <div className={errors.accommodation_list && touched.accommodation_list ? 'is-invalid' : ''}>
                          <Select
                            isMulti
                            options={resortList?.map((resort) => ({
                              value: resort._id,
                              label: resort.title
                            }))}
                            value={selectedOptions?.map((resort) => ({
                              value: resort._id,
                              label: resort.title
                            }))}
                            onChange={handleChange}
                            className={errors.accommodation_list && touched.accommodation_list ? 'is-invalid' : ''}
                          />
                        </div>
                      );
                    }}
                  </Field>
                  <ErrorMessage name="accommodation_list" component="div" className="invalid-feedback" />
                </Form.Group>
              </Col>
            </Row>

            <Button 
              variant="primary" 
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              Submit
            </Button>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default AddTripSafari;
