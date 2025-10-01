// CreateEntryModal.js
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createFormField } from '../../../../services/UserSurveyApi';
import { showSuccessToast } from '../../toastsAlert/Alert';

const AddFieldForm = ({ showModal, handleCloseModal, fetchFields, fields }) => {
  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    title: Yup.string()
      .required('Form title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    form_id: Yup.string()
      .required('Category is required'),
    field_type: Yup.string()
      .required('Field type is required'),
    step: Yup.string()
      .required('Step is required'),
    image: Yup.mixed()
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB
      })
      .test('fileType', 'Unsupported file type', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
      }),
    isRequired: Yup.string()
      .required('Required field status is required')
  });

  const initialvalues = {
    step: '',
    field_type: '',
    form_id: '',
    name: '',
    title: '',
    isRequired: 'true',
    slug: 'slug',
    image: null
  };

  const addForm = async (data) => {
    try {
      const formData = new FormData();
      formData.append('step', data.step);
      formData.append('field_type', data.field_type);
      formData.append('form_id', data.form_id);
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('isRequired', data.isRequired);
      formData.append('slug', data.slug);
      formData.append('image', data.image);

      const res = await createFormField(formData);
      if (res?.status) {
        handleCloseModal();
        showSuccessToast('Form Added')
        fetchFields();
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
          {({ setFieldValue, values, errors, touched }) => (
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

              {/* Field Type */}
              <Form.Group controlId="field_type" className="mb-3">
                <Form.Label>Field Type <span className="text-danger">*</span></Form.Label>
                <Field 
                  as="select" 
                  name="field_type" 
                  className={`form-select ${errors.field_type && touched.field_type ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Field Type</option>
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Textarea">Textarea</option>
                  <option value="Checkbox">Checkbox</option>
                  <option value="Radio">Radio</option>
                  <option value="Select Box">Select Box</option>
                  <option value="Date">Date</option>
                  <option value="Range">Range</option>
                </Field>
                <ErrorMessage name="field_type" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Category (form_id) */}
              <Form.Group controlId="form_id" className="mb-3">
                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                <Field 
                  name="form_id" 
                  as="select" 
                  className={`form-select ${errors.form_id && touched.form_id ? 'is-invalid' : ''}`}
                >
                  <option value="">Choose Category</option>
                  {fields.map((field) => (
                    <option key={field._id} value={field._id}>
                      {field.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="form_id" component="div" className="invalid-feedback" />
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

              {/* Image Upload */}
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className={`form-control ${errors.image && touched.image ? 'is-invalid' : ''}`}
                  onChange={(event) => {
                    setFieldValue('image', event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage name="image" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Is Required */}
              <Form.Group controlId="isRequired" className="mb-3">
                <Form.Label>Is Required <span className="text-danger">*</span></Form.Label>
                <Field 
                  as="select" 
                  name="isRequired" 
                  className={`form-select ${errors.isRequired && touched.isRequired ? 'is-invalid' : ''}`}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Field>
                <ErrorMessage name="isRequired" component="div" className="invalid-feedback" />
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

export default AddFieldForm;
