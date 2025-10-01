// CreateEntryModal.js
import React, { useState } from 'react';
import { Button, Form, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PagesCreate } from '../../../services/PagesApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import ReactQuill from 'react-quill';
import { Link, useNavigate } from 'react-router-dom';

const AddPage = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    type: Yup.string()
      .required('Type is required')
      .min(2, 'Type must be at least 2 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters')
  });

  const initialvalues = {
    title: '',
    slug: 'slug',
    type: '',
    description: ''
  };
  const [editorValue, setEditorValue] = useState('');

  const addForm = async (values) => {
    try {
      console.log(values.type,"submit called");
      const formData = {}
      formData.title = values.title;
      formData.description = values.description;
      formData.slug = values.slug;
      formData.type = values.type;
      console.log(formData);  
  
      // if (values.image) {
      //   formData.append('media', values.image);
      // } 

      console.log(formData);  
      console.log("submit called");

      const res = await PagesCreate(formData);
      if (res?.status) {
        showSuccessToast('Page Added Successfully');
        navigate('/pages');
      }
    } catch (error) {
      console.log(error);
      showFailureToast(error);
    }
  };
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      setFieldValue(fileType, file);

      if (fileType == 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/pages">All Pages</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add Page</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5>Add Page</h5>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Formik
              initialValues={initialvalues}
              validationSchema={validationSchema}
              onSubmit={addForm}
            >
              {({ setFieldValue, isSubmitting, touched, errors }) => (
                <FormikForm>
                  {/* Name */}
                  <Form.Group controlId="title">
                    <Form.Label>Title<span className="text-danger">*</span></Form.Label>
                    <Field
                      type="text"
                      name="title"
                      className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                      placeholder="Enter Title"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue('title', value);
                        setFieldValue('slug', value.toLowerCase().replace(/\s+/g, '-'));
                      }}
                    />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>

                  {/* Slug */}
                  <Form.Group controlId="slug" className="mb-4 mt-3">
                    <Form.Label>Slug</Form.Label>
                    <Field type="text" name="slug" className="form-control" placeholder="Enter slug" disabled />
                  </Form.Group>
                  {/* <Form.Group className="mb-4 mt-3">
                    <Form.Label>Upload Image<span className="text-danger">*</span></Form.Label>
                    <input
                      type="file"
                      accept={'image/*'}
                      className={`form-control`}
                      onChange={(event) => handleFileChange(event, setFieldValue)}
                    />
                  </Form.Group> */}


                  {/* Form Type */}
                  <Form.Group controlId="type" className="mb-4 mt-3">
                    <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                    <Field
                      type="text"
                      name="type"
                      className={`form-control ${touched.type && errors.type ? 'is-invalid' : ''}`}
                      placeholder="Enter form Type"
                    />
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </Form.Group>

                  {/* Description */}
                  <Form.Group controlId="description" className="mb-4 mt-3">
                    <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                    <div className={`${touched.description && errors.description ? 'is-invalid' : ''}`}>
                      <ReactQuill
                        value={editorValue}
                        onChange={(value) => {
                          setEditorValue(value);
                          setFieldValue('description', value);
                        }}
                        placeholder="Enter description"
                      />
                    </div>
                    <ErrorMessage name="description" component="div" className="text-danger" />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>

                    {/* <Button variant="primary" type="submit">
                      Save
                    </Button> */}
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPage;
