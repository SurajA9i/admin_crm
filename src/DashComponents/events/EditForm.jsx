import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { Formik } from 'formik';
import { UpdateEvent, getEventById } from '../../../services/EventApi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { formattedDate, ImgUrl } from '../../../utils/Constant';

const EventForm = () => {
  const Navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [selectedImage, setSelectedImage] = useState(null);
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await getEventById(id);
    setData(res?.data?.data?.[0]);
  };

  const initialValues = {
    title: data?.title || '',
    type: data?.type || '', // Corrected type field
    location: data?.location || '',
    date: data?.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0], // Prefill today's date
    description: data?.description || '',
    region: data?.region || '',
    image: data?.image || null
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('type', values.type);
    formData.append('location', values.location);
    formData.append('date', values.date);
    formData.append('description', values.description);
    formData.append('region', values.region);
    formData.append('image', values.image);
    try {
      const res = await UpdateEvent(id, formData);
      if (res?.status) {
        showSuccessToast('Event Updated successfully!');
        Navigate('/events');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/events">Events</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Edit Event</Breadcrumb.Item>
      </Breadcrumb>
      <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)} enableReinitialize>
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <div className="card">
            <div className="card-header">
              <Row className="mb-0 align-items-center">
                <Col>
                  <h5> Edit Event </h5>
                </Col>
              </Row>
            </div>
            <div className="card-body">
              <Form className="row" onSubmit={handleSubmit}>
                <Form.Group className="col-lg-6 mb-3" controlId="title">
                  <Form.Label>Title*</Form.Label>
                  <Form.Control type="text" placeholder="Enter Title" name="title" value={values.title} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="type">
                  <Form.Label>Type*</Form.Label>
                  <Form.Control type="text" placeholder="Enter Type" name="type" value={values.type} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="location">
                  <Form.Label>Location*</Form.Label>
                  <Form.Control type="text" placeholder="Enter Location" name="location" value={values.location} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="date">
                  <Form.Label>Date*</Form.Label>
                  <Form.Control type="date" name="date" value={values.date} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="region">
                  <Form.Label>Region*</Form.Label>
                  {/* <Form.Control type="text" placeholder="Enter Region" name="region" value={values.region} onChange={handleChange} /> */}
                  <Form.Control as="select" name="region" value={values.region} onChange={handleChange}>
                    <option value="">Select Region</option> {/* Placeholder */}
                    <option value="India">India</option>
                    <option value="Africa">Africa</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="image">
                  <Form.Label>Image*</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={(e) => {
                      setFieldValue('image', e.target.files[0]);
                      const fileUrl = URL.createObjectURL(e.target.files[0]);

                      setSelectedImage(fileUrl);
                    }}
                  />

                  {data?.image && !selectedImage && (
                    <img className="mt-3" src={`${ImgUrl}${data?.image}`} alt="img" height={250} width={250} />
                  )}
                  {selectedImage && <img className="mt-3" src={selectedImage} alt="img" height={250} width={300} />}
                </Form.Group>

                <Form.Group className="col-lg-12 mb-3" controlId="description">
                  <Form.Label>Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter Description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="col-12">
                  <Button variant="primary" type="submit" className="mt-1 w-auto">
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

export default EventForm;
