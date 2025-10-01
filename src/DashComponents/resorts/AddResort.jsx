import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill'; // import ReactQuill
import { addResort } from '../../../services/ResortApi';
import { FetchDestination } from '../../../services/DestinationApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { FetchNationalPark } from '../../../services/NationalParkApi';

const relatedDestinations = ['Beaches', 'Mountains', 'Deserts', 'Forests', 'Cities'];

const validationSchema = Yup.object().shape({
  heading: Yup.string()
    .required('Heading is required')
    .min(3, 'Heading must be at least 3 characters')
    .max(100, 'Heading must not exceed 100 characters'),
  title: Yup.string()
    .required('Resort name is required')
    .min(3, 'Resort name must be at least 3 characters')
    .max(100, 'Resort name must not exceed 100 characters'),
  destination: Yup.string()
    .required('Destination is required'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  description: Yup.string()
    .required('Details are required')
    .min(10, 'Details must be at least 10 characters'),
  currency: Yup.string()
    .required('Currency is required')
    .oneOf(['INR', 'USD'], 'Please select a valid currency'),
  price: Yup.string()
    .required('Price is required')
    .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price (e.g., 100 or 100.99)')
});

const initialValues = {
  title: '',
  destination: '',
  image: null,
  additionalImages: [],
  address: '',
  price: '',
  related_destination: '',
  description: '',
  category: '',
  heading: '',
  currency: ''
};

const AddResort = () => {
  const Navigate = useNavigate();

  const [destinations, setDestination] = useState([]);
  const [editorValue, setEditorValue] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [nationalParkList, setNationalParkList] = useState([]);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [features, setFeatures] = useState([]); // State to hold the feature key-value pairs
  // const getData = async () => {
  //   const res = await FetchDestination();
  //   setDestination(res?.data?.data?.result);
  // };
  const getNationalPark = async () => {
    const response = await FetchNationalPark(state);
    if (response?.status) {
      setNationalParkList(response?.data?.data.result);
    }
  };
  const handleSingleFileChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);

    // Update Formik field values
    setFieldValue('additionalImages', [...values.additionalImages, ...files]);

    // Update preview images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };
  const removeImage = (index, setFieldValue, values) => {
    // Remove from preview images
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    // Remove from Formik values
    const updatedFiles = [...values.additionalImages];
    updatedFiles.splice(index, 1);
    setFieldValue('additionalImages', updatedFiles);
  };
  const handleDeleteFeature = (index) => {
    // Delete the feature from the list
    setFeatures((prevFeatures) => prevFeatures.filter((_, i) => i !== index));
  };
  const [inputs, setInputs] = useState([{ heading: '', title: '' }]);

  const handleAddField = () => setInputs([...inputs, { heading: '', title: '' }]);

  const handleDeleteField = (index) => setInputs(inputs.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    setInputs((prevInputs) => prevInputs.map((input, i) => (i === index ? { ...input, [field]: value } : input)));
  };

  const handleSubmit = async (values) => {
    const featureData = inputs.reduce((acc, { heading, title }) => {
      if (heading && title) acc[heading] = title;
      return acc;
    }, {});
    const formData = new FormData();

    formData.append('heading', values.heading);
    formData.append('title', values.title);
    formData.append('destination', values.destination);
    formData.append('image', values.image);
    formData.append('address', values.address);
    formData.append('price', values.price);
    // formData.append('related_destination', values.related_destination);
    formData.append('description', editorValue);
    formData.append('currency', values.currency);
    // formData.append('category', values.category); //>>>> category field

    for (const file of values.additionalImages) {
      formData.append('additional_images', file);
    }
    formData.append('features', JSON.stringify(featureData));

    try {
      const response = await addResort(formData);
      if (response?.status) {
        showSuccessToast('Successfully Added');
        Navigate('/resorts');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Add');
    }
  };

  useEffect(() => {
    // getData();
    getNationalPark();
  }, []);

  return (
    <>
      <div className="container mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/resorts">Resorts</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Add Resort</Breadcrumb.Item>
        </Breadcrumb>

        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5>Add Resort</h5>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values, touched, errors }) => (
                <FormikForm className="row">
                  <Form.Group className="col-lg-6 mb-4" controlId="heading">
                    <Form.Label>Heading<span className="text-danger">*</span></Form.Label>
                    <Field 
                      name="heading" 
                      as={Form.Control} 
                      placeholder="Enter heading"
                      className={`form-control ${touched.heading && errors.heading ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="heading" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="title">
                    <Form.Label>Resort Name<span className="text-danger">*</span></Form.Label>
                    <Field 
                      name="title" 
                      as={Form.Control} 
                      placeholder="Enter title"
                      className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="destination">
                    <Form.Label>Destination<span className="text-danger">*</span></Form.Label>
                    <Field 
                      as={Form.Select} 
                      name="destination"
                      className={`form-control ${touched.destination && errors.destination ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select Destination</option>
                      {nationalParkList?.map((dest, index) => (
                        <option key={index} value={dest?._id}>
                          {dest?.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="destination" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="address">
                    <Form.Label>Address<span className="text-danger">*</span></Form.Label>
                    <Field 
                      name="address" 
                      as={Form.Control} 
                      placeholder="Enter address"
                      className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="description">
                    <Form.Label>Destination Details<span className="text-danger">*</span></Form.Label>
                    <div className={`${touched.description && errors.description ? 'is-invalid' : ''}`}>
                      <ReactQuill 
                        value={editorValue} 
                        onChange={(value) => {
                          setEditorValue(value);
                          setFieldValue('description', value);
                        }} 
                        placeholder="Write the description here" 
                      />
                    </div>
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="currency">
                    <Form.Label>Currency<span className="text-danger">*</span></Form.Label>
                    <Field 
                      as={Form.Select} 
                      name="currency"
                      className={`form-control ${touched.currency && errors.currency ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select Currency</option>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </Field>
                    <ErrorMessage name="currency" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="price">
                    <Form.Label>Price<span className="text-danger">*</span></Form.Label>
                    <Field
                      name="price"
                      as={Form.Control}
                      placeholder="Enter price"
                      type="text"
                      pattern="^\d+(\.\d{1,2})?$"
                      title="Please enter a valid price (e.g. 100 or 100.99)"
                      className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                        if (e.target.value.split('.').length > 2) {
                          e.target.value = e.target.value.slice(0, -1);
                        }
                      }}
                    />
                    <ErrorMessage name="price" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setFieldValue('image', e.target.files[0])} />
                    <ErrorMessage name="image" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="additionalImages">
                    <Form.Label>Additional Images</Form.Label>
                    <Form.Control type="file" multiple onChange={(e) => handleSingleFileChange(e, setFieldValue, values)} />
                    <ErrorMessage name="additionalImages" component="div" className="text-danger" />
                    <div className="row mt-3">
                      {previewImages.length > 0 &&
                        previewImages.map((url, index) => (
                          <div key={url} className="col-md-2 mb-3">
                            <div className="img-block">
                              <img
                                src={url}
                                alt={`Preview ${index}`}
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover'
                                }}
                              />
                              <span
                                className="remove_img"
                                style={{
                                  cursor: 'pointer',
                                  color: 'red',
                                  marginLeft: '8px'
                                }}
                                onClick={() => removeImage(index, setFieldValue, values)}
                              >
                                X
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Form.Group>

                  <div className="col-lg-6 mb-3">
                    {inputs.map((input, index) => (
                      <Form.Group className="col-lg-4 col-sm-6 mb-3" controlId="feature">
                        <Form.Label>Add Features </Form.Label>

                        <Form.Label>
                          <span key={index}>
                            <input
                              type="text"
                              placeholder="feature"
                              value={input.heading}
                              onChange={(e) => handleChange(index, 'heading', e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Title"
                              value={input.title}
                              onChange={(e) => handleChange(index, 'title', e.target.value)}
                            />
                            <button onClick={() => handleDeleteField(index)}>Delete</button>
                          </span>
                        </Form.Label>
                      </Form.Group>
                    ))}
                    <button onClick={handleAddField}>Add Feature</button>
                  </div>
                  <div>
                    {features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <p>
                          <strong>{feature.featureKey}</strong>: {feature.featureValue}
                        </p>
                        <button type="button" onClick={() => handleDeleteFeature(index)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddResort;
