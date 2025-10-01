// CreateEntryModal.js
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import { getFormFieldById, UpdateFormField } from '../../../../services/UserSurveyApi';
import { showSuccessToast } from '../../toastsAlert/Alert';

const EditFieldForm = ({ editModal, handleCloseEditModal, fetchFields, fields, modalID }) => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const res = await getFormFieldById(modalID);
    setData(res?.data?.data);
  };

  const initialvalues = {
    step: data?.step || '',
    field_type: data?.field_type || '',
    form_id: data?.form_id || '',
    name: data?.name || '',
    title: data?.title || '',
    isRequired: data?.isRequired || 'true',
    slug: data?.slug || 'slug',
    image: data?.image || null
  };

  const addForm = async (data) => {
    try {
      // Prepare form data for the image file upload
      const formData = new FormData();

      formData.append('step', data.step);
      formData.append('field_type', data.field_type);
      formData.append('form_id', data.form_id);
      formData.append('name', data.name);
      formData.append('title', data.title);
      formData.append('isRequired', data.isRequired);
      formData.append('slug', data.slug);
      formData.append('image', data.image);

      const res = await UpdateFormField(modalID, formData); // Use FormData for image upload
      if (res?.status) {
        handleCloseEditModal();
        fetchFields();
        showSuccessToast('Form Edited');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [modalID]);

  return (
    <Modal show={editModal} onHide={handleCloseEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Entry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={initialvalues} onSubmit={addForm} enableReinitialize>
          {({ setFieldValue }) => (
            <FormikForm>
              {/* Name */}
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Field type="text" name="name" className="form-control" placeholder="Enter name" />
              </Form.Group>

              {/* Form Title */}
              <Form.Group controlId="title">
                <Form.Label>Form Title</Form.Label>
                <Field type="text" name="title" className="form-control" placeholder="Enter form title" />
              </Form.Group>

              {/* Slug */}
              <Form.Group controlId="slug">
                <Form.Label>Slug</Form.Label>
                <Field type="text" name="slug" className="form-control" placeholder="Enter slug" />
              </Form.Group>

              {/* Step */}
              <Form.Group controlId="field_type">
                <Form.Label>Field Type</Form.Label>
                <Field as="select" name="field_type" className="form-control">
                  <option value="Text">Text</option>
                  <option value="Number">Number</option>
                  <option value="Textarea">Textarea</option>
                  <option value="Checkbox">Checkbox</option>
                  <option value="Radio">Radio</option>
                  <option value="Select Box">Select Box</option>
                  <option value="Date">Date</option>
                  <option value="Range">Range</option>
                </Field>
              </Form.Group>

              {/* Form_Id */}

              <Form.Group controlId="form_id" className="mb-4">
                <Form.Label>Category: *</Form.Label>
                <Field name="form_id" as="select" className="form-select">
                  <option value="">Choose Category</option>
                  {fields.map((field) => (
                    <option key={field._id} value={field._id}>
                      {field.name}
                    </option>
                  ))}
                </Field>
              </Form.Group>

              {/* Step */}
              <Form.Group controlId="step">
                <Form.Label>Step</Form.Label>
                <Field as="select" name="step" className="form-control">
                  <option value="1">Step 1</option>
                  <option value="2">Step 2</option>
                  <option value="3">Step 3</option>
                  <option value="4">Step 4</option>
                  <option value="5">Step 5</option>
                </Field>
              </Form.Group>

              {/* Image Upload */}
              <Form.Group controlId="image">
                <Form.Label>Upload Image</Form.Label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  onChange={(event) => {
                    setFieldValue('image', event.currentTarget.files[0]);
                  }}
                />

                {/* Status */}
                <Form.Group controlId="isRequired">
                  <Form.Label>Is Required</Form.Label>
                  <Field as="select" name="isRequired" className="form-control">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Field>
                </Form.Group>
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEditModal}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
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

export default EditFieldForm;
