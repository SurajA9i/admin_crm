import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm } from 'formik';
import { createBudget, createBudgetFormField } from '../../../services/UserSurveyApi';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const CatagoryCreate = () => {
  const initialValues = {
    // max_default_value: '',
    // max_default_value: '',

    // min_range: '',
    // max_range: '',
    // default_value: '',
    option: []
  };

  // const handleSubmit = async (values, { resetForm }) => {
  //   // const res = await createBudget(values);
  //   if (res?.status) {
  //     showSuccessToast('Budget Range Created');
  //     resetForm(values);
  //   }
  // };
  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      option: [
        values.min_range ? Number(values.min_range) : 0,
        values.max_range ? Number(values.max_range) : 0,
        values.default_value ? Number(values.default_value) : 0,
      ],
    };

    const res = await createBudgetFormField(payload);
    if (res?.status) {
      showSuccessToast('Budget Range Created');
      resetForm();
    }
  }
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Budget Range</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values, handleChange, handleBlur }) => (
              <FormikForm>
                <div className="row">
                  <div className="col-lg-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Min Range: <span className="text-danger">*</span>
                      </Form.Label>
                      <Field type="text" name="min_range" placeholder="Enter minimum range" className="form-control" />
                    </Form.Group>
                  </div>

                  <div className="col-lg-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Max Range: <span className="text-danger">*</span>
                      </Form.Label>
                      <Field type="text" name="max_range" placeholder="Enter maximum range" className="form-control" />
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Default Value: <span className="text-danger">*</span>
                      </Form.Label>
                      <Field type="text" name="default_value" placeholder="Enter default value" className="form-control" />
                    </Form.Group>
                  </div>
                  {/* <div className="col-lg-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Min Default Value: <span className="text-danger">*</span>
                      </Form.Label>
                      <Field type="text" name="max_default_value" placeholder="Enter minimum default value" className="form-control" />
                    </Form.Group>
                  </div>

                  <div className="col-lg-6">
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Max Default Value: <span className="text-danger">*</span>
                      </Form.Label>
                      <Field type="text" name="max_default_value" placeholder="Enter maximum default value" className="form-control" />
                    </Form.Group>
                  </div> */}

                  <div className="text-end">
                    <Button variant="secondary" className="me-2" type="button">
                      Close
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Form
                    </Button>
                  </div>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CatagoryCreate;
