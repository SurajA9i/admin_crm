import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Col, Container, FormGroup, Row } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';

import { getSafetyGuidelinesById, updateSafetyGuidelines } from '../../../../services/ExpeditionsApi';

import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { ImgUrl } from '../../../../utils/Constant';
import { showSuccessToast, showFailureToast } from '../../toastsAlert/Alert.jsx';

const EditGuidelines = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [editorValue, setEditorValue] = useState('');
  const [expeditionsById, setExpeditionsById] = useState({});
  const [showSelectedImg, setShowSelectedImage] = useState(null);

  const getExpeditionsById = async () => {
    try {
      const response = await getSafetyGuidelinesById(id);
      console.log(response, 'gdhfdfsdfgj');
      if (response?.status) {
        const dataList = response?.data?.data;
        setExpeditionsById(dataList);
        setEditorValue(dataList?.description || '');
      }
    } catch (error) {
      console.log('Error:::', error);
    }
  };

  const initialValues = {
    category_name: expeditionsById?.category_name || '',
    page_title: expeditionsById?.page_title || '',
    page_description: expeditionsById?.page_description || '',
    guidelines: expeditionsById?.guidelines || {}, // Keeping it as an object
    media: expeditionsById?.media?._id || '',
    medical_requirements: expeditionsById?.medical_requirements || '',
    emergency_support: expeditionsById?.emergency_support || '',
    emergency_address: expeditionsById?.emergency_address || '',
    emergency_email: expeditionsById?.emergency_email || '',
    emergency_phone: expeditionsById?.emergency_phone || [''] // Ensuring it's an array

    // title: expeditionsById?.title || '',
    // date: expeditionsById?.date ? new Date(expeditionsById?.date).toISOString().split('T')[0] : '',
    // image: expeditionsById?.image || null,
    // location: expeditionsById?.location || '',
    // price: expeditionsById?.price || '',
    // related_destination: expeditionsById?.related_destination || '',
    // description: expeditionsById?.description || '',
    // accommodation: expeditionsById?.accommodation || '',
    // medical_req: expeditionsById?.medical_req || '',
    // type: expeditionsById?.type || ''
  };

  const handleSubmit = async (values) => {
    try {
      const response = await updateSafetyGuidelines(id, values);
      if (response?.status) {
        showSuccessToast('Expeditions Updated Successfully! ');
        navigate('/expeditions/safety-guidelines');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Failed To Edit');
    }
  };

  useEffect(() => {
    getExpeditionsById();
  }, []);

  return (
    <>
      <Container className="mt-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/expeditions/safety-guidelines">Safety Guidelines</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Safety Guidelines</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <FormGroup className="mb-0 align-items-center">
              <h5>Edit Safety Guidelines</h5>
            </FormGroup>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
              {({ values, setFieldValue }) => (
                <FormikForm>
                  <h3>Edit Safety</h3>
                  {/* Category Name */}
                  <Row className="mb-3">
                    <Col>
                      <label htmlFor="category_name">Category Name</label>
                      <Field name="category_name" className="form-control" placeholder="Enter category name" />
                      <ErrorMessage name="category_name" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  {/* Page Title */}
                  <Row className="mb-3">
                    <Col>
                      <label htmlFor="page_title">Page Title</label>
                      <Field name="page_title" className="form-control" placeholder="Enter page title" />
                      <ErrorMessage name="page_title" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  {/* Page Description */}
                  <Row className="mb-3">
                    <Col>
                      <label htmlFor="page_description">Page Description</label>
                      <ReactQuill value={values.page_description} onChange={(val) => setFieldValue('page_description', val)} />
                    </Col>
                  </Row>

                  {/* Emergency Email */}
                  <Row className="mb-3">
                    <Col>
                      <label htmlFor="emergency_email">Emergency Email</label>
                      <Field name="emergency_email" className="form-control" placeholder="Enter emergency email" />
                      <ErrorMessage name="emergency_email" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  {/* Medical Requirements */}
                  <Row className="mb-3">
                    <Col>
                      <label htmlFor="medical_requirements">Medical Requirement</label>
                      <Field name="medical_requirements" className="form-control" placeholder="Enter medical requirement" />
                      <ErrorMessage name="medical_requirements" component="div" className="text-danger" />
                    </Col>
                  </Row>

                  {/* Emergency Phone Numbers */}
                  <Row className="mb-3">
                    <Col>
                      <label>Emergency Phone</label>
                      {values.emergency_phone.map((phone, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                          <Field name={`emergency_phone.${index}`} className="form-control me-2" placeholder="Enter phone number" />
                          <Button
                            variant="danger"
                            onClick={() =>
                              setFieldValue(
                                'emergency_phone',
                                values.emergency_phone.filter((_, i) => i !== index)
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button variant="secondary" onClick={() => setFieldValue('emergency_phone', [...values.emergency_phone, ''])}>
                        Add Phone
                      </Button>
                    </Col>
                  </Row>

                  {/* Guidelines (Title & Points) */}
                  <Row className="mb-3">
                    <Col>
                      <label>Guidelines</label>
                      {Object.entries(values.guidelines).map(([key, points], index) => (
                        <div key={index} className="mb-3">
                          <Field name={`guidelines.${key}.title`} className="form-control mb-2" placeholder="Enter guideline title" />
                          {points.map((point, i) => (
                            <div key={i} className="d-flex align-items-center mb-2">
                              <Field name={`guidelines.${key}.${i}`} className="form-control me-2" placeholder="Enter point" />
                              <Button
                                variant="danger"
                                onClick={() =>
                                  setFieldValue(
                                    `guidelines.${key}`,
                                    points.filter((_, j) => j !== i)
                                  )
                                }
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                          <Button variant="secondary" onClick={() => setFieldValue(`guidelines.${key}`, [...points, ''])}>
                            Add Point
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="primary"
                        onClick={() => setFieldValue(`guidelines.Guide_${Object.keys(values.guidelines).length + 1}`, [''])}
                      >
                        Add Guideline
                      </Button>
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EditGuidelines;
