import React, { useState } from 'react';
import { Breadcrumb, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NationalParkCreate } from '../../../services/NationalParkApi';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import ReactQuill from 'react-quill';
import RichTextEditor from 'react-rte';
import FocalPointPicker from './FocalPointPicker';

const AddNationalPark = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 }); // Default to center

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('National Park name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must not exceed 100 characters'),
    category: Yup.string()
      .oneOf([
        'Most Popular',
        'Best Rated', 
        'Most Adventures',
        '' // Allow empty string for no category
      ], 'Please select a valid category'),
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters'),
    region: Yup.string()
      .required('Region is required')
      .oneOf(['India', 'Africa'], 'Please select a valid region')
  });

  const initialValues = {
    name: '',
    location: '',
    region: '',
    state: '',
    category: '',
    image: null,
    description: RichTextEditor.createEmptyValue().toString('html')
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('location', values.location);
      formData.append('category', values.category);
      formData.append('region', values.region);
      formData.append('state', values.state);
      formData.append('description', values?.description);
      
      // Only append image and focal point data if an image is actually selected
      if (values.image) {
        formData.append('image', values.image);
        
        // Add focal point data only if both image and focal point exist
        if (focalPoint) {
          formData.append('focalPoint[x]', focalPoint.x);
          formData.append('focalPoint[y]', focalPoint.y);
        }
      }

      const res = await NationalParkCreate(formData);

      if (res?.status) {
        showSuccessToast('National Park Successfully Created');
        navigate('/national-parks');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed');
    }
  };

  return (
    <Container className="mt-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/national-parks">National Park</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add National Park</Breadcrumb.Item>
      </Breadcrumb>

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Add National Park</h5>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, handleChange, handleSubmit, touched, errors }) => (
              <FormikForm className="row" onSubmit={handleSubmit}>
                <Form.Group className="col-lg-6 mb-3">
                  <Form.Label htmlFor="name">National Park Name<span className="text-danger">*</span></Form.Label>
                  <Field 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Enter National Park Name" 
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-4" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Field 
                    as={Form.Select} 
                    name="category"
                    className={`form-control ${touched.category && errors.category ? 'is-invalid' : ''}`}
                  >
                    <option value="">No Category (Will only appear in All Destinations)</option>
                    <option value="Most Popular">Most Popular</option>
                    <option value="Best Rated">Best Rated</option>
                    <option value="Most Adventures">Most Adventures</option>
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3">
                  <Form.Label htmlFor="location">Location<span className="text-danger">*</span></Form.Label>
                  <Field 
                    id="location" 
                    name="location" 
                    type="text" 
                    placeholder="Enter location" 
                    className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="location" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="region">
                  <Form.Label>Region<span className="text-danger">*</span></Form.Label>
                  <Field
                    as="select"
                    name="region"
                    className={`form-control ${touched.region && errors.region ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Region</option>
                    <option value="India">India</option>
                    <option value="Africa">Africa</option>
                  </Field>
                  <ErrorMessage name="region" component="div" className="text-danger" />
                </Form.Group>

                {/* Dynamic State/Country Field */}
                <Form.Group className="col-lg-6 mb-3" controlId="state">
                  <Form.Label>
                    {values.region === 'India' ? 'State' : values.region === 'Africa' ? 'Country' : 'State/Country'}
                  </Form.Label>
                  <Field
                    as="select"
                    name="state"
                    className="form-control"
                    disabled={!values.region}
                  >
                    <option value="">
                      {values.region === 'India' ? 'Select State' : 
                       values.region === 'Africa' ? 'Select Country' : 'Select Region First'}
                    </option>
                    
                    {/* Indian States */}
                    {values.region === 'India' && [
                      'Rajasthan', 'Karnataka', 'Madhya Pradesh', 'Maharashtra',
                      'Uttarakhand', 'Kerala', 'West Bengal', 'Gujarat', 
                      'Himachal Pradesh', 'Tamil Nadu', 'Assam', 'Odisha'
                    ].map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                    
                    {/* African Countries */}
                    {values.region === 'Africa' && [
                      'Kenya', 'Tanzania', 'South Africa', 'Botswana',
                      'Namibia', 'Uganda', 'Rwanda', 'Zambia', 'Zimbabwe', 'Malawi'
                    ].map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </Field>
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="image">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue('image', file);
                      if (file) {
                        const previewUrl = URL.createObjectURL(file);
                        setPreviewImage(previewUrl);
                        // Reset focal point to center when new image is selected
                        setFocalPoint({ x: 50, y: 50 });
                      } else {
                        setPreviewImage(null);
                        setFocalPoint({ x: 50, y: 50 });
                      }
                    }}
                  />
                  <ErrorMessage name="image" component="div" className="text-danger" />
                </Form.Group>
                
                {/* Focal Point Picker - Full Width */}
                {previewImage && (
                  <div className="col-12 mb-3">
                    <FocalPointPicker
                      imageUrl={previewImage}
                      focalPoint={focalPoint}
                      onFocalPointChange={setFocalPoint}
                      label="Set Image Focal Point (Click on the most important part of the image)"
                    />
                  </div>
                )}    

                <Form.Group className="col-lg-6 mb-3" controlId="description">
                  <Form.Label>
                    Description<span className="text-danger">*</span>
                  </Form.Label>
                  <ReactQuill
                    value={values.description} // Controlled component
                    onChange={(value) => setFieldValue('description', value)} // Updating Formik state
                    className="form-control"
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Form.Group>
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
    </Container>
  );
};

export default AddNationalPark;
