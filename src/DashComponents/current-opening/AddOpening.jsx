import React, { useState } from 'react';
import { Form, Button, Breadcrumb } from 'react-bootstrap';
import { Formik, FieldArray, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { OpeningCreate } from '../../../services/OpeningApi';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';

const perkOptions = [
  { value: 'Fresher', label: 'Fresher' },
  { value: 'Junior Level', label: 'Junior Level' },
  { value: 'Senior Level', label: 'Senior Level' },
  { value: 'Mid-Senior Level', label: 'Mid-Senior Level' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Part time', label: 'Part time' },
  { value: 'Full time', label: 'Full time' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Onsite', label: 'Onsite' }
];
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.748817,
  lng: -73.985428 // Default coordinates (e.g., New York City)
};

const CurrentOpeningForm = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    department: Yup.string()
      .required('Department is required'),
    location: Yup.string()
      .required('Location is required')
      .min(3, 'Location must be at least 3 characters'),
    expiry: Yup.mixed()
      .required('Expiry date is required')
      .test('is-future', 'Expiry date must be today or in the future', function(value) {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(value);
        return expiryDate >= today;
      })
  });

  const initialValues = {
    title: '',
    description: '',
    location: '',
    perks: [], // Multi-select field
    experience: '',
    expiry: '',
    department: '',
    active: 'true'
  };

  const handleSubmit = async (values) => {
    // Convert selected perks into an array of strings (values only)
    const formattedValues = {
      ...values,
      perks: values.perks.map((perk) => perk.value)
    };

    const res = await OpeningCreate(formattedValues);
    if (res?.status) {
      navigate('/current-openings');
      showSuccessToast('Successfully Added');
    } else {
      showFailureToast('Something went wrong');
    }
  };

  // google map function >>>>>>>>

  const [selectedLocation, setSelectedLocation] = useState(center);

  const handleMapClick = (e) => {
    setSelectedLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <Link to="/current-openings">All Openings</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Add Job</Breadcrumb.Item>
      </Breadcrumb>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors }) => (
          <FormikForm className="container mt-4">
            <h4>Add New Opening/Job</h4>

            <Form.Group className="mb-3">
              <Form.Label>Title<span className="text-danger">*</span></Form.Label>
              <Field 
                name="title" 
                className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                placeholder="Enter Title" 
              />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description<span className="text-danger">*</span></Form.Label>
              <Field 
                as="textarea" 
                name="description" 
                className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                placeholder="Enter Description" 
                rows={4}
              />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Department<span className="text-danger">*</span></Form.Label>
              <Field 
                name="department" 
                as="select" 
                className={`form-control ${touched.department && errors.department ? 'is-invalid' : ''}`}
              >
                <option value="">Select Department</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="Engineering">Engineering</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Finance">Finance</option>
                <option value="Research and Development (R&D)">Research and Development (R&D)</option>
                <option value="Operations">Operations</option>
              </Field>
              <ErrorMessage name="department" component="div" className="text-danger" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location<span className="text-danger">*</span></Form.Label>
              <Field 
                name="location" 
                className={`form-control ${touched.location && errors.location ? 'is-invalid' : ''}`}
                placeholder="Enter Location" 
              />
              <ErrorMessage name="location" component="div" className="text-danger" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiry<span className="text-danger">*</span></Form.Label>
              <Field 
                name="expiry" 
                className={`form-control ${touched.expiry && errors.expiry ? 'is-invalid' : ''}`}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFieldValue('expiry', date.toISOString().split('T')[0]);
                }}
              />
              <ErrorMessage name="expiry" component="div" className="text-danger" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience Level</Form.Label>
              <Select
                isMulti
                options={perkOptions}
                value={values.perks}
                onChange={(selectedOptions) => setFieldValue('perks', selectedOptions ? selectedOptions : [])}
                classNamePrefix="react-select"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Field as="select" name="active" className="form-control">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Field>
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default CurrentOpeningForm;
