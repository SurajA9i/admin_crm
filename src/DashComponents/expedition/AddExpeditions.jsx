import React, { useState } from 'react';
import { Breadcrumb, Button, Col, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { addExpeditions } from '../../../services/ExpeditionsApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import * as Yup from 'yup';

const AddExpeditions = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [editorValue, setEditorValue] = useState('');
  const [showSelectedImg, setShowSelectedImage] = useState(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    date: Yup.date()
      .required('Date is required')
      .min(new Date(), 'Date must be in the future'),
    image: Yup.mixed()
      .required('Image is required'),
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters'),
    price: Yup.string()
      .required('Price is required')
      .matches(/^\d+(\.\d{1,2})?$/, 'Please enter a valid price (e.g. 100 or 100.99)'),
    type: Yup.string()
      .required('Type is required')
      .min(2, 'Type must be at least 2 characters'),
    medical_req: Yup.string()
      .required('Medical requirement is required')
      .min(3, 'Medical requirement must be at least 3 characters'),
    accommodation: Yup.string()
      .required('Accommodation is required')
      .min(3, 'Accommodation must be at least 3 characters')
  });

  const initialValues = {
    title: '',
    date: '',
    image: null,
    location: '',
    price: '',
    related_destination: '',
    description: '',
    accommodation: '',
    medical_req: '',
    type: ''
  };

  const handleSubmit = async (values) => {
    if (!editorValue) {
      showFailureToast('Description is required');
      return;
    }

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
      const response = await addExpeditions(formData);
      if (response?.status) {
        showSuccessToast('Expeditions Added Successfully! ');
        navigate('/jungle-expeditions');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Add');
    }
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/jungle-expeditions">Expeditions</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Expeditions</Breadcrumb.Item>
      </Breadcrumb>

      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={handleSubmit} 
        enableReinitialize
      >
        {({ setFieldValue, touched, errors }) => (
          <FormikForm>
            <h3>Add Expeditions</h3>
            <Row className="mb-3">
              <Col>
                <label htmlFor="title">Title<span className="text-danger">*</span></label>
                <Field 
                  name="title" 
                  className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter title" 
                />
                <ErrorMessage name="title" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="description">Description<span className="text-danger">*</span></label>
                <ReactQuill 
                  value={editorValue} 
                  onChange={setEditorValue} 
                  placeholder="Write the description here"
                  className={!editorValue ? 'is-invalid' : ''}
                />
                {!editorValue && <div className="text-danger">Description is required</div>}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="image">Image<span className="text-danger">*</span></label>
                <input
                  type="file"
                  className={`form-control ${touched.image && errors.image ? 'is-invalid' : ''}`}
                  onChange={(e) => {
                    setFieldValue('image', e.target.files[0]);
                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                    setShowSelectedImage(fileUrl);
                  }}
                  accept="image/*"
                />
                <ErrorMessage name="image" component="div" className="text-danger" />
                {showSelectedImg && <img className="mt-3" src={showSelectedImg} alt="img" height={250} width={300} />}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="date">Date<span className="text-danger">*</span></label>
                <Field 
                  name="date" 
                  type="date" 
                  className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                <ErrorMessage name="date" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="location">Location<span className="text-danger">*</span></label>
                <Field 
                  name="location" 
                  className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                  placeholder="Enter location" 
                />
                <ErrorMessage name="location" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="price">Price<span className="text-danger">*</span></label>
                <Field
                  name="price"
                  className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`}
                  placeholder="Enter price"
                  type="text"
                  pattern="^\d+(\.\d{1,2})?$"
                  title="Please enter a valid price (e.g. 100 or 100.99)"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    if (e.target.value.split('.').length > 2) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                />
                <ErrorMessage name="price" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="type">Type<span className="text-danger">*</span></label>
                <Field 
                  name="type" 
                  className={`form-control ${touched.type && errors.type ? 'is-invalid' : ''}`}
                  placeholder="Enter type" 
                />
                <ErrorMessage name="type" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="medical_req">Medical Requirement<span className="text-danger">*</span></label>
                <Field 
                  name="medical_req" 
                  className={`form-control ${touched.medical_req && errors.medical_req ? 'is-invalid' : ''}`}
                  placeholder="Enter medical requirement" 
                />
                <ErrorMessage name="medical_req" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="accommodation">Accommodation<span className="text-danger">*</span></label>
                <Field 
                  name="accommodation" 
                  className={`form-control ${touched.accommodation && errors.accommodation ? 'is-invalid' : ''}`}
                  placeholder="Enter accommodation" 
                />
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

export default AddExpeditions;
