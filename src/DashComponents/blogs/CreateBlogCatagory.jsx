import React from 'react';
import { Form, Button, Breadcrumb } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { BlogCategoryCreate } from '../../../services/BlogPost.jsx';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { Link, useNavigate } from 'react-router-dom';

const BlogCategoryForm = () => {
  const Navigate = useNavigate();
  
  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    slug: Yup.string(),
    status: Yup.string().required('Status is required')
  });

  // Initial values
  const initialValues = {
    name: '',
    slug: 'slug',
    status: 'true'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await BlogCategoryCreate(values);
      if (res?.status) {
        showSuccessToast('Blog Category created');
        Navigate('/blogs/blog-catagory');
      }
    } catch (error) {
      console.log(error, 'errors');
    }

    setSubmitting(false); // Stop submission spinner
  };

  return (
    <>
      <div className="container mt-4 ">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/blogs/create-blog">Bolg Category</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Add Blog Category</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card ">
          <div className="card-body ">
            <h4 className="head_main">Add Blog Category</h4>
            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                <FormikForm className="row">
                  {/* Name Field */}
                  <Form.Group className="col-lg-4 col-sm-6 mb-3" controlId="formName">
                    <Form.Label>
                      Name: <span className="text-danger">*</span>
                    </Form.Label>
                    <Field 
                      name="name" 
                      type="text" 
                      placeholder="Enter category name" 
                      className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                  </Form.Group>

                  {/* Slug Field */}
                  <Form.Group className="col-lg-4 col-sm-6 mb-3" controlId="formSlug">
                    <Form.Label>
                      Slug: <span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      name="slug"
                      type="text"
                      placeholder="Slug will be auto-generated"
                      className="form-control"
                      value={values.name.toLowerCase().replace(/\s+/g, '-')} // Auto-generate slug
                      disabled
                    />
                  </Form.Group>

                  {/* Status Field */}
                  <Form.Group className="col-lg-4 col-sm-6 mb-3" controlId="formStatus">
                    <Form.Label>
                      Status: <span className="text-danger">*</span>
                    </Form.Label>
                    <Field 
                      as="select" 
                      name="status" 
                      className={`form-select ${errors.status && touched.status ? 'is-invalid' : ''}`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="invalid-feedback" />
                  </Form.Group>

                  {/* Submit Button */}
                  <div className="text-start">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isSubmitting || Object.keys(errors).length > 0}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
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

export default BlogCategoryForm;
