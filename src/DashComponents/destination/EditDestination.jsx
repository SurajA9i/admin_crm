import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Field, Formik } from 'formik';
import { UpdateDetination, getDetinationById } from '../../../services/DestinationApi';
import ReactQuill from 'react-quill'; // Using ReactQuill instead of RichTextEditor
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const EditDestination = ({ show, handleClose, getData, modalID }) => {
  const [editorValue, setEditorValue] = useState('');
  const [data, setData] = useState([]);

  const response = async () => {
    const res = await getDetinationById(modalID);
    setData(res?.data?.data);
    setEditorValue(res?.data?.data?.description);
  };

  const initialValues = {
    title: data?.title || '',
    description: data?.description || '',
    address: data?.address || '',
    image: data?.image || null,
    price: data?.price || '',
    preference: data?.preference || '',
    additional_preference: data?.additional_preference || ''
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('address', values.address);
    formData.append('image', values.image);
    formData.append('price', values.price);
    formData.append('preference', values.preference);
    formData.append('additional_preference', values.additional_preference);

    try {
      const res = await UpdateDetination(modalID, formData);
      getData();
      showSuccessToast('Successfully Edited');
      handleClose();
    } catch (error) {
      console.log(error, 'error found');
    }
  };

  useEffect(() => {
    response();
  }, [modalID]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)} enableReinitialize>
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="title">
                    <Form.Label>Title*</Form.Label>
                    <Form.Control type="text" placeholder="Enter Title" name="title" value={values.title} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="description">
                    <Form.Label>Description*</Form.Label>
                    <ReactQuill
                      value={editorValue}
                      onChange={(value) => {
                        setEditorValue(value);
                        setFieldValue('description', value); // Sync editor with Formik field
                      }}
                      placeholder="Enter description"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" name="address" value={values.address} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="image">
                    <Form.Label>Image*</Form.Label>
                    <Form.Control type="file" name="image" onChange={(e) => setFieldValue('image', e.target.files[0])} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control type="text" placeholder="Price" name="price" value={values.price} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group controlId="preference">
                    <Form.Label>Destination Preference</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Destination Preference"
                      name="preference"
                      value={values.preference}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="additional_preference">
                <Form.Label>Additional Preference</Form.Label>
                <Form.Control as="select" name="additional_preference" value={values.additional_preference} onChange={handleChange}>
                  <option value="Text">Text</option>
                </Form.Control>
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EditDestination;
