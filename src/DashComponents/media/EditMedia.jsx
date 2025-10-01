import React, { useEffect, useState } from 'react';
import { Form, Button, Dropdown, Breadcrumb } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UpdateMedia, getMediaById } from '../../../services/MediaApi';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';

const EditMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState('');
  const [data, setData] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch Media Data by ID
  const getData = async (id) => {
    try {
      const res = await getMediaById(id);
      if (res?.data?.data) {
        setData(res.data.data);
        setMediaType(res.data.data.media_type);
        if (res.data.data.media_type === 'image') {
          setPreviewUrl(res.data.data.image);
        } else if (res.data.data.media_type === 'video') {
          setPreviewUrl(res.data.data.video);
        }
      }
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  // Handle File Change
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

  // Handle Submit
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('type', values.type);
    formData.append('media_type', mediaType);
    formData.append('photographer', values.photographer);

    if (mediaType === 'image' && selectedFile) {
      formData.append('image', selectedFile);
    } else if (mediaType === 'video' && selectedFile) {
      formData.append('video', selectedFile);
    }

    try {
      const res = await UpdateMedia(id, formData);
      if (res?.status) {
        showSuccessToast('Media updated successfully!');
        navigate('/media');
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };

  useEffect(() => {
    if (id) getData(id);
  }, [id]);

  const initialValues = {
    title: data?.title || '',
    type: data?.type || 'global',
    image: data?.image || null,
    photographer: data?.photographer
  };

  return (
    <div className="container mt-5">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/media">Media</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Media</Breadcrumb.Item>
      </Breadcrumb>
      <h3>Edit Media</h3>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
        {({ setFieldValue, isSubmitting }) => (
          <FormikForm>
            {/* Title Field */}
            <Form.Group controlId="title" className="mb-4">
              <Form.Label>Title</Form.Label>
              <Field name="title" type="text" placeholder="Enter your title" className="form-control" />
            </Form.Group>
            <Form.Group controlId="photographer" className="mb-4">
              <Form.Label>Photographer's Name</Form.Label>
              <Field name="photographer" type="text" placeholder="Enter your photographer's name" className="form-control" />
            </Form.Group>
            {/* Media Type Selection */}
            <Form.Group className="mb-4" controlId="media_type">
              <Form.Label>Media Type</Form.Label>
              <Dropdown className="w-25">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {mediaType ? mediaType : 'Select Media Type'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      setMediaType('image');
                      setFieldValue('media_type', 'image');
                    }}
                  >
                    Image
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      setMediaType('video');
                      setFieldValue('media_type', 'video');
                    }}
                  >
                    Video
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>

            {/* File Upload */}
            <Form.Group controlId="file_upload" className="mb-4">
              <Form.Label>Upload {mediaType ? mediaType : 'Media'}</Form.Label>
              <input
                type="file"
                accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileChange}
                className="form-control"
              />
            </Form.Group>

            {/* Preview */}
            {/* {previewUrl && (
              <div className="preview-container mb-3">
                <h4>Preview</h4>
                {mediaType === 'image' ? (
                  <img src={`${ImgUrl}/${previewUrl}`} alt="Preview" style={{ width: '50%', maxHeight: '300px', objectFit: 'contain' }} />
                ) : (
                  <video width="50%" height="auto" controls>
                    <source src={`${ImgUrl}/${previewUrl}`} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )} */}
            {selectedFile ? (
              // Show preview for newly uploaded media
              previewUrl && selectedFile.type.startsWith('image') ? (
                <img src={previewUrl} alt="Uploaded Preview" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
              ) : previewUrl && selectedFile.type.startsWith('video') ? (
                <video width="400" height="400" controls>
                  <source src={previewUrl} type={selectedFile.type} />
                  Your browser does not support the video tag.
                </video>
              ) : null
            ) : (
              // Show prefilled media if no new upload
              <>
                {mediaType === 'image' && (
                  <img
                    src={`${ImgUrl}${initialValues?.image}`}
                    alt="Prefilled Image"
                    style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                  />
                )}
                {mediaType === 'video' && (
                  <video width="400" height="400" controls>
                    <source src={`${ImgUrl}${initialValues?.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </>
            )}
            {/* User Type Selection */}
            <Form.Group controlId="type" className="mt-3 mb-4">
              <Form.Label>Target Audience</Form.Label>
              <Field name="type" as="select" className="form-select">
                <option value="global">All Users</option>
                <option value="user-specific">Single User</option>
              </Field>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default EditMedia;
