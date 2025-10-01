import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Breadcrumb } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RichTextEditor from 'react-rte';
import { createBlog } from '../../../services/BlogPost.jsx';
import { getAllCategory1 } from '../../../services/BlogPost.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import ReactQuill from 'react-quill';

function AddBlog() {
  const Navigate = useNavigate();

  const [data, setData] = useState([]);

  const categoryData = async () => {
    const res = await getAllCategory1();
    setData(res?.data?.data?.result || []);
  };

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    category_id: Yup.string()
      .required('Category is required'),
    blogBanner: Yup.mixed()
      .required('Blog banner is required')
      .test('fileSize', 'File size is too large', (value) => {
        if (!value) return true;
        return value.size <= 5000000; // 5MB
      })
      .test('fileType', 'Unsupported file type', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
      }),
    // image: Yup.mixed()
    //   .required('Blog image is required')
    //   .test('fileSize', 'File size is too large', (value) => {
    //     if (!value) return true;
    //     return value.size <= 5000000; // 5MB
    //   })
    //   .test('fileType', 'Unsupported file type', (value) => {
    //     if (!value) return true;
    //     return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    //   }),
    // blogVideo: Yup.mixed()
    //   .required('Blog video is required')
    //   .test('fileSize', 'File size is too large', (value) => {
    //     if (!value) return true;
    //     return value.size <= 100000000; // 100MB
    //   })
    //   .test('fileType', 'Unsupported file type', (value) => {
    //     if (!value) return true;
    //     return ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(value.type);
    //   }),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    status: Yup.string()
      .required('Status is required')
  });

  const initialValues = {
    title: '',
    slug: 'slug',
    category_id: '',
    banner: null,
    image: null,
    video: null,
    description: RichTextEditor.createEmptyValue().toString('html'),
    status: 'true'
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values?.title);
    formData.append('category_id', values?.category_id);
    formData.append('banner', values?.blogBanner);
    formData.append('image', values?.image);
    formData.append('video', values?.blogVideo);
    formData.append('description', values?.description);
    formData.append('status', values?.status);

    try {
      const res = await createBlog(formData);
      if (res?.status) {
        Navigate('/blogs/all-blogs');
        showSuccessToast('Blog Created Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    categoryData();
  }, []);
  return (
    <>
      <Container className="mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/blogs/all-blogs">Blogs</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Create Blog</Breadcrumb.Item>
        </Breadcrumb>
        <h3>Create Blog</h3>
        <Formik 
          initialValues={initialValues} 
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <FormikForm>
              {/* Title */}
              <Form.Group controlId="pageTitle" className="mb-4">
                <Form.Label>Title: <span className="text-danger">*</span></Form.Label>
                <Field 
                  name="title" 
                  type="text" 
                  placeholder="Enter Title" 
                  className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="title" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Slug */}
              <Form.Group controlId="pageSlug" className="mb-4">
                <Form.Label>Slug: <span className="text-danger">*</span></Form.Label>
                <Field 
                  name="slug" 
                  disabled 
                  placeholder="Enter Slug" 
                  className="form-control"
                  value={values.title.toLowerCase().replace(/\s+/g, '-')}
                />
              </Form.Group>

              {/* Category */}
              <Form.Group controlId="pageCategory" className="mb-4">
                <Form.Label>Category: <span className="text-danger">*</span></Form.Label>
                <Field 
                  name="category_id" 
                  as="select" 
                  className={`form-select ${errors.category_id && touched.category_id ? 'is-invalid' : ''}`}
                >
                  <option value="">Choose Category</option>
                  {data?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category_id" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Blog Banner */}
              <Form.Group controlId="blogBanner" className="mb-4">
                <Form.Label>Blog Banner: <span className="text-danger">*</span></Form.Label>
                <input 
                  type="file" 
                  onChange={(e) => setFieldValue('blogBanner', e.target.files[0])} 
                  className={`form-control ${errors.blogBanner && touched.blogBanner ? 'is-invalid' : ''}`}
                  accept="image/*"
                />
                <ErrorMessage name="blogBanner" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Blog Images */}
              <Form.Group controlId="image" className="mb-4">
                <Form.Label>Blog Images: <span className="text-danger">*</span></Form.Label>
                <input 
                  type="file" 
                  onChange={(e) => setFieldValue('image', e.target.files[0])} 
                  className={`form-control ${errors.image && touched.image ? 'is-invalid' : ''}`}
                  accept="image/*"
                />
                <ErrorMessage name="image" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Blog Video */}
              <Form.Group controlId="blogVideo" className="mb-4">
                <Form.Label>Blog Video: <span className="text-danger">*</span></Form.Label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFieldValue('blogVideo', e.target.files[0])}
                  className={`form-control ${errors.blogVideo && touched.blogVideo ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="blogVideo" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Description */}
              <Form.Group controlId="formDescription" className="mb-4">
                <Form.Label>
                  Description: <span className="text-danger">*</span>
                </Form.Label>
                <ReactQuill
                  value={values.description}
                  onChange={(value) => setFieldValue('description', value)}
                  className={`${errors.description && touched.description ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="description" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Status */}
              <Form.Group controlId="formStatus" className="mb-4">
                <Form.Label>
                  Status: <span className="text-danger">*</span>
                </Form.Label>
                <Field 
                  name="status" 
                  as="select" 
                  className={`form-select ${errors.status && touched.status ? 'is-invalid' : ''}`}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Field>
                <ErrorMessage name="status" component="div" className="invalid-feedback" />
              </Form.Group>

              {/* Submit Button */}
              <div className="text-end">
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
      </Container>
    </>
  );
}

export default AddBlog;
