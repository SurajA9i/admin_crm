import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import side from '../../assets/images/sidebar.png';
import { UserCreate } from '../../../services/UserApi.jsx'; // Ensure this API function works as intended
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
});

const CreateUser = () => {
  const Navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(side);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      name: '',
      mobile: '',
      email: '',
      password: '',
      image: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('mobile', values.mobile);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('image', selectedImage);

      try {
        // Call your POST API function here
        const response = await UserCreate(formData);
        if (response.status) {
          Navigate('/user-management/users');
          showSuccessToast('User Created Successfully')
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  });

  return (
    <Row>
      <Col sm={12}>
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body center_file">
                <div className="input_browse">
                  <div>
                    <i className="fa fa-camera" aria-hidden="true"></i>
                    <p className="choose-file">Choose File</p>
                  </div>
                  <input type="file" onChange={handleImageChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <div className="img_browse">
                  <img src={previewImage} className="img-fluid rounded" alt="Preview" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Create User</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Form.Group className="col-lg-6 mb-3" controlId="formBasicName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.name && formik.errors.name ? 'is-invalid' : ''}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="invalid-feedback">{formik.errors.name}</div>
                  )}
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="formBasicMobile">
                  <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}
                  />
                  {formik.touched.mobile && formik.errors.mobile && (
                    <div className="invalid-feedback">{formik.errors.mobile}</div>
                  )}
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="formBasicEmail">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.email && formik.errors.email ? 'is-invalid' : ''}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="invalid-feedback">{formik.errors.email}</div>
                  )}
                </Form.Group>

                <Form.Group className="col-lg-6 mb-3" controlId="formBasicPassword">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={formik.touched.password && formik.errors.password ? 'is-invalid' : ''}
                    />
                    <InputGroup.Text 
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback" style={{ display: 'block' }}>{formik.errors.password}</div>
                    )}
                  </InputGroup>
                </Form.Group>

                <div className="col-lg-12">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateUser;
