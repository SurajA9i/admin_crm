import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EventCreate } from '../../../services/EventApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { Link } from 'react-router-dom';

const EventFormModal = ({ show, handleClose, Events }) => {
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    type: Yup.string()
      .required('Type is required')
      .min(2, 'Type must be at least 2 characters'),
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters'),
    date: Yup.date()
      .required('Date is required')
      .min(today, 'Please select today or a future date'),
    region: Yup.string()
      .required('Region is required')
      .oneOf(['India', 'Africa', 'Other'], 'Please select a valid region'),
    image: Yup.mixed().required('Image is required')
  });

  const initialValues = {
    title: '',
    type: '',
    location: '',
    date: '',
    description: '',
    region: '',
    image: null
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('type', values.type);
    formData.append('location', values.location);
    formData.append('date', values.date);
    formData.append('description', values.description);
    formData.append('region', values.region);
    formData.append('image', values.image);

    try {
      // Call your POST API function here
      const res = await EventCreate(formData);
      if (res?.status) {
        Events();
        handleClose();
        showSuccessToast('Event Created Successfully');
      }
    } catch (error) {
      showFailureToast('Error creating user');
    }
  };

  return (
    <>
      {/* <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/events">Events</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Add Event</Breadcrumb.Item>
      </Breadcrumb> */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik 
            initialValues={initialValues} 
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleSubmit, setFieldValue, touched, errors }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group controlId="title">
                      <Form.Label>Title<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter Title" 
                        name="title" 
                        value={values.title} 
                        onChange={handleChange}
                        isInvalid={touched.title && errors.title}
                      />
                      <ErrorMessage name="title" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="type">
                      <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter Type" 
                        name="type" 
                        value={values.type} 
                        onChange={handleChange}
                        isInvalid={touched.type && errors.type}
                      />
                      <ErrorMessage name="type" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="location">
                      <Form.Label>Location<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Location"
                        name="location"
                        value={values.location}
                        onChange={handleChange}
                        isInvalid={touched.location && errors.location}
                      />
                      <ErrorMessage name="location" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="date">
                      <Form.Label>Date<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        type="date" 
                        name="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={values.date} 
                        onChange={handleChange}
                        isInvalid={touched.date && errors.date}
                      />
                      <ErrorMessage name="date" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="region">
                      <Form.Label>Region<span className="text-danger">*</span></Form.Label>
                      <Form.Control 
                        as="select" 
                        name="region" 
                        value={values.region} 
                        onChange={handleChange}
                        isInvalid={touched.region && errors.region}
                      >
                        <option value="">Select Region</option>
                        <option value="India">India</option>
                        <option value="Africa">Africa</option>
                        <option value="Other">Other</option>
                      </Form.Control>
                      <ErrorMessage name="region" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="image">
                      <Form.Label>Image<span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setFieldValue('image', file);
                        }}
                        isInvalid={touched.image && errors.image}
                      />
                      <ErrorMessage name="image" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="description">
                      <Form.Label>Description*</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter Description"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-4">
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EventFormModal;
