// CreateEntryModal.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { Button, Modal, Form, Breadcrumb, Row, Col } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { UpdatePages, getPageById } from '../../../services/PagesApi';

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [editorValue, setEditorValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fetchPageById = async () => {
    const res = await getPageById(id);
    setData(res?.data?.data);
    setEditorValue(res?.data?.data?.description || ''); // Sync the initial description
    setImageUrl(res?.data?.data?.media || '');
    console.log("imageUrl: ",imageUrl);
  };

  const initialvalues = {
    title: data?.title || '',
    slug: data?.slug || 'slug',
    type: data?.type || '',
    image: data?.media || '',
    description: data?.description || '' // Default to existing description
  };

  const addForm = async (values) => {
    try {
      console.log(values,"submit called");
      const formData = {}
      formData.title = values.title;
      formData.description = values.description;
      formData.slug = values.slug;
      formData.type = values.type;
      console.log(formData);  
  
      // if (values.image) {
      //   formData.append('media', values.image);
      // } 

      console.log(formData);  
      console.log("submit called");
      const res = await UpdatePages(id, formData);
      if (res?.status) {
        showSuccessToast('Page Edited Successfully');
        navigate('/pages');
        // handleEditCloseModal();
        // getData();
      }
    } catch (error) {
      console.log(error);
      showFailureToast(error);
    }
  };

  useEffect(() => {
    fetchPageById();
  }, []);
  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    console.log("file: ",file.name);
    if (file) {
      const fileType = file.type.split('/')[0];
      console.log("file type: ",fileType);
      setFieldValue(fileType, file);
      setImageUrl(file.name);

      if (fileType == 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/pages">All Pages</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit Page</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5>Edit Page</h5>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Formik initialValues={initialvalues} onSubmit={addForm} enableReinitialize>
              {({ setFieldValue, isSubmitting }) => (
                <FormikForm>
                  <Form.Group controlId="title" className="mb-4 mt-3">
                    <Form.Label>Title</Form.Label>
                    <Field
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Enter Title"
                      onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue('title', value); // Update the title field
                        setFieldValue('slug', value.toLowerCase().replace(/\s+/g, '-')); // Generate slug dynamically
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="slug" className="mb-4 mt-3">
                    <Form.Label>Slug</Form.Label>
                    <Field type="text" name="slug" className="form-control" placeholder="Enter slug" disabled />
                  </Form.Group>
                 

                  <Form.Group controlId="type" className="mb-4 mt-3">
                    <Form.Label>Type</Form.Label>
                    <Field type="text" name="type" className="form-control" placeholder="Enter form Type" />
                  </Form.Group>

                  <Form.Group controlId="description" className="mb-4 mt-3">
                    <Form.Label>Descriptions</Form.Label>
                    <ReactQuill
                      value={editorValue}
                      onChange={(value) => {
                        setEditorValue(value);
                        setFieldValue('description', value); 
                      }}
                      placeholder="Enter description"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'color': [] }], // Add color picker
                          ['clean']
                        ]
                      }}
                    />
                  </Form.Group>
                  <div className="text-center">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    {/* <Button variant="primary" type="submit">
                      Save
                    </Button> */}
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

export default EditPage;
