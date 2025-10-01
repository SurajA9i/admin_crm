import React, { useEffect, useState } from 'react';
import { Form,  Row, Col, Breadcrumb, Form as BootstrapForm, Button } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field, ErrorMessage, FieldArray } from 'formik';
import ReactQuill from 'react-quill'; // import ReactQuill
import { FetchNationalPark } from '../../../services/NationalParkApi';
import { UpdateResort, getResortById } from '../../../services/ResortApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ImgUrl } from '../../../utils/Constant';

const relatedDestinations = ['Beaches', 'Mountains', 'Deserts', 'Forests', 'Cities'];

const EditResort = () => {
  const params = useParams();
  const id = params.id;

  const Navigate = useNavigate(); 
  const [destinations, setDestination] = useState([]);
  const [editorValue, setEditorValue] = useState('');
  const [data, setData] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });

  const resortResponse = async () => {
    const res = await getResortById(id);
    setData(res?.data?.data);
    setEditorValue(res?.data?.data?.description);
  };
  const initialFeatures = Object.entries(data?.features || { '': '' });

  const initialValues = {
    heading: data?.heading || '',
    title: data?.title || '',
    destination: data?.destination?._id || '',
    image: null,
    address: data?.address || '',
    price: data?.price || '',
    currency: data?.currency || '',
    // additionalImages: data?.,
    related_destination: data?.related_destination || '',
    description: data?.description || '',
    features: initialFeatures || {} // Load existing features
  };
  const getData = async () => {
    // const res = await FetchDestination();
    const res = await FetchNationalPark(state);
    setDestination(res?.data?.data?.result);
  };
  const handleSingleFileChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);

    setFieldValue('additionalImages', [...values.additionalImages, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  // Remove Existing Image (API)
  const removeExistingImage = (index) => {
    setData((prevData) => {
      const updatedImages = [...prevData.additional_images];
      updatedImages.splice(index, 1);
      return { ...prevData, additional_images: updatedImages };
    });
  };

  const removeNewImage = (index, setFieldValue, values) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);

    const updatedFiles = [...values.additionalImages];
    updatedFiles.splice(index, 1);
    setFieldValue('additionalImages', updatedFiles);
  };

  const handleSubmit = async (values) => {
    const formattedFeatures = Object.fromEntries(values.features);
    console.log(formattedFeatures);
    const additionalImages = values?.additionalImages || [];

    const formData = new FormData();
    formData.append('heading', values.heading);
    formData.append('title', values.title);
    formData.append('destination', values.destination);
    formData.append('image', values.image);
    formData.append('address', values.address);
    formData.append('price', values.price);
    formData.append('currency', values.currency);
    formData.append('related_destination', values.related_destination);
    formData.append('description', editorValue);
    formData.append('features', JSON.stringify(formattedFeatures));
    // Append Remaining Existing Images
    data?.additional_images.forEach((img) => {
      formData.append('additional_images', img);
    });

    // Append New Images
    additionalImages?.forEach((file) => {
      formData.append('additional_images', file);
    });

    try {
      const response = await UpdateResort(id, formData);
      if (response.status) {
        Navigate('/resorts');
        showSuccessToast('Successfully Edited');
      }
    } catch (error) {
      console.log(error);
      showFailureToast('Edit Failed');
    }
  };

  useEffect(() => {
    getData();
    if (id) {
      resortResponse();
    }
  }, [id]);

  return (
    <>
      <div className="container mt-5">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/resorts">Resort</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Edit Resort</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col>
                <h5>Edit Resort</h5>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
              {({ values,setFieldValue }) => (
                <FormikForm className="row">
                  <Form.Group className="col-lg-6 mb-4" controlId="heading">
                    <Form.Label>Heading</Form.Label>
                    <Field name="heading" as={Form.Control} placeholder="Enter heading" />
                    <ErrorMessage name="heading" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="title">
                    <Form.Label>Resort Name</Form.Label>
                    <Field name="title" as={Form.Control} placeholder="Enter title" />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="destination">
                    <Form.Label>Destination</Form.Label>
                    <Field as={Form.Select} name="destination">
                      <option value="">Select Destination</option>
                      {destinations?.map((dest, index) => (
                        <option key={index} value={dest?._id}>
                          {dest?.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="destination" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="description">
                    <Form.Label>Destination Details</Form.Label>
                    <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Write the description here" />
                  </Form.Group>

                  {/* <Form.Group className="col-lg-6 mb-4" controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={(e) => setFieldValue('image', e.target.files[0])} />
                    <ErrorMessage name="image" component="div" className="text-danger" />
                  </Form.Group> */}

                  <Form.Group className="col-lg-6 mb-4" controlId="image">
                    <Form.Label>Image</Form.Label>
                    {/* File input for new image upload */}

                    <Form.Control type="file" onChange={(e) => setFieldValue('image', e.target.files[0])} />
                    <ErrorMessage name="image" component="div" className="text-danger" />

                    {/* Show existing image if available */}
                    {data?.image && (
                      <div className="mb-2 mt-3">
                        <img
                          src={`${ImgUrl}${data.image}`} // Adjust based on your server path
                          alt="Existing Resort"
                          style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="additionalImages">
                    <Form.Label>Additional Images</Form.Label>

                    {/* File input for new images */}
                    <Form.Control
                      className="col-lg-6 mb-4"
                      type="file"
                      multiple
                      onChange={(e) => handleSingleFileChange(e, setFieldValue, values)}
                    />
                    <ErrorMessage name="additionalImages" component="div" className="text-danger" />

                    {/* Display Existing Images from API */}
                    <div className="row mt-3">
                      {data?.additional_images?.map((img, index) => (
                        <div key={`existing-${index}`} className="col-md-2 mb-3">
                          <div className="img-block position-relative">
                            <img
                              src={`${ImgUrl}${img}`} // Adjust based on your server path
                              alt={`Existing Image ${index}`}
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                            {/* Remove Button */}
                            <span
                              className="remove_img position-absolute top-0 end-0 bg-danger text-white p-1"
                              style={{ cursor: 'pointer', fontSize: '14px', borderRadius: '50%' }}
                              onClick={() => removeExistingImage(index)}
                            >
                              ✖
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Display Newly Added Images */}
                      {previewImages?.map((url, index) => (
                        <div key={`new-${index}`} className="col-md-2 mb-3">
                          <div className="img-block position-relative">
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                            {/* Remove Button */}
                            <span
                              className="remove_img position-absolute top-0 end-0 bg-danger text-white p-1"
                              style={{ cursor: 'pointer', fontSize: '14px', borderRadius: '50%' }}
                              onClick={() => removeNewImage(index, setFieldValue, values)}
                            >
                              ✖
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Field name="address" as={Form.Control} placeholder="Enter address" />
                    <ErrorMessage name="address" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 mb-4" controlId="price">
                    <Form.Label>Price</Form.Label>
                    {/* <Field name="price" as={Form.Control} placeholder="Enter price" type="number" /> */}
                    <Field
                      name="price"
                      as={Form.Control}
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
                    <ErrorMessage name="price" component="div" className="text-danger" />
                  </Form.Group>
                  <Form.Group className="col-lg-6 mb-4" controlId="currency">
                    <Form.Label>Currency</Form.Label>
                    <Field as={Form.Select} name="currency">
                      <option value="">Select Currency</option>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </Field>
                    <ErrorMessage name="currency" component="div" className="text-danger" />
                  </Form.Group>

                  <Form>
                    <Form.Label>Features</Form.Label>
                    <FieldArray
                      name="features"
                      render={(arrayHelpers) => (
                        <>
                          {values.features.map((feature, index) => (
                            <div key={index} className="d-flex align-items-center mb-3">
                              {/* Feature Key Input */}
                              <BootstrapForm.Group className="me-2">
                                <Field name={`features[${index}][0]`} as={BootstrapForm.Control} placeholder="Enter feature key" />
                              </BootstrapForm.Group>

                              {/* Feature Value Input */}
                              <BootstrapForm.Group className="me-2">
                                <Field name={`features[${index}][1]`} as={BootstrapForm.Control} placeholder="Enter feature value" />
                              </BootstrapForm.Group>

                              {/* Remove Feature Button */}
                              <Button variant="danger" onClick={() => arrayHelpers.remove(index)}>
                                ❌
                              </Button>
                            </div>
                          ))}

                          {/* Add New Feature */}
                          <Button
                            variant="primary"
                            onClick={() => arrayHelpers.push(['', ''])} // Add empty key-value pair
                          >
                            ➕ Add Feature
                          </Button>
                        </>
                      )}
                    />
                  </Form>
                  {/* <Form.Group className="col-lg-6 mb-4" controlId="related_destination">
                    <Form.Label>Related Destination</Form.Label>
                    <Field as={Form.Select} name="related_destination">
                      <option value="">Select Related Destination</option>
                      {relatedDestinations.map((rel, index) => (
                        <option key={index} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="related_destination" component="div" className="text-danger" />
                  </Form.Group> */}

                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
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

export default EditResort;
