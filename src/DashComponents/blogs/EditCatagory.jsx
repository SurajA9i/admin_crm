import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { getCategoryById, UpdateCategory } from '../../../services/BlogPost.jsx';
import { useParams } from 'react-router-dom';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';
import { useNavigate } from 'react-router-dom';

const EditCategoryForm = () => {
  const [data, setData] = useState(null);
  const params = useParams();
  const Navigate = useNavigate();
  const id = params.id;

  const getData = async () => {
    try {
      const res = await getCategoryById(id);
      setData(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial values
  const initialValues = {
    name: data?.name || '',
    slug: data?.slug || 'slug',
    status: data?.status || 'true'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await UpdateCategory(id, values);
      if (res?.status) {
        showSuccessToast('Successfully Edited');
        Navigate('/blogs/create-blog');
      }
    } catch (error) {
      console.log(error, 'errors');
    }

    setSubmitting(false); // Stop submission spinner
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Blog Category Information</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {({ values, setFieldValue, isSubmitting }) => (
              <FormikForm className="row">
                {/* Name Field */}
                <Form.Group className="col-lg-6 mb-3" controlId="formName">
                  <Form.Label>
                    Name: <span className="text-danger">*</span>
                  </Form.Label>
                  <Field name="name" type="text" placeholder="Enter category name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </Form.Group>

                {/* Slug Field */}
                <Form.Group className="col-lg-6 mb-3" controlId="formSlug">
                  <Form.Label>
                    Slug: <span className="text-danger">*</span>
                  </Form.Label>
                  <Field
                    name="slug"
                    type="text"
                    placeholder="Slug will be auto-generated"
                    className="form-control"
                    value={values.name.toLowerCase().replace(/\s+/g, '-')} // Auto-generate slug
                    disabled
                  />
                </Form.Group>

                {/* Status Field */}
                <Form.Group className="col-lg-6 mb-3" controlId="formStatus">
                  <Form.Label>
                    Status: <span className="text-danger">*</span>
                  </Form.Label>
                  <Field as="select" name="status" className="form-select">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </Form.Group>

                {/* Submit Button */}
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
  );
};

export default EditCategoryForm;
