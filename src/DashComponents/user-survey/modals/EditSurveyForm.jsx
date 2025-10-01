// CreateEntryModal.js
import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { getSurveyFormById, UpdateSurveyForm } from '../../../../services/UserSurveyApi';
import { showSuccessToast } from '../../toastsAlert/Alert';

const EditSurveyForm = ({ handleEditCloseModal, editModal, getUserSurvey, ModalId }) => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const res = await getSurveyFormById(ModalId);
    setData(res?.data?.data);
  };

  const initialvalues = {
    step: data?.step || '',
    name: data?.name || '',
    title: data?.title || '',
    description: data?.description || '',
    active: data?.active || 'true',
    slug: data?.slug || 'slug'
  };

  const addForm = async (data) => {
    try {
      const res = await UpdateSurveyForm(ModalId, data);
      if (res?.status) {
        handleEditCloseModal();
        getUserSurvey();
        showSuccessToast('Form Edited');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [ModalId]);

  return (
    <Modal show={editModal} onHide={handleEditCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Form</Modal.Title>
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

              {/* Slug */}
              <Form.Group controlId="slug">
                <Form.Label>Slug</Form.Label>
                <Field type="text" name="slug" className="form-control" placeholder="Enter slug" />
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

              {/* Form Title */}
              <Form.Group controlId="title">
                <Form.Label>Form Title</Form.Label>
                <Field type="text" name="title" className="form-control" placeholder="Enter form title" />
              </Form.Group>

              {/* Description */}
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Field as="textarea" name="description" className="form-control" rows={3} placeholder="Enter description" />
              </Form.Group>

              {/* Status */}
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Field as="select" name="status" className="form-control">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Field>
              </Form.Group>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleEditCloseModal}>
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

export default EditSurveyForm;
