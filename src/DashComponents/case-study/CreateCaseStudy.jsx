import React, { useState } from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Breadcrumb, Button, Container } from 'react-bootstrap';
import ReactQuill from 'react-quill'; // Using ReactQuill instead of RichTextEditor
import { createCaseStudy } from '../../../services/CaseStudtApi.jsx';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { Link, useNavigate } from 'react-router-dom';

const PageInformationForm = () => {
  const Navigate = useNavigate();
  const [editorValue, setEditorValue] = useState('');

  // Add validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    slug: Yup.string()
      .required('Slug is required')
      .min(3, 'Slug must be at least 3 characters')
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be in valid format (e.g., my-case-study)')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('slug', values.slug);
      formData.append('description', values.description);
      formData.append('banner', values.image);
      formData.append('featured', values.featured);
      formData.append('status', values.status);
      const res = await createCaseStudy(formData); // Post data to the API
      if (res?.status) {
        Navigate('/case-Study');
        showSuccessToast('Case Study Successfully');
      }
    } catch (error) {
      console.error('Error creating case study:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <Link to="/case-Study">Case Study</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Case Study</Breadcrumb.Item>
      </Breadcrumb>
      <Container className="mt-4">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Add Case Study</h5>
          </div>
          <div className="card-body">
            <Formik
              initialValues={{
                title: '',
                slug: '',
                description: '',
                image: null,
                featured: 'no',
                status: 'true'
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <FormikForm>
                  <div className="row">
                    {/* Title */}
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="title">
                          Title<span className="text-danger">*</span>
                        </label>
                        <Field type="text" name="title" className="form-control" placeholder="Enter title" />
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </div>
                    </div>

                    {/* Slug */}
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label htmlFor="slug">
                          Slug<span className="text-danger">*</span>
                        </label>
                        <Field type="text" name="slug" className="form-control" placeholder="Enter slug" />
                        <ErrorMessage name="slug" component="div" className="text-danger" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label htmlFor="description">
                          Description<span className="text-danger">*</span>
                        </label>
                        <div style={{ border: '1px solid #ced4da', borderRadius: '4px' }}>
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
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="col-lg-4 col-sm-6">
                      <div className="form-group">
                        <label htmlFor="image">
                          Banner Image<span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          name="image"
                          className="form-control"
                          onChange={(event) => {
                            setFieldValue('image', event.target.files[0]);
                          }}
                        />
                        <ErrorMessage name="image" component="div" className="text-danger" />
                      </div>
                    </div>

                    {/* Featured Case Study */}
                    <div className="col-lg-4 col-sm-6">
                      <div className="form-group">
                        <label htmlFor="featuredCaseStudy">
                          Featured Case Study<span className="text-danger">*</span>
                        </label>
                        <Field as="select" name="featured" className="form-control">
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </Field>
                        <ErrorMessage name="featured" component="div" className="text-danger" />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-lg-4 col-sm-6">
                      <div className="form-group">
                        <label htmlFor="status">
                          Status<span className="text-danger">*</span>
                        </label>
                        <Field as="select" name="status" className="form-control">
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </Field>
                        <ErrorMessage name="status" component="div" className="text-danger" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-lg-12">
                      <Button variant="primary" type="submit" className="w-auto" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PageInformationForm;
