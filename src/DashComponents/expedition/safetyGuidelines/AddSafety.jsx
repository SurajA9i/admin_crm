import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage, FieldArray } from 'formik';
import { addSafetyGuidelines } from '../../../../services/ExpeditionsApi';
import { getAllChatbotMedia } from '../../../../services/MediaApi';
import { Form, Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { showSuccessToast, showFailureToast } from '../../toastsAlert/Alert.jsx';
import Select from 'react-select';

const AddSafety = () => {
  const navigate = useNavigate();
  const [editorValue, setEditorValue] = useState('');
  const [mediaData, setMediaData] = useState([]);

  const getAllMediaForAdmin = async () => {
    const response = await getAllChatbotMedia();
    if (response?.status) {
      const options = response?.data?.data?.map((value) => ({
        value: value._id,
        label: value.title
      }));
      setMediaData(options);
    }
  };
  const initialValues = {
    category_name: '',
    page_title: '',
    page_description: '',
    guidelines: {}, // Array of guideline objects
    media: '',
    medical_requirements: '',
    emergency_support: '',
    emergency_address: '',
    emergency_email: '',
    emergency_phone: [''] // Start with one phone field
  };

  const handleAddPhone = (values, setFieldValue) => {
    setFieldValue('emergency_phone', [...values.emergency_phone, '']);
  };

  const handleRemovePhone = (values, setFieldValue, index) => {
    const updatedPhones = [...values.emergency_phone];
    updatedPhones.splice(index, 1);
    setFieldValue('emergency_phone', updatedPhones);
  };

  const handleAddGuideline = (values, setFieldValue) => {
    const newKey = `Guide ${Object.keys(values.guidelines).length + 1}`;
    setFieldValue('guidelines', {
      ...values.guidelines,
      [newKey]: { title: newKey, points: [''] }
    });
  };

  const handleRemoveGuideline = (values, setFieldValue, key) => {
    const updatedGuidelines = { ...values.guidelines };
    delete updatedGuidelines[key];
    setFieldValue('guidelines', updatedGuidelines);
  };

  const handleAddPoint = (values, setFieldValue, key) => {
    setFieldValue('guidelines', {
      ...values.guidelines,
      [key]: { ...values.guidelines[key], points: [...values.guidelines[key].points, ''] }
    });
  };

  const handleRemovePoint = (values, setFieldValue, key, index) => {
    const updatedPoints = [...values.guidelines[key].points];
    updatedPoints.splice(index, 1);
    setFieldValue('guidelines', {
      ...values.guidelines,
      [key]: { ...values.guidelines[key], points: updatedPoints }
    });
  };

  const handleEditTitle = (values, setFieldValue, oldKey, newTitle) => {
    const updatedGuidelines = { ...values.guidelines };
    updatedGuidelines[newTitle] = { ...updatedGuidelines[oldKey], title: newTitle };
    delete updatedGuidelines[oldKey]; // Remove the old key
    setFieldValue('guidelines', updatedGuidelines);
  };

  // __ ____ handle Submit _____________
  const handleSubmit = async (values) => {
    try {
      // Ensure guidelines is structured correctly before sending
      const formattedGuidelines = Object.keys(values.guidelines).reduce((acc, key) => {
        acc[key] = values.guidelines[key].points; // Extract only the points array
        return acc;
      }, {});

      const payload = {
        ...values,
        page_description: editorValue,
        guidelines: formattedGuidelines // Replace guidelines with correct format
      };

      const response = await addSafetyGuidelines(payload);
      if (response?.status) {
        showSuccessToast('Safety Guidelines Added Successfully!');
        navigate('/expeditions/safety-guidelines');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Add Safety Guidelines!');
    }
  };

  useEffect(() => {
    getAllMediaForAdmin();
  }, []);
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/expeditions/safety-guidelines">Safety Guidelines</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Safety</Breadcrumb.Item>
      </Breadcrumb>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ values, setFieldValue }) => (
          <FormikForm>
            <h3>Add Safety</h3>
            <Row className="mb-3">
              <Col>
                <label htmlFor="category_name">Category Name</label>
                <Field name="category_name" className="form-control" placeholder="Enter category name" />
                <ErrorMessage name="category_name" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="page_title">Page Title</label>
                <Field name="page_title" className="form-control" placeholder="Enter page title" />
                <ErrorMessage name="page_title" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="page_description">Page Description</label>
                <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Write the description here" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="emergency_email"> Emergency Email</label>
                <Field name="emergency_email" className="form-control" placeholder="Enter emergency email" />
                <ErrorMessage name="emergency_email" component="div" className="text-danger" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <label htmlFor="medical_requirements">Medical Requirement</label>
                <Field name="medical_requirements" className="form-control" placeholder="Enter medical requirement" />
                <ErrorMessage name="medical_requirements" component="div" className="text-danger" />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <label htmlFor="emergency_support">Emergency Support</label>
                <Field name="emergency_support" className="form-control" placeholder="Enter medical requirement" />
                <ErrorMessage name="emergency_support" component="div" className="text-danger" />
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
                <label htmlFor="media" className="form-label">
                  Select Media <span className="text-danger">*</span>
                </label>
                <Select
                  id="media"
                  options={mediaData}
                  onChange={(selectedOption) => {
                    const media = selectedOption ? selectedOption.value : null;
                    setFieldValue('media', media); // Update Formik field with the correct ID
                  }}
                  classNamePrefix="react-select"
                  placeholder="Select Media"
                />
                <ErrorMessage name="media" component="div" className="text-danger" />
              </Col>
            </Row>
            {/* Emergency Phone Numbers */}
            <Row className="mb-3">
              <Col>
                <label>Emergency Phone Numbers</label>
                {values?.emergency_phone.map((phone, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Field name={`emergency_phone.${index}`} className="form-control" placeholder="Enter phone number" />
                    {values?.emergency_phone.length > 1 && (
                      <Button variant="danger" onClick={() => handleRemovePhone(values, setFieldValue, index)}>
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="success" onClick={() => handleAddPhone(values, setFieldValue)}>
                  Add Phone
                </Button>
              </Col>
            </Row>

            {/* Guidelines Section */}
            {/* <Row className="mb-3">
              <Col>
                <label>Guidelines</label>
                {values?.guidelines?.map((guideline, index) => (
                  <div key={index} className="mb-3">
                    <Field name={`guidelines.${index}.title`} className="form-control" placeholder="Enter guideline title" />
                    {guideline?.points?.map((point, pointIndex) => (
                      <div key={pointIndex} className="d-flex mt-2">
                        <Field
                          name={`guidelines.${index}.points.${pointIndex}`}
                          className="form-control"
                          placeholder="Enter guideline point"
                        />
                      </div>
                    ))}
                    <Button variant="danger" onClick={() => handleRemoveGuideline(values, setFieldValue, index)}>
                      Delete Guideline
                    </Button>
                  </div>
                ))}
                <Button variant="success" onClick={() => handleAddGuideline(values, setFieldValue)}>
                  Add Guideline
                </Button>
              </Col>
            </Row> */}
            <Row className="mb-3">
              <Col>
                <label>Guidelines</label>
                {Object.keys(values?.guidelines).map((key) => (
                  <div key={key} className="mb-3 p-2 border">
                    {/* Editable Title */}
                    <Field
                      name={`guidelines.${key}.title`}
                      className="form-control mb-2"
                      placeholder="Enter guideline title"
                      value={values?.guidelines[key].title}
                      onChange={(e) => handleEditTitle(values, setFieldValue, key, e.target.value)}
                    />

                    {/* List of Points */}
                    {values?.guidelines[key].points.map((point, index) => (
                      <div key={index} className="d-flex mb-2">
                        <Field name={`guidelines.${key}.points.${index}`} className="form-control" placeholder="Enter guideline point" />
                        {values?.guidelines[key].points.length > 1 && (
                          <Button variant="danger" onClick={() => handleRemovePoint(values, setFieldValue, key, index)}>
                            Delete
                          </Button>
                        )}
                      </div>
                    ))}

                    {/* Add More Points */}
                    <Button variant="info" onClick={() => handleAddPoint(values, setFieldValue, key)}>
                      Add Point
                    </Button>

                    {/* Delete Entire Guideline */}
                    <Button variant="danger" onClick={() => handleRemoveGuideline(values, setFieldValue, key)} className="ms-2">
                      Delete Guideline
                    </Button>
                  </div>
                ))}

                {/* Add New Guideline */}
                <Button variant="success" onClick={() => handleAddGuideline(values, setFieldValue)}>
                  Add Guideline
                </Button>
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

export default AddSafety;
