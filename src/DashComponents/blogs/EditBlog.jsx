import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { getAllCategory1, UpdateBlog, getBlogById } from '../../../services/BlogPost.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

function AddBlog() {
  const [data, setData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [editorValue, setEditorValue] = useState('');
  const navigate = useNavigate();

  const params = useParams();
  const id = params?.id;
  const categoryData = async () => {
    try {
      const res = await getAllCategory1();
      setData(res?.data?.data.result || []);
      console.log(res?.data?.data, 'res');
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlogData = async () => {
    try {
      const response = await getBlogById(id);
      const fetchedBlog = response?.data?.data;
      setBlogData(fetchedBlog);

      if (fetchedBlog) {
        setEditorValue(fetchedBlog.description);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  };


  const initialValues = {
    title: blogData?.title || '',
    slug: blogData?.slug || 'slug',
    category_id: blogData?.category_id || '',
    blogBanner: null,
    image: null,
    blogVideo: null,
    description: blogData?.description || '',
    status: blogData?.status || 'true'
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('title', values?.title);
    formData.append('category_id', values?.category_id);
    if(values?.blogBanner)
    formData.append('banner', values?.blogBanner);
    if (values?.image) {
      formData.append('image', values?.image);
    }
    if(values?.blogVideo)
    formData.append('video', values?.blogVideo);
    formData.append('description', values?.description);
    formData.append('status', values?.status);

    try {
      if (id) {
        const updateResponse = await UpdateBlog(id, formData);
        if (updateResponse.status) {
          resetForm(formData);
          navigate('/blogs/all-blogs');
          showSuccessToast('Editing Successfull')
        }
      }
    } catch (error) {
      console.error('Error creating/updating blog:', error);
    }
  };

  useEffect(() => {
    categoryData();
    if (id) {
      fetchBlogData();
    }
  }, [id]);

  return (
    <Container className="mt-2">
      <div className="card">
        <div className="card-header">
          <h5>Edit Blog</h5>
        </div>
        <div className="card-body">
          {/* validationSchema={validationSchema} */}
          <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
            {({ setFieldValue, values, isSubmitting }) => (
              <FormikForm className="row">
                {/* Title */}
                <Form.Group controlId="pageTitle" className="col-lg-6 mb-3">
                  <Form.Label>Title: *</Form.Label>
                  <Field name="title" type="text" placeholder="Enter Title" className="form-control" />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </Form.Group>

                {/* Slug */}
                <Form.Group controlId="pageSlug" className="col-lg-6 mb-3">
                  <Form.Label>Slug: *</Form.Label>
                  <Field name="slug" disabled placeholder="Enter Slug" className="form-control" />
                  {/* <ErrorMessage name="slug" component="div" className="text-danger" /> */}
                </Form.Group>

                {/* Category */}
                <Form.Group controlId="pageCategory" className="col-lg-6 mb-3">
                  <Form.Label>Category: *</Form.Label>
                  <Field name="category_id" as="select" className="form-select">
                    <option value="">Choose Category</option>
                    {data.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category_id" component="div" className="text-danger" />
                </Form.Group>

                {/* Blog Banner */}
                <Form.Group controlId="blogBanner" className="col-lg-6 mb-3">
              <Form.Label>Blog Banner: *</Form.Label>
              <div className="w-25">
                    <img src={values.blogBanner&&URL.createObjectURL(values?.blogBanner ) || `${import.meta.env.VITE_APP_IMG_URL}/${blogData?.banner}`} alt="blog" className="img-fluid" />
                  </div>
              <input type="file" onChange={(e) => setFieldValue('blogBanner', e.target.files[0])} className="form-control" />
              <ErrorMessage name="blogBanner" component="div" className="text-danger" />
            </Form.Group>

                {/* Blog Images */}
                <Form.Group controlId="image" className="col-lg-6 mb-3">
                  <Form.Label>Blog Image: *</Form.Label>
                  <div className="w-25">
                    <img src={values.image&&URL.createObjectURL(values?.image ) || `${import.meta.env.VITE_APP_IMG_URL}/${blogData?.image}`} alt="blog" className="img-fluid" />
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => setFieldValue('image', e.target.files[0])} className="form-control" />
                </Form.Group>

                {/* Blog Video */}
                <Form.Group controlId="blogVideo" className="col-lg-6 mb-3">
                <Form.Label>Blog Video: *</Form.Label>
<div>
                {(values.blogVideo||blogData?.video!=="undefined")&&<video   onLoadedData={() => console.log('Video ready')}
                
    onError={(e) => console.error('Video error:', e)} width="200" height="200"  controls
    autoPlay
    muted>
  <source src={values.blogVideo?URL.createObjectURL(values?.blogVideo) : `${import.meta.env.VITE_APP_IMG_URL}/${blogData?.video}`} type="video/mp4"/>
  <source src={values.blogVideo?URL.createObjectURL(values?.blogVideo) : `${import.meta.env.VITE_APP_IMG_URL}/${blogData?.video}`} type="video/ogg"/>
Your browser does not support the video tag.
</video>}</div>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFieldValue('blogVideo', e.target.files[0])}
                className="form-control"
              />
              <ErrorMessage name="blogVideo" component="div" className="text-danger" />
            </Form.Group>

                {/* Status */}
                <Form.Group controlId="formStatus" className="col-lg-6 mb-3">
                  <Form.Label>
                    Status<span className="text-danger">*</span>
                  </Form.Label>
                  <Field name="status" as="select" className="form-select">
                    {/* <option >{blogData?.status}</option> */}
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </Form.Group>

                {/* Description */}
                <Form.Group controlId="formDescription" className="col-lg-6 mb-3">
                  <Form.Label>
                    Description<span className="text-danger">*</span>
                  </Form.Label>
                  <ReactQuill
                    value={editorValue}
                    onChange={(value) => {
                      setEditorValue(value);
                      setFieldValue('description', value);
                    }}
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Form.Group>

                {/* Submit Button */}
                <div className="text-start">
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
}

export default AddBlog;
