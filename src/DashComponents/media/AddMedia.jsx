import React, { useEffect, useState } from 'react';
import { Form, Button, Dropdown, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { createMedia, createChatbotMedia } from '../../../services/MediaApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { FetchUsers } from '../../../services/UserApi';
import Select from 'react-select';

const AddMedia = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUserId, setShowUserId] = useState(false);

  const [userList, setUserList] = useState([]);

  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 50,
    category_id: null
  });
  const getAllUsers = async () => {
    const res = await FetchUsers(state);

    const options = res?.data?.data?.result.map((user) => ({
      value: user._id,
      label: user.name
    }));
    setUserList(options);
    // setTotalPages(res?.data?.data?.totalPages || 1);
  };
  const handleFileChange = (e, setFieldValue) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setFieldValue('file', file); // Update Formik state

      const fileType = file.type.split('/')[0];
      setMediaType(fileType);

      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (fileType === 'video') {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (values) => {
    console.log(values);
    const formData = new FormData();
    if (mediaType === 'image') {
      formData.append('image', selectedFile);
    } else if (mediaType === 'video') {
      formData.append('video', selectedFile);
    }
    formData.append('title', values.title);
    formData.append('media_type', values.media_type);
    formData.append('type', values.type);
    formData.append('photographer', values.photographer);

    if (values.type === 'user-specific') {
      formData.append('userId', values.userId);
    }
    try {
      let res;
      if (values.type === 'admin') {
        res = await createChatbotMedia(formData);
      }
      else{
        res = await createMedia(formData);
      }
     
      if (res?.status) {
        navigate('/media');
        showSuccessToast('Media added');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Validation Schema
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    media_type: Yup.string().required('Media type is required'),
    type: Yup.string().required('User type is required'),
    file: Yup.mixed().required('Media is required')
  });

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="container mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/media">Media</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Add Media</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5>Add Media</h5>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Formik
              initialValues={{
                title: '',
                media_type: '',
                type: '',
                userId: [],
                photographer: '',
                file: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <FormikForm className="row">
                  <Form.Group controlId="type" className="col-lg-6 mb-4">
                    <Form.Label>
                      Users<span className="text-danger">*</span>
                    </Form.Label>
                    <Field
                      name="type"
                      as="select"
                      className="form-select"
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setFieldValue('type', selectedType); // Update the type value
                        setShowUserId(selectedType === 'user-specific'); // Show/Hide userId input
                      }}
                    >
                      <option value="">Select User</option>
                      <option value="global">All Users</option>
                      <option value="user-specific">Single User</option>
                      <option value="admin">Admin</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </Form.Group>
                  {showUserId && (
                    <Form.Group controlId="userId" className="col-lg-6 mb-4">
                      <label htmlFor="userId" className="form-label">
                        Select Users <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="userId"
                        isMulti
                        options={userList}
                        onChange={(selectedOptions) => {
                          // Extract the `value` (i.e., `_id`) from each selected option
                          const userIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          setFieldValue('userId', userIds); // Update the `userId` field in Formik
                        }}
                        classNamePrefix="react-select"
                        placeholder="Select Users"
                      />

                      <ErrorMessage name="userId" component="div" className="text-danger" />
                    </Form.Group>
                  )}

                  {/* Message Input */}
                  <Form.Group controlId="title" className="col-lg-6 mb-4">
                    <Form.Label>Title</Form.Label>
                    <Field name="title" type="text" placeholder="Enter your message" className="form-control" />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="media_type">
                    <Form.Label>Media Type</Form.Label>
                    <Form.Select
                      // className="w-25"
                      value={mediaType || ''}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        setMediaType(selectedValue); // Update the state
                        setFieldValue('media_type', selectedValue); // Update Formik field value
                      }}
                    >
                      <option value="">Select Media Type</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </Form.Select>
                    <ErrorMessage name="media_type" component="div" className="text-danger" />
                  </Form.Group>

                  {/* File Upload */}
                  {/* <Form.Group controlId="media_type" className="col-lg-6 mb-4">
                    <Form.Label>Upload {mediaType ? mediaType : 'Image or Video'}</Form.Label>
                    <input
                      type="file"
                      name="file"
                      accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                      className="form-control"
                    />
                    <ErrorMessage name="file" component="div" className="text-danger" />
                  </Form.Group> */}

                  <Form.Group controlId="file" className="col-lg-6 mb-4">
                    <Form.Label>Upload {mediaType ? mediaType : 'Image or Video'}</Form.Label>
                    <input
                      type="file"
                      name="file"
                      accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => handleFileChange(e, setFieldValue)} // Pass setFieldValue
                      className="form-control"
                    />
                    <ErrorMessage name="file" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group controlId="photographer" className="col-lg-6 mb-4">
                    <Form.Label>Photographer's Name</Form.Label>
                    <Field name="photographer" type="text" placeholder="Enter Photographer's Name" className="form-control" />
                    <ErrorMessage name="photographer" component="div" className="text-danger" />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
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

export default AddMedia;
