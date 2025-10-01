import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Dropdown, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createChatbotMedia } from '../../../services/MediaApi';

import { createMedia } from '../../../services/MediaApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { FetchUsers } from '../../../services/UserApi';
import Select from 'react-select';

const AddVideo = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showUserId, setShowUserId] = useState(false);

  const validationSchema = Yup.object({
    media_type: Yup.string().required('Media type is required')
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
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
    const formData = new FormData();
    if (mediaType === 'image') {
      formData.append('image', selectedFile);
    } else if (mediaType === 'video') {
      formData.append('video', selectedFile);
    }
    formData.append('title', 'chatbot');
    formData.append('media_type', values.media_type);

    try {
      const res = await createChatbotMedia(formData);
      if (res?.status) {
        navigate('/chat-bot');
        showSuccessToast('Chatbot Media added Successfully.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="container mt-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/chat-bot">Chatbot</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Add Video</Breadcrumb.Item>
      </Breadcrumb>
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Add Video</h5>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          <Formik
            initialValues={{
              title: '',
              media_type: '',
              video: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <FormikForm className="row">
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
                <Form.Group controlId="media_type" className="col-lg-6 mb-4">
                  <Form.Label>Upload {mediaType ? mediaType : 'Image or Video'}</Form.Label>
                  <input type="file" accept="video/*" onChange={handleFileChange} className="form-control" />
                </Form.Group>

                {/* Submit Button */}
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
  );
};

export default AddVideo;
