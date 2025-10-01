import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../../../../services/AdminLoginApi';

const JWTLogin = () => {
  const navigate = useNavigate();

  // Initial values for the form
  const initialValues = {
    // email: 'info@codedthemes.com',
    // password: '123456'
    email: '',
    password: ''
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
  });

  const handleSubmit = async (values, { resetForm, setSubmitting, setErrors }) => {
    try {
      const res = await AdminLogin(values);
      // console.log(res,'re')
      localStorage.setItem('accessToken', res.data.token || 'dummyToken');
      if (res?.status) {
        navigate('/admin');
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <div className="form-group mb-3">
            <label htmlFor="email">Email Address / Username</label>
            <Field id="email" name="email" type="email" placeholder="Enter Email" className="form-control" />
            <ErrorMessage name="email" component="small" className="text-danger form-text" />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <Field id="password" name="password" type="password" placeholder="Enter Password" className="form-control" />
            <ErrorMessage name="password" component="small" className="text-danger form-text" />
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials.
            </label>
          </div>

          <Row>
            <Col>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="btn-block mb-4">
                Signin
              </Button>
            </Col>
          </Row>

          <ErrorMessage name="submit">
            {(msg) => (
              <Alert variant="danger" className="mt-3">
                {msg}
              </Alert>
            )}
          </ErrorMessage>
        </Form>
      )}
    </Formik>
  );
};

export default JWTLogin;
