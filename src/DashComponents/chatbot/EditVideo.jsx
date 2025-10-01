import React, { useEffect, useState } from 'react';
import { Form, Button, Breadcrumb, Row, Col } from 'react-bootstrap';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSingleChatbotMedia, updateChatbotMedia } from '../../../services/MediaApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';

const EditVideo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const id = params?.id;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [details, setDetails] = useState([]); // Store all dynamic questions

  const validationSchema = Yup.object({
    media_type: Yup.string().required('Media type is required')
  });

  const getSingleData = async () => {
    try {
      const response = await getSingleChatbotMedia(id);
      if (response?.status) {
        setMediaData(response?.data?.data);
        setPreviewUrl(`${ImgUrl}${response?.data?.data?.image || response?.data?.data?.video}`);
        setDetails(JSON.parse(response?.data?.data?.details) || []); // Load initial details
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else if (fileType === 'video') {
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleChange = (index, event) => {
    const updatedDetails = [...details];
    updatedDetails[index] = event.target.value; // Update the question at index
    setDetails(updatedDetails);
  };

  const handleAddQuestion = () => {
    setDetails((prevDetails) => [...prevDetails, '']); // Add an empty string to create new input
  };

  const handleDeleteQuestion = (index) => {
    const updatedDetails = details.filter((_, i) => i !== index); // Remove question at index
    setDetails(updatedDetails);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    if (selectedFile) {
      if (values.media_type === 'image') {
        formData.append('image', selectedFile);
      } else if (values.media_type === 'video') {
        formData.append('video', selectedFile);
      }
    }
    formData.append('title', values.title || 'chatbot');
    formData.append('media_type', values.media_type);
    formData.append('details', JSON.stringify(details));
    try {
      const response = await updateChatbotMedia(id, formData);
      if (response?.status) {
        showSuccessToast('Chatbot Media Updated Successfully.');
        navigate('/chat-bot');
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  useEffect(() => {
    getSingleData();
  }, []);

  return (
    <div className="container mt-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/chat-bot">Chatbot</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Chatbot</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Edit Chatbot</h5>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Formik
            enableReinitialize
            initialValues={{
              title: mediaData?.title || '',
              media_type: mediaData?.media_type || ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, isSubmitting }) => (
              <FormikForm className="row">
                <Form.Group className="col-lg-6 mb-4">
                  <Form.Label>Questions</Form.Label>

                  {/* If no questions exist, show a single input field with an "Add Question" button */}
                  {details.length === 0 ? (
                    <div className="d-flex align-items-center mb-2">
                      <Form.Control
                        type="text"
                        value=""
                        onChange={(e) => handleChange(0, e)}
                        placeholder="Enter question 1"
                        style={{ width: 'auto', marginRight: '10px' }}
                      />
                      <Button variant="primary" onClick={handleAddQuestion} style={{ marginRight: '10px' }}>
                        +
                      </Button>
                    </div>
                  ) : (
                    details.map((question, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="text"
                          value={question}
                          onChange={(e) => handleChange(index, e)}
                          placeholder={`Enter question ${index + 1}`}
                          style={{ width: 'auto', marginRight: '5px' }}
                        />
                        {/* Only show the "Add Question" button once */}
                        {index === details.length - 1 && (
                          <Button variant="primary" onClick={handleAddQuestion} style={{ marginRight: '5px' }}>
                            +
                          </Button>
                        )}

                        {/* Only show the "Delete" button if there is more than one question */}
                        {details.length > 1 && (
                          <Button variant="danger" onClick={() => handleDeleteQuestion(index)}>
                            X
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </Form.Group>

                <Form.Group className="col-lg-6 mb-4">
                  {/* <Form.Label>Questions</Form.Label>
                  <ul>
                    {mediaData?.details?.map((question, index) => (
                      <li className='text-dark' key={index}>{question}</li>
                    ))}
                  </ul> */}
                </Form.Group>

                <Form.Group className="col-lg-6 mb-4">
                  <Form.Label>Media Type</Form.Label>
                  <Form.Select
                    name="media_type"
                    value={mediaData?.media_type || ''}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setFieldValue('media_type', selectedValue);
                      setMediaData((prevData) => ({
                        ...prevData,
                        media_type: selectedValue
                      }));
                    }}
                  >
                    <option value="">Select Media Type</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Form.Select>
                  <ErrorMessage name="media_type" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-4">
                  <Form.Label>Upload {mediaData?.media_type === 'image' ? 'Image' : 'Video'}</Form.Label>
                  <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="form-control" />
                </Form.Group>

                <div className="col-lg-6 mb-4">
                  {selectedFile ? (
                    previewUrl && selectedFile.type.startsWith('image') ? (
                      <img src={previewUrl} alt="Uploaded Preview" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                    ) : previewUrl && selectedFile.type.startsWith('video') ? (
                      <video width="400" height="400" controls>
                        <source src={previewUrl} type={selectedFile.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : null
                  ) : (
                    <>
                      {mediaData?.media_type === 'image' && (
                        <img
                          src={`${ImgUrl}${mediaData?.image}`}
                          alt="Prefilled Image"
                          style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                        />
                      )}
                      {mediaData?.media_type === 'video' && (
                        <video width="400" height="400" controls>
                          <source src={`${ImgUrl}${mediaData?.video}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </>
                  )}
                </div>

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

export default EditVideo;
