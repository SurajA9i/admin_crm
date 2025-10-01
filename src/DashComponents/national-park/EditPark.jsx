import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { Breadcrumb, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { UpdateNationalPark, getNationalParkById } from '../../../services/NationalParkApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';
import FocalPointPicker from './FocalPointPicker';

const EditNationalPark = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parkData, setParkData] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [previewImages, setPreviewImages] = useState(null);
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 }); // Default center

  // Fetch national park data by ID
  const getDataById = async () => {
    try {
      const res = await getNationalParkById(id);
      const data = res?.data?.data;
      setParkData(data);
      setEditorValue(data?.description || '');
      setPreviewImages(`${ImgUrl}${data?.image}` || null);
      // Set focal point from existing data or default to center
      if (data?.focalPoint) {
        setFocalPoint({
          x: data.focalPoint.x || 50,
          y: data.focalPoint.y || 50
        });
      } else {
        setFocalPoint({ x: 50, y: 50 });
      }
    } catch (error) {
      console.error('Error fetching park data:', error);
    }
  };

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      if (id) {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('location', values.location);
        formData.append('region', values.region);
        formData.append('state', values.state);
        formData.append('description', values.description);
        formData.append('category', values.category);
        // Only include focal point data if we have valid coordinates
        if (focalPoint && typeof focalPoint.x === 'number' && typeof focalPoint.y === 'number') {
          formData.append('focalPoint[x]', focalPoint.x);
          formData.append('focalPoint[y]', focalPoint.y);
        }
        // Only append image if a new one is selected

        if (values.image) {
          formData.append('image', values.image);
        }

        const parkResponse = await UpdateNationalPark(id, formData);
        if (parkResponse?.status) {
          navigate('/national-parks');
          showSuccessToast('National Park Is Updated Successfully.');
        }
      }
    } catch (error) {
      console.error('Error updating park:', error);
      showFailureToast('Failed');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) getDataById();
  }, [id]);

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
        <Breadcrumb.Item active>Edit National Park</Breadcrumb.Item>
      </Breadcrumb>

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Edit National Park</h5>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          {parkData ? (
            <Formik
              initialValues={{
                name: parkData.name || '',
                location: parkData.location || '',
                region: parkData.region || '',
                state: parkData.state || '',
                description: parkData.description || '',
                category: parkData.category || '',
                image: null
              }}
              enableReinitialize
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, setFieldValue, isSubmitting }) => (
                <FormikForm className="row">
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">National Park Name</Form.Label>
                    <Field id="name" name="name" type="text" placeholder="Enter National Park Name" className="form-control" />
                  </Form.Group>

                  {/* Category */}
                  <Form.Group className="col-lg-6 mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Field as="select" name="category" className="form-control">
                      <option value="">No Category (Will only appear in All Destinations)</option>
                      <option value="Most Popular">Most Popular</option>
                      <option value="Best Rated">Best Rated</option>
                      <option value="Most Adventures">Most Adventures</option>
                    </Field>
                    <ErrorMessage name="category" component="div" className="text-danger" />
                  </Form.Group>

                  {/* Location */}
                  <Form.Group className="col-lg-6 mb-3">
                    <Form.Label htmlFor="location">Location</Form.Label>
                    <Field id="location" name="location" type="text" placeholder="Enter location" className="form-control" />
                  </Form.Group>

                  {/* Region */}
                  <Form.Group className="col-lg-6 mb-3" controlId="region">
                    <Form.Label>Region*</Form.Label>
                    <Field as="select" name="region" className="form-control">
                      <option value="">Select Region</option>
                      <option value="India">India</option>
                      <option value="Africa">Africa</option>
                    </Field>
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

                  {/* Image Upload & Preview */}
                  <Form.Group className="col-lg-6 mb-3" controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      name="image"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setFieldValue('image', file);
                        if (file) {
                          const previewUrl = URL.createObjectURL(file);
                          setPreviewImages(previewUrl);
                          // Reset focal point to center when new image is selected
                          setFocalPoint({ x: 50, y: 50 });
                        }
                      }}
                    />
                    {previewImages && (
                      <div className="mt-2">
                        <img src={previewImages} alt="Preview" className="img-thumbnail" width="150" />
                      </div>
                    )}
                    <ErrorMessage name="image" component="div" className="text-danger" />
                  </Form.Group>

                  {/* Focal Point Picker - Full Width */}
                  {previewImages && (
                    <div className="col-12 mb-3">
                      <FocalPointPicker
                        imageUrl={previewImages}
                        focalPoint={focalPoint}
                        onFocalPointChange={setFocalPoint}
                        label="Set Image Focal Point (Click on the most important part of the image)"
                      />
                    </div>
                  )}  
                  
                  {/* Description */}
                  <Form.Group controlId="description" className="col-lg-6 mb-3">
                    <Form.Label>
                      Description<span className="text-danger">*</span>
                    </Form.Label>
                    <ReactQuill
                      value={editorValue}
                      onChange={(value) => {
                        setEditorValue(value);
                        setFieldValue('description', value);
                      }}
                    />
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EditNationalPark;
