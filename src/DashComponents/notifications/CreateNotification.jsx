import React, { useEffect, useState } from 'react';
import { Form, Button, Breadcrumb } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { NotfiCreate } from '../../../services/NotificationApi';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';
import { FetchUsers } from '../../../services/UserApi';
import Select from 'react-select';

const CreateNotification = () => {
  const Navigate = useNavigate();
  const [showUserId, setShowUserId] = useState(false);

  const validationSchema = Yup.object().shape({
    type: Yup.string()
      .required('Please select user type'),
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must not exceed 100 characters'),
    message: Yup.string()
      .required('Description is required')
      .min(10, 'Description must be at least 10 characters'),
    userId: Yup.array()
      .when('type', {
        is: 'user-specific',
        then: () => Yup.array().min(1, 'Please select at least one user').required('Please select users'),
        otherwise: () => Yup.array().notRequired()
      })
  });

  // Initial values
  const initialValues = {
    type: '',
    title: '',
    message: '',
    status: 'true',
    userId: []
  };

  const [userList, setUserList] = useState([]);

  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 50,
    category_id: null
  });
  const getAllUsers = async () => {
    const res = await FetchUsers(state);

    const options = res?.data?.data?.result.map((user) => ({
      value: user._id,
      label: user.name
    }));
    setUserList(options);
    // setTotalPages(res?.data?.data?.totalPages || 1);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await NotfiCreate(values);
      if (res?.status) {
        Navigate('/notifications');
        showSuccessToast('Successfully Added');
      }
    } catch (error) {
      console.log(error, 'errors');
      showFailureToast('Failed To Add');
    }

    setSubmitting(false); // Stop submission spinner
  };
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div className="container mt-4">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/notifications">Notifications</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Add Notification</Breadcrumb.Item>
        </Breadcrumb>
        <div className="card">
          <div className="card-header">
            <h5>Add Notification</h5>
          </div>
          <div className="card-body">
            <Formik 
              initialValues={initialValues} 
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting, touched, errors }) => (
                <FormikForm className="row">
                  <Form.Group controlId="type" className="col-lg-6 mb-4">
                    <Form.Label>Users<span className="text-danger">*</span></Form.Label>
                    <Field
                      name="type"
                      as="select"
                      className={`form-select ${touched.type && errors.type ? 'is-invalid' : ''}`}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setFieldValue('type', selectedType);
                        setShowUserId(selectedType === 'user-specific');
                        if (selectedType !== 'user-specific') {
                          setFieldValue('userId', []);
                        }
                      }}
                    >
                      <option value="">Select User</option>
                      <option value="global">All Users</option>
                      <option value="user-specific">Specific User</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </Form.Group>

                  {showUserId && (
                    <Form.Group controlId="userId" className="col-lg-6 mb-4">
                      <label htmlFor="userId" className="form-label">
                        Select Users<span className="text-danger">*</span>
                      </label>
                      <Select
                        id="userId"
                        isMulti
                        options={userList}
                        onChange={(selectedOptions) => {
                          const userIds = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                          setFieldValue('userId', userIds);
                        }}
                        classNamePrefix="react-select"
                        placeholder="Select Users"
                        className={touched.userId && errors.userId ? 'is-invalid' : ''}
                      />
                      <ErrorMessage name="userId" component="div" className="text-danger" />
                    </Form.Group>
                  )}

                  <Form.Group className="col-lg-6 col-sm-6 mb-3" controlId="title">
                    <Form.Label>Title<span className="text-danger">*</span></Form.Label>
                    <Field 
                      name="title" 
                      type="text" 
                      placeholder="Title" 
                      className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="title" component="div" className="text-danger" />
                  </Form.Group>

                  <Form.Group className="col-lg-6 col-sm-6 mb-3" controlId="message">
                    <Form.Label>Description<span className="text-danger">*</span></Form.Label>
                    <Field 
                      name="message" 
                      as="textarea" 
                      rows={4} 
                      placeholder="Description" 
                      className={`form-control ${touched.message && errors.message ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="message" component="div" className="text-danger" />
                  </Form.Group>

                  <div className="text-start">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default CreateNotification;
