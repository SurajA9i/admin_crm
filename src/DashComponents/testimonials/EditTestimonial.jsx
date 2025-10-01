import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Breadcrumb, Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { UpdateTestimonial, getTestimonialById } from '../../../services/TestiminialsApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';

const MyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState({});
  const [showSelectedImg, setShowSelectedImage] = useState(null);
  const [showSelectedVideo, setShowSelectedVideo] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await getTestimonialById(id);
          setData(res?.data?.data || {});
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [id]);

  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('location', values.location);
    formData.append('position', values.position);
    formData.append('status', values.status);
    formData.append('type', values.type);

    if (values.type === 'image' && values.image) {
      formData.append('media', values.image);
      // formData.append('image', values.image);
    } else if (values.type === 'video' && values.video) {
      formData.append('media', values.video);
      // formData.append('video', values.video);
    }

    try {
      const res = await UpdateTestimonial(id, formData);
      if (res?.status) {
        navigate('/testimonials');
        showSuccessToast('Successfully Updated');
      }
    } catch (error) {
      console.error('Update error:', error);
      showFailureToast('Failed');
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
        <Breadcrumb.Item active>Edit Testimonial</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Edit Testimonial</h5>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Formik
            initialValues={{
              name: data?.name || '',
              description: data?.description || '',
              position: data?.position || '',
              location: data?.location || '',
              status: data?.status || '',
              type: data?.type || '',
              image: null,
              video: null
            }}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="row">
                {/* Name Field */}
                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Name</FormLabel>
                  <Field name="name" type="text" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </FormGroup>

                {/* Position Field */}
                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Position</FormLabel>
                  <Field name="position" type="text" className="form-control" />
                  <ErrorMessage name="position" component="div" className="text-danger" />
                </FormGroup>

                {/* Location Field */}
                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Location</FormLabel>
                  <Field name="location" type="text" className="form-control" />
                  <ErrorMessage name="location" component="div" className="text-danger" />
                </FormGroup>

                {/* Media Type Selection */}
                <FormGroup className="col-lg-6 mb-3">
                  <FormLabel>Media Type</FormLabel>
                  <Field
                    name="type"
                    as="select"
                    className="form-control"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setData((prevData) => ({
                        ...prevData,
                        type: selectedValue
                      }));
                      setFieldValue('type', selectedValue);
                    }}
                  >
                    <option value="">Select Media Type</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Field>
                </FormGroup>

                {/* Image Upload */}
                {data?.type === 'image' && (
                  <FormGroup className="col-lg-6 mb-3">
                    <FormLabel>Image</FormLabel>
                    <input
                      name="image"
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue('image', file);
                          setShowSelectedImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <ErrorMessage name="image" component="div" className="text-danger" />
                  </FormGroup>
                )}

                {/* Image Preview */}

                {data?.type === 'image' && (
                  <FormGroup className="col-lg-6 mb-3">
                    <img
                      className="mt-3"
                      src={showSelectedImg || (data?.media ? `${ImgUrl}${data.media}` : '')}
                      alt="Selected"
                      height={200}
                      width={300}
                    />
                  </FormGroup>
                )}

                {/* Video Upload */}
                {data?.type === 'video' && (
                  <FormGroup className="col-lg-6 mb-3">
                    <FormLabel>Video</FormLabel>
                    <input
                      name="video"
                      type="file"
                      className="form-control"
                      accept="video/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue('video', file);
                          setShowSelectedVideo(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <ErrorMessage name="video" component="div" className="text-danger" />
                  </FormGroup>
                )}

                {/* Video Preview */}
                {data?.type === 'video' && (
                  <FormGroup className="col-lg-6 mb-3">
                    <video
                      className="mt-3"
                      src={showSelectedVideo || (data?.media ? `${ImgUrl}${data.media}` : '')}
                      controls
                      height={250}
                      width={250}
                    />
                  </FormGroup>
                )}

                {/* Description Field */}
                <FormGroup className="col-lg-12 mb-3 mt-3">
                  <FormLabel>Description</FormLabel>
                  <Field name="description" as="textarea" className="form-control" />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </FormGroup>

                {/* Submit Button */}
                <div className="col-lg-12">
                  <Button type="submit" variant="primary" className="mt-3 w-auto">
                    Submit
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default MyForm;
