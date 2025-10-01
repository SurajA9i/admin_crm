import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Form, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { fetchTripsAndSafariById, updateTripsSafariData } from '../../../services/TripsAndSafari';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { FetchResort } from '../../../services/ResortApi';
import Select from 'react-select';

const EditTripsSafari = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [editorValue, setEditorValue] = useState('');
  const [safariById, setSafariById] = useState({});
  const [showSelectedImg, setShowSelectedImage] = useState(null);
  const [resortList, setResortList] = useState([]);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const getAllResort = async () => {
    const response = await FetchResort(state);
    setResortList(response?.data?.data?.result || []);
    // setTotalPages(response?.data?.data?.totalPages || 1);
  };
  const getAllTripsAndSafariById = async () => {
    try {
      const response = await fetchTripsAndSafariById(id);
      if (response?.status) {
        const safariData = response?.data?.data[0];
        setSafariById(safariData);
        setEditorValue(safariData?.description || '');
      }
    } catch (error) {
      console.log('Error:::', error);
    }
  };

  const initialValues = {
    title: safariById?.title || '',
    date: safariById?.date ? new Date(safariById?.date).toISOString().split('T')[0] : '',
    image: safariById?.image || null,
    location: safariById?.location || '',
    price: safariById?.price || '',
    currency: safariById?.currency || '',
    related_destination: safariById?.related_destination || '',
    description: safariById?.description || '',
    accommodation: safariById?.accommodation || '',
    medical_req: safariById?.medical_req || '',
    type: safariById?.type || '',
    // accommodation_list: safariById?.accommodation_list || []
    accommodation_list: safariById?.accommodation_list
      ? safariById.accommodation_list.map((item) => item._id) // Extract IDs only
      : []
  };
  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('date', values.date);
    formData.append('location', values.location);
    formData.append('type', values.type);
    formData.append('image', values.image);
    formData.append('medical_req', values.medical_req);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('accommodation', values.accommodation);
    formData.append('description', editorValue);
    formData.append('accommodation_list', JSON.stringify(values.accommodation_list));

    try {
      const response = await updateTripsSafariData(id, formData);
      if (response?.status) {
        showSuccessToast('Successfully Updated Trips & Safaris');
        navigate('/trips-safari');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Add');
    }
  };

  useEffect(() => {
    getAllResort();
    getAllTripsAndSafariById();
  }, []);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/trips-safari">Trips And Safari</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Trips And Safari</Breadcrumb.Item>
      </Breadcrumb>

      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ setFieldValue }) => (
          <FormikForm>
            <h3>Edit Trips And Safari</h3>
            <Row className="mb-3">
              <Col>
                <label htmlFor="title">Title</label>
                <Field name="title" className="form-control" placeholder="Enter title" />
                <ErrorMessage name="title" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="description">Description</label>
                <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Write the description here" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    setFieldValue('image', e.target.files[0]);
                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                    setShowSelectedImage(fileUrl);
                  }}
                />
                <ErrorMessage name="image" component="div" className="text-danger" />
                {safariById?.image && !showSelectedImg && (
                  <img className="mt-3" src={`${ImgUrl}${safariById?.image}`} alt="img" height={250} width={250} />
                )}
                {showSelectedImg && <img className="mt-3" src={showSelectedImg} alt="img" height={250} width={300} />}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="date">Date</label>
                <Field name="date" type="date" className="form-control" />
                <ErrorMessage name="date" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="location">Location</label>
                <Field name="location" className="form-control" placeholder="Enter location" />
                <ErrorMessage name="location" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="price">Price</label>
                <Field
                  name="price"
                  className="form-control"
                  placeholder="Enter price"
                  type="text"
                  pattern="^\d+(\.\d{1,2})?$"
                  title="Please enter a valid price (e.g. 100 or 100.99)"
                  onInput={(e) => {
                    // Remove any character that's not a digit or a decimal point
                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');

                    // Prevent multiple decimal points
                    if (e.target.value.split('.').length > 2) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                />
                {/* <Field name="price" type="number" className="form-control" placeholder="Enter price" /> */}
                <ErrorMessage name="price" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="currency">
                  <Form.Label>Currency</Form.Label>
                  <Field as={Form.Select} name="currency">
                    <option value="">Select Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </Field>
                  <ErrorMessage name="currency" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="type">Type</label>
                <Field name="type" className="form-control" placeholder="Enter type" />
                <ErrorMessage name="type" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="medical_req">Medical Requirement</label>
                <Field name="medical_req" className="form-control" placeholder="Enter medical requirement" />
                <ErrorMessage name="medical_req" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="accommodation">Accommodation</label>
                <Field name="accommodation" className="form-control" placeholder="Enter accommodation" />
                <ErrorMessage name="accommodation" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group className="col-lg-6 mb-4" controlId="accommodation_list">
                  <Form.Label>Select Resorts For Accommodation</Form.Label>
                  <Field name="accommodation_list">
                    {({ field, form }) => {
                      // Ensure accommodation_list is an array of IDs
                      const selectedIds = form.values.accommodation_list || [];

                      // Get selected options based on initial API data
                      const selectedOptions = selectedIds
                        .map((id) => {
                          const selectedResort = resortList.find((resort) => resort._id === id);
                          return selectedResort ? { value: selectedResort._id, label: selectedResort.title } : null;
                        })
                        .filter(Boolean);

                      const handleChange = (selectedOptions) => {
                        // Store only the IDs in accommodation_list
                        form.setFieldValue(
                          'accommodation_list',
                          selectedOptions.map((option) => option.value) // Extract only IDs
                        );
                      };
                      return (
                        <Select
                          isMulti
                          options={resortList?.map((resort) => ({
                            value: resort._id,
                            label: resort.title
                          }))}
                          value={selectedOptions} // Pre-fills values from API
                          onChange={handleChange}
                        />
                      );
                    }}
                  </Field>

                  <ErrorMessage name="accommodation_list" component="div" className="text-danger" />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

export default EditTripsSafari;
