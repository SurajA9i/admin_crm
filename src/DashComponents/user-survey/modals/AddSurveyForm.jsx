// CreateEntryModal.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSurveyForm } from '../../../../services/UserSurveyApi';
import { showSuccessToast } from '../../toastsAlert/Alert';

const AddSurveyForm = ({ showModal, handleCloseModal, getUserSurvey }) => {
  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    step: Yup.string()
      .required('Step is required'),
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must not exceed 500 characters'),
    active: Yup.string()
      .required('Status is required')
  });

  const initialvalues = {
    step: '',
    name: '',
    title: '',
    description: '',
    active: 'true',
    slug: 'slug'
  };

  const addForm = async (data) => {
    try {
      const res = await createSurveyForm(data);
      if (res?.status) {
        handleCloseModal();
        getUserSurvey();
        showSuccessToast('Form Added');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik 
          initialValues={initialvalues} 
          validationSchema={validationSchema}
          onSubmit={addForm}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <FormikForm>
              {/* Name */}
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                <Field 
                  type="text" 
                  name="name" 
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  placeholder="Enter name" 
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Slug */}
              <Form.Group controlId="slug" className="mb-3">
                <Form.Label>Slug <span className="text-danger">*</span></Form.Label>
                <Field 
                  type="text" 
                  name="slug" 
                  className="form-control" 
                  placeholder="Enter slug"
                  disabled
                  value={values.name.toLowerCase().replace(/\s+/g, '-')}
                />
              </Form.Group>

              {/* Step */}
              <Form.Group controlId="step" className="mb-3">
                <Form.Label>Step <span className="text-danger">*</span></Form.Label>
                <Field 
                  as="select" 
                  name="step" 
                  className={`form-select ${errors.step && touched.step ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Step</option>
                  <option value="1">Step 1</option>
                  <option value="2">Step 2</option>
                  <option value="3">Step 3</option>
                  <option value="4">Step 4</option>
                  <option value="5">Step 5</option>
                </Field>
                <ErrorMessage name="step" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Form Title */}
              <Form.Group controlId="title" className="mb-3">
                <Form.Label>Form Title <span className="text-danger">*</span></Form.Label>
                <Field 
                  type="text" 
                  name="title" 
                  className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                  placeholder="Enter form title" 
                />
                <ErrorMessage name="title" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Description */}
              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                <Field 
                  as="textarea" 
                  name="description" 
                  className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                  rows={3} 
                  placeholder="Enter description" 
                />
                <ErrorMessage name="description" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Status */}
              <Form.Group controlId="active" className="mb-3">
                <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                <Field 
                  as="select" 
                  name="active" 
                  className={`form-select ${errors.active && touched.active ? 'is-invalid' : ''}`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Field>
                <ErrorMessage name="active" component="div" className="invalid-feedback" />
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Close
                </Button>
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                >
                  Save
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddSurveyForm;
