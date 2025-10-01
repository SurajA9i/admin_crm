import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';

import { fetchExpeditionsById, updateExpeditions } from '../../../services/ExpeditionsApi';

import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';

const EditExpeditions = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [editorValue, setEditorValue] = useState('');
  const [expeditionsById, setExpeditionsById] = useState({});
  const [showSelectedImg, setShowSelectedImage] = useState(null);

  const getExpeditionsById = async () => {
    try {
      const response = await fetchExpeditionsById(id);
      if (response?.status) {
        const dataList = response?.data?.data[0];
        setExpeditionsById(dataList);
        setEditorValue(dataList?.description || '');
      }
    } catch (error) {
      console.log('Error:::', error);
    }
  };

  const initialValues = {
    title: expeditionsById?.title || '',
    date: expeditionsById?.date ? new Date(expeditionsById?.date).toISOString().split('T')[0] : '',
    image: expeditionsById?.image || null,
    location: expeditionsById?.location || '',
    price: expeditionsById?.price || '',
    related_destination: expeditionsById?.related_destination || '',
    description: expeditionsById?.description || '',
    accommodation: expeditionsById?.accommodation || '',
    medical_req: expeditionsById?.medical_req || '',
    type: expeditionsById?.type || ''
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('date', values.date);
    formData.append('location', values.location);
    formData.append('type', values.type);
    formData.append('image', values.image);
    formData.append('medical_req', values.medical_req);
    formData.append('price', values.price);
    formData.append('accommodation', values.accommodation);
    formData.append('description', editorValue);

    try {
      const response = await updateExpeditions(id, formData);
      if (response?.status) {
        showSuccessToast('Expeditions Updated Successfully! ');
        navigate('/jungle-expeditions');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Edit');
    }
  };

  useEffect(() => {
    getExpeditionsById();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/jungle-expeditions">Expeditions</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Expeditions</Breadcrumb.Item>
      </Breadcrumb>

      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ setFieldValue }) => (
          <FormikForm>
            <h3>Edit Expeditions</h3>
            <Row className="mb-3">
              <Col>
                <label htmlFor="title">Title</label>
                <Field name="title" className="form-control" placeholder="Enter title" />
                <ErrorMessage name="title" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="description">Description</label>
                <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Write the description here" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue('image', e.target.files[0]);
                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                    setShowSelectedImage(fileUrl);
                  }}
                />
                <ErrorMessage name="image" component="div" className="text-danger" />
                {expeditionsById?.image && !showSelectedImg && (
                  <img className="mt-3" src={`${ImgUrl}${expeditionsById?.image}`} alt="img" height={250} width={250} />
                )}
                {showSelectedImg && <img className="mt-3" src={showSelectedImg} alt="img" height={250} width={300} />}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="date">Date</label>
                <Field name="date" type="date" className="form-control" />
                <ErrorMessage name="date" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="location">Location</label>
                <Field name="location" className="form-control" placeholder="Enter location" />
                <ErrorMessage name="location" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="price">Price</label>
                <Field
                  name="price"
                  className="form-control"
                  placeholder="Enter price"
                  type="text"
                  pattern="^\d+(\.\d{1,2})?$"
                  title="Please enter a valid price (e.g. 100 or 100.99)"
                  onInput={(e) => {
                    // Remove any character that's not a digit or a decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");

                    // Prevent multiple decimal points
                    if (e.target.value.split('.').length > 2) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                />
                {/* <Field name="price" type="number" className="form-control" placeholder="Enter price" /> */}
                <ErrorMessage name="price" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="type">Type</label>
                <Field name="type" className="form-control" placeholder="Enter type" />
                <ErrorMessage name="type" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="medical_req">Medical Requirement</label>
                <Field name="medical_req" className="form-control" placeholder="Enter medical requirement" />
                <ErrorMessage name="medical_req" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="accommodation">Accommodation</label>
                <Field name="accommodation" className="form-control" placeholder="Enter accommodation" />
                <ErrorMessage name="accommodation" component="div" className="text-danger" />
              </Col>
            </Row>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default EditExpeditions;
