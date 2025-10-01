import React, { useState } from 'react';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Don't forget to import Quill's CSS
import { Form, Breadcrumb, Form as BootstrapForm, Button, Col } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import { addPackage } from '../../../services/PackageApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { Link, useNavigate } from 'react-router-dom';

const initialValues = {
  heading: '',
  title: '',
  description: '',
  duration: '',
  region: '',
  state: '',
  image: null,
  additionalImages: [],
  price: '',
  currency: '',
  dates: [],
  type: ''
};

const AddResort = () => {
  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState(false);
  const [inputs, setInputs] = useState([{ heading: '', title: '' }]);
  
  // State to hold the value of the date input before it's added to the list
  const [currentDateInput, setCurrentDateInput] = useState('');

  const handleSingleFileChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);
    setFieldValue('additionalImages', [...values.additionalImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index, setFieldValue, values) => {
    // Clean up the object URL to prevent memory leaks
    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    // Remove the file from Formik's state
    const updatedFiles = [...values.additionalImages];
    updatedFiles.splice(index, 1);
    setFieldValue('additionalImages', updatedFiles);
  };

  const handleAddField = () => setInputs([...inputs, { heading: '', title: '' }]);
  const handleDeleteField = (index) => setInputs(inputs.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    setInputs((prevInputs) => prevInputs.map((input, i) => (i === index ? { ...input, [field]: value } : input)));
  };

  // Handler for the "Add Date" button click
  const handleAddDateClick = (setFieldValue, currentDates) => {
    if (currentDateInput && !currentDates.includes(currentDateInput)) {
      const updatedDates = [...currentDates, currentDateInput].sort(); // Keep dates sorted for consistency
      setFieldValue('dates', updatedDates);
      setCurrentDateInput(''); // Reset input field after adding
    }
  };

  // Handler to remove a date from the list
  const removeDate = (indexToRemove, setFieldValue, currentDates) => {
    const updatedDates = currentDates.filter((_, i) => i !== indexToRemove);
    setFieldValue('dates', updatedDates);
  };
  
  const validationSchema = Yup.object().shape({
    heading: Yup.string().required('Heading is required'),
    title: Yup.string().required('Title is required'),
    duration: Yup.string().required('Duration is required'),
    region: Yup.string().required('Region is required'),
    image: Yup.mixed().required('Main image is required'),
    price: Yup.number().typeError('Price must be a number').required('Price is required').positive('Price must be positive'),
    currency: Yup.string().required('Currency is required'),
    description: Yup.string().test('is-not-empty', 'Description is required', (value) => {
      if (!value) return false;
      const strippedValue = value.replace(/<[^>]*>/g, '').trim();
      return strippedValue.length > 0;
    }),
    type: Yup.string().required('Type is required'),
    dates: Yup.array().when('type', {
        is: 'expedition',
        then: schema => schema.min(1, 'At least one date is required for expeditions.'),
        otherwise: schema => schema.notRequired(),
    }),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const featureData = inputs.reduce((acc, { heading, title }) => {
      if (heading && title) acc[heading] = title;
      return acc;
    }, {});

    const formData = new FormData();
    formData.append('heading', values.heading);
    formData.append('title', values.title);
    formData.append('image', values.image);
    formData.append('duration', values.duration);
    formData.append('region', values.region);
    formData.append('state', values.state);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('description', values.description);
    formData.append('features', JSON.stringify(featureData));
    formData.append('type', values.type);

    if (values.type === 'expedition') {
      formData.append('date', values.dates.join(','));
    }
    for (const file of values.additionalImages) {
      formData.append('additional_images', file);
    }
    
    try {
      const response = await addPackage(formData);
      if (response?.status) {
        showSuccessToast('Package Added Successfully');
        navigate('/packages');
      } else {
        showFailureToast('Failed to add package. Please try again.');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('An error occurred. Failed To Add.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item><Link to="/admin/dashboard">Dashboard</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/packages">Junglore Expeditions</Link></Breadcrumb.Item> {/* renamed from Packages to Junglore Expeditions */}
        <Breadcrumb.Item active>Add Package</Breadcrumb.Item>
      </Breadcrumb>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <FormikForm>
            <div className="card">
              <div className="card-header"><h5>Add Package</h5></div>
              <div className="card-body row">

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Heading</Form.Label>
                  <Field name="heading" as={Form.Control} placeholder="Enter heading" />
                  <ErrorMessage name="heading" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Field name="title" as={Form.Control} placeholder="Enter title" />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Field name="duration" as={Form.Control} placeholder="e.g., 5 Days / 4 Nights" />
                  <ErrorMessage name="duration" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Region <span className="text-danger">*</span></Form.Label>
                  {/* <Field as={Form.Select} name="region"> */}
                  <Field as={Form.Select} name="region" onChange={(e) => {
                    setFieldValue('region', e.target.value);
                    setFieldValue('state', ''); // Reset state when region changes
                  }}>
                    <option value="">Select Region</option>
                    <option value="India">India</option>
                    <option value="Africa">Africa</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage name="region" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>State/Country</Form.Label>
                  <Field as={Form.Select} name="state">
                    <option value="">Select State/Country</option>
                    {values.region === 'India' && (
                      <>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                        <option value="Chandigarh">Chandigarh</option>
                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                        <option value="Lakshadweep">Lakshadweep</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Puducherry">Puducherry</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                      </>
                    )}
                    {values.region === 'Africa' && (
                      <>
                        <option value="South Africa">South Africa</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Madagascar">Madagascar</option>
                      </>
                    )}
                  </Field>
                  <ErrorMessage name="state" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Main Image</Form.Label>
                  <Form.Control type="file" onChange={(e) => setFieldValue('image', e.target.files[0])} />
                  <ErrorMessage name="image" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Field name="price" as={Form.Control} placeholder="Enter price" type="number" />
                  <ErrorMessage name="price" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Field as={Form.Select} name="currency">
                    <option value="">Select Currency</option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                  </Field>
                  <ErrorMessage name="currency" component="div" className="text-danger" />
                </Form.Group>

                <Form.Group as={Col} lg="6" className="mb-3">
                  <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                  <Field
                    name="type"
                    as={Form.Select}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setFieldValue('type', selectedType);
                      setShowType(selectedType === 'expedition');
                    }}
                  >
                    <option value="">Select Type</option>
                    <option value="expedition">Expedition</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage name="type" component="div" className="text-danger" />
                </Form.Group>

                {showType && (
                  <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Available Dates</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control type="date" value={currentDateInput} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCurrentDateInput(e.target.value)} />
                      {/* <<< CHANGE: Button color is now primary */}
                      <Button type="button" variant="primary" className="ms-2 flex-shrink-0" onClick={() => handleAddDateClick(setFieldValue, values.dates)}>
                        Add
                      </Button>
                    </div>
                    <ErrorMessage name="dates" component="div" className="text-danger" />
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {values.dates.map((date, index) => (
                        // <<< CHANGE: Badge color is now secondary
                        <div key={index} className="badge bg-secondary d-flex align-items-center p-2">
                          <span className="me-2">{date}</span>
                          <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.65em' }} aria-label="Remove" onClick={() => removeDate(index, setFieldValue, values.dates)}></button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                )}
                
                <Form.Group as={Col} lg="12" className="mb-3">
                  <Form.Label>Additional Images</Form.Label>
                  <Form.Control type="file" multiple onChange={(e) => handleSingleFileChange(e, setFieldValue, values)} />
                  <div className="row mt-3">
                    {previewImages.map((url, index) => (
                      <Col xs={4} md={2} key={url} className="mb-3">
                        <div className="position-relative">
                          <img src={url} alt={`Preview ${index}`} className="img-fluid rounded" style={{ height: '100px', objectFit: 'cover', width: '100%' }} />
                          <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1" style={{ lineHeight: '1' }} onClick={() => removeImage(index, setFieldValue, values)}>×</Button>
                        </div>
                      </Col>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group as={Col} lg="12" className="mb-3">
                  <Form.Label>Destination Details</Form.Label>
                  <ReactQuill theme="snow" value={values.description} onChange={(content) => setFieldValue('description', content)} placeholder="Write description here" />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Form.Group>

                <Col lg="12" className="mb-3">
                  <Form.Label className="fw-bold">Add Features</Form.Label>
                  {inputs.map((input, index) => (
                    <Form.Group className="mb-2" key={index}>
                      <div className="d-flex align-items-center gap-2 p-2 border rounded">
                        <BootstrapForm.Control type="text" placeholder="Feature Heading" value={input.heading} onChange={(e) => handleChange(index, 'heading', e.target.value)} />
                        <BootstrapForm.Control type="text" placeholder="Feature Title" value={input.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                        <Button variant="outline-danger" className="btn-sm" onClick={() => handleDeleteField(index)}>×</Button>
                      </div>
                    </Form.Group>
                  ))}
                  <Button type="button" variant="secondary" onClick={handleAddField}>+ Add Feature</Button>
                </Col>

                <Col lg="12">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Save Package'}
                  </Button>
                </Col>

              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default AddResort;