import React, { useEffect, useState } from 'react';
import { Form, Button, Breadcrumb } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import { FetchSocialLinks, UpdateSocialLinks } from '../../../services/SocialLinksApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';

const SocialLinks = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const Navigate = useNavigate();
  const response = async () => {
    const res = await FetchSocialLinks();
    setData(res?.data?.data);
    setId(res?.data?.data?._id);
  };
  const initialValues = {
    linkedin: data?.linkedin || '',
    twitter: data?.twitter || '',
    facebook: data?.facebook || '',
    instagram: data?.instagram || ''
  };

  const handleSubmit = async (values) => {
    try {
      const res = await UpdateSocialLinks(id, values);
      if (res?.status) {
        Navigate('/social-links');
        showSuccessToast('Links Updated Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    response();
  }, []);

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/social-links">Social Links</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit Social Links</Breadcrumb.Item>
      </Breadcrumb>
      <h4>Social Links</h4>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
        {() => (
          <FormikForm className="p-4 border rounded">
            {/* LinkedIn Field */}
            <Form.Group className="mb-3" controlId="linkedin">
              <Form.Label>
                LinkedIn: <span className="text-danger">*</span>
              </Form.Label>
              <Field type="text" name="linkedin" placeholder="Enter LinkedIn URL" className="form-control" />
            </Form.Group>

            {/* Twitter Field */}
            <Form.Group className="mb-3" controlId="twitter">
              <Form.Label>
                Twitter: <span className="text-danger">*</span>
              </Form.Label>
              <Field type="text" name="twitter" placeholder="Enter Twitter URL" className="form-control" />
            </Form.Group>

            {/* Facebook Field */}
            <Form.Group className="mb-3" controlId="facebook">
              <Form.Label>
                Facebook: <span className="text-danger">*</span>
              </Form.Label>
              <Field type="text" name="facebook" placeholder="Enter Facebook URL" className="form-control" />
            </Form.Group>

            {/* Instagram Field */}
            <Form.Group className="mb-3" controlId="instagram">
              <Form.Label>
                Instagram: <span className="text-danger">*</span>
              </Form.Label>
              <Field type="text" name="instagram" placeholder="Enter Instagram URL" className="form-control" />
            </Form.Group>

            {/* Submit Buttons */}
            <div className="text-center">
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default SocialLinks;
