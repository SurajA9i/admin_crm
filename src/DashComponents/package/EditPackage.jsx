import React, { useEffect, useState } from 'react';
import { Form, Col, Breadcrumb, Form as BootstrapForm, Button } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, FieldArray, ErrorMessage } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UpdatePackage, getPackageById } from '../../../services/PackageApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';

const EditResort = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    heading: '',
    title: '',
    description: '',
    duration: '',
    region: '',
    state: '',
    image: null, // Field for a new main image File object
    price: '',
    currency: '',
    type: '',
    date: [],
    features: [],
    additional_images: [], // Holds existing image filenames (strings)
    new_additional_images: [] // Holds new image File objects
  });

  const [loading, setLoading] = useState(true); // Start as true to show loader initially
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [previewNewMainImage, setPreviewNewMainImage] = useState(null);
  const [previewNewAdditionalImages, setPreviewNewAdditionalImages] = useState([]);
  
  // State to hold the value of the date input before it's added
  const [currentDateInput, setCurrentDateInput] = useState('');

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getPackageById(id);
        const packageData = res?.data?.data;
        if (packageData) {
          // Format the dates from "2025-06-29T00:00:00.000Z" to "2025-06-29"
          const formattedDates = (packageData.date || []).map(d => d ? new Date(d).toISOString().split('T')[0] : '').filter(Boolean);

          setInitialValues({
            heading: packageData.heading || '',
            title: packageData.title || '',
            description: packageData.description || '',
            duration: packageData.duration || '',
            region: packageData.region || '',
            state: packageData.state || '',
            image: null,
            original_image: packageData.image || '', // Keep track of the original image filename
            price: packageData.price || '',
            currency: packageData.currency || '',
            type: packageData.type || '',
            date: formattedDates,
            features: Object.entries(packageData.features || {}),
            additional_images: packageData.additional_images || [],
            new_additional_images: []
          });
          setIsDataLoaded(true);
        }
      } catch (error) {
        showFailureToast('Could not fetch package data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getData();
    }
  }, [id]);

  const handleAddDateClick = (setFieldValue, currentDates) => {
    if (currentDateInput && !currentDates.includes(currentDateInput)) {
      const updatedDates = [...currentDates, currentDateInput].sort();
      setFieldValue('date', updatedDates);
      setCurrentDateInput('');
    }
  };

  const handleRemoveDate = (index, setFieldValue, currentDates) => {
    const updatedDates = currentDates.filter((_, i) => i !== index);
    setFieldValue('date', updatedDates);
  };

  const handleNewAdditionalImagesChange = (e, setFieldValue, currentNewImages) => {
    const files = Array.from(e.target.files);
    setFieldValue('new_additional_images', [...currentNewImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewNewAdditionalImages((prev) => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index, setFieldValue, currentImages) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setFieldValue('additional_images', updatedImages);
  };

  const removeNewImage = (index, setFieldValue, currentNewImages) => {
    const updatedPreviews = [...previewNewAdditionalImages];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setPreviewNewAdditionalImages(updatedPreviews);
    const updatedFiles = currentNewImages.filter((_, i) => i !== index);
    setFieldValue('new_additional_images', updatedFiles);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    
    formData.append('heading', values.heading);
    formData.append('title', values.title);
    formData.append('duration', values.duration);
    formData.append('region', values.region);
    formData.append('state', values.state);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('description', values.description);
    formData.append('type', values.type);

    if (values.image) {
      formData.append('image', values.image);
    }
    
    // Send remaining existing images and all new images.
    // The backend should clear the old list and save this new one.
    values.additional_images.forEach(imgFilename => {
        formData.append('additional_images', imgFilename);
    });
    values.new_additional_images.forEach(fileObject => {
        formData.append('additional_images', fileObject);
    });
    
    const formattedFeatures = Object.fromEntries(values.features);
    formData.append('features', JSON.stringify(formattedFeatures));

    if (values.type === 'expedition') {
      formData.append('date', values.date.join(','));
    }

    try {
      const response = await UpdatePackage(id, formData);
      if (response?.status) {
        showSuccessToast('Package Updated Successfully');
        navigate('/packages');
      } else {
        showFailureToast('Failed to update package.');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('An error occurred during update.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isDataLoaded) {
    return <div className="container mt-4">Loading package data...</div>;
  }

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item><Link to="/admin/dashboard">Dashboard</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to="/packages">Junglore Expeditions</Link></Breadcrumb.Item> {/* renamed from Packages to Junglore Expeditions */}
        <Breadcrumb.Item active>Edit Package</Breadcrumb.Item>
      </Breadcrumb>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {({ values, setFieldValue }) => (
          <FormikForm>
            <div className="card">
              <div className="card-header"><h5>Edit Package</h5></div>
              <div className="card-body row">

                {/* Text and Select Fields */}
                <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Field name="heading" as={Form.Control} />
                </Form.Group>
                <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Field name="title" as={Form.Control} />
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
                </Form.Group>
                
                <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Field name="price" as={Form.Control} type="number" />
                </Form.Group>
                <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Currency</Form.Label>
                    <Field as={Form.Select} name="currency">
                      <option value="">Select Currency</option>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </Field>
                </Form.Group>
                <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Field name="type" as={Form.Select} disabled>
                      <option value="expedition">Expedition</option>
                      <option value="other">Other</option>
                    </Field>
                </Form.Group>
                
                {/* Date Selection Section */}
                {values.type === 'expedition' && (
                  <Form.Group as={Col} lg="6" className="mb-3">
                    <Form.Label>Available Dates</Form.Label>
                    <div className="d-flex align-items-center">
                      <Form.Control type="date" value={currentDateInput} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCurrentDateInput(e.target.value)} />
                      {/* <<< CHANGE: Button color is now primary */}
                      <Button type="button" variant="primary" className="ms-2 flex-shrink-0" onClick={() => handleAddDateClick(setFieldValue, values.date)}>
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {values.date.map((date, index) => (
                        // <<< CHANGE: Badge color is now secondary
                        <div key={index} className="badge bg-secondary d-flex align-items-center p-2">
                          <span className="me-2">{date}</span>
                          <button type="button" className="btn-close btn-close-white" style={{ fontSize: '0.65em' }} onClick={() => handleRemoveDate(index, setFieldValue, values.date)}></button>
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                )}

                {/* Image Sections */}
                <Form.Group as={Col} lg="12" className="mb-3">
                  <Form.Label>Main Image (Upload new to replace)</Form.Label>
                  <Form.Control type="file" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFieldValue('image', file);
                      setPreviewNewMainImage(URL.createObjectURL(file));
                    }
                  }} />
                  <div className="mt-2">
                    <p className="mb-1 small">Current Image:</p>
                    {previewNewMainImage ? (
                      <img src={previewNewMainImage} alt="New Preview" className="img-fluid rounded" style={{maxHeight: '150px'}} />
                    ) : (
                      values.original_image && <img src={`${ImgUrl}${values.original_image}`} alt="Current" className="img-fluid rounded" style={{maxHeight: '150px'}} />
                    )}
                  </div>
                </Form.Group>
                
                <Form.Group as={Col} lg="12" className="mb-3">
                  <Form.Label>Additional Images</Form.Label>
                  <Form.Control type="file" multiple onChange={(e) => handleNewAdditionalImagesChange(e, setFieldValue, values.new_additional_images)} />
                  <div className="row mt-3">
                    <p className="small">Click ✖ to remove an image. The list will be updated on save.</p>
                    {values.additional_images.map((img, index) => (
                      <Col xs={4} md={2} key={`existing-${index}`} className="mb-3">
                        <div className="position-relative">
                          <img src={`${ImgUrl}${img}`} alt="Existing" className="img-fluid rounded" />
                          <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1" style={{lineHeight: 1}} onClick={() => removeExistingImage(index, setFieldValue, values.additional_images)}>×</Button>
                        </div>
                      </Col>
                    ))}
                    {previewNewAdditionalImages.map((url, index) => (
                      <Col xs={4} md={2} key={`new-${index}`} className="mb-3">
                        <div className="position-relative">
                          <img src={url} alt="New Preview" className="img-fluid rounded" />
                          <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-1" style={{lineHeight: 1}} onClick={() => removeNewImage(index, setFieldValue, values.new_additional_images)}>×</Button>
                        </div>
                      </Col>
                    ))}
                  </div>
                </Form.Group>

                {/* Features and Description */}
                <Col lg="12" className="mb-3">
                  <Form.Label>Features</Form.Label>
                  <FieldArray name="features" render={(arrayHelpers) => (
                    <div>
                      {values.features && values.features.length > 0 && values.features.map((feature, index) => (
                        <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
                          <Field name={`features[${index}][0]`} as={BootstrapForm.Control} placeholder="Feature Heading" className="me-2" />
                          <Field name={`features[${index}][1]`} as={BootstrapForm.Control} placeholder="Feature Title" className="me-2" />
                          <Button variant="outline-danger" onClick={() => arrayHelpers.remove(index)}>×</Button>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" onClick={() => arrayHelpers.push(['', ''])}>+ Add Feature</Button>
                    </div>
                  )} />
                </Col>
                <Form.Group as={Col} lg="12" className="mb-3">
                  <Form.Label>Destination Description</Form.Label>
                  <ReactQuill theme="snow" value={values.description} onChange={(content) => setFieldValue('description', content)} />
                </Form.Group>
                
                {/* Submit Button */}
                <Col lg="12">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
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

export default EditResort;