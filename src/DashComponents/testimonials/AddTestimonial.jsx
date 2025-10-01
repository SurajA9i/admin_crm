import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Breadcrumb, Button, FormGroup, FormLabel } from 'react-bootstrap';
import { TestimonialCreate } from '../../../services/TestiminialsApi';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import * as Yup from 'yup';

const AddTestimonial = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    position: Yup.string()
      .required('Position is required')
      .min(2, 'Position must be at least 2 characters'),
    location: Yup.string()
      .required('Location is required')
      .min(2, 'Location must be at least 2 characters'),
    status: Yup.string()
      .required('Status is required'),
    type: Yup.string()
      .required('Media type is required'),
  
    image: Yup.mixed().nullable().when('type', (type, schema) => {
      return type === 'image'
        ? schema.required('Please upload an image')
        : schema.notRequired();
    }),
  
    video: Yup.mixed().nullable().when('type', (type, schema) => {
      return type === 'video'
        ? schema.required('Please upload a video')
        : schema.notRequired();
    }),
  });

  const initialValues = {
    name: '',
    description: '',
    position: '',
    image: null,
    video: null,
    status: '',
    location: '',
    type: ''
  };
  const [mediaType, setMediaType] = useState('Image or video');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const onSubmit = async (values) => {
    console.log(values,"submit called");
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('position', values.position);
    formData.append('status', values.status);
    formData.append('type', mediaType);

    if (mediaType === 'image') {
      formData.append('media', values.image);
    } else if (mediaType === 'video') {
      formData.append('media', values.video);
    }

    try {
      const res = await TestimonialCreate(formData);
      if (res?.status) {
        navigate('/testimonials');
        showSuccessToast('Successfully Added');
      }
    } catch (error) {
      console.log(error);
      deleteConfirmation('Failed');
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const fileType = file.type.split('/')[0];
      setMediaType(fileType);
      setFieldValue(fileType, file);

      if (fileType == 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else if (fileType == 'video') {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/testimonials">Testimonial</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Testimonial</Breadcrumb.Item>
      </Breadcrumb>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={onSubmit}
      >
        {({ setFieldValue, touched, errors }) => (
          <div className="card">
            <div className="card-body">
              <Form className="row">
                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Name<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="name" 
                    type="text" 
                    className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter name" 
                  />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Position<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="position" 
                    type="text" 
                    className={`form-control ${touched.position && errors.position ? 'is-invalid' : ''}`}
                    placeholder="Enter position" 
                  />
                  <ErrorMessage name="position" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Media Type<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="type"
                    as="select"
                    className={`form-control ${touched.type && errors.type ? 'is-invalid' : ''}`}
                    value={mediaType}
                    onChange={(e) => {
                      setMediaType(e.target.value);
                      setFieldValue('type', e.target.value);
                      setFieldValue('image', null);
                      setFieldValue('video', null);
                    }}
                  >
                    <option value="">Select Media Type</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Upload {mediaType ? mediaType : 'Image or Video'}<span className="text-danger">*</span></FormLabel>
                  <input
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    className={`form-control ${
                      touched[mediaType] && errors[mediaType] ? 'is-invalid' : ''
                    }`}
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <ErrorMessage name={mediaType} component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Location<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="location" 
                    type="text" 
                    className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                    placeholder="Enter location" 
                  />
                  <ErrorMessage name="location" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Status<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="status" 
                    as="select" 
                    className={`form-control ${touched.status && errors.status ? 'is-invalid' : ''}`}
                  >
                    <option value="" label="Select status" />
                    <option value="true" label="Active" />
                    <option value="false" label="Inactive" />
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </FormGroup>

                <FormGroup className="col-lg-12 mb-3">
                  <FormLabel>Description<span className="text-danger">*</span></FormLabel>
                  <Field 
                    name="description" 
                    as="textarea" 
                    className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                    placeholder="Enter description" 
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </FormGroup>

                <div className="col-lg-12">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="mt-1 w-auto"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
};

export default AddTestimonial;
