import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Formik, FieldArray, Form as FormikForm, Field } from 'formik';
import { UpdateOpening, getOpeningById } from '../../../services/OpeningApi';
import { useNavigate, useParams } from 'react-router-dom';
import { showSuccessToast, showFailureToast } from '../toastsAlert/Alert.jsx';

const EditOpeningForm = () => {
  const Navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState([]);

  const response = async () => {
    const res = await getOpeningById(id);
    setData(res?.data?.data);
  };

  const initialValues = {
    title: data?.title || '',
    description: data?.description || '',
    perks: data?.perks || [''],
    experience: data?.experience || '',
    // expiry: data?.expiry || '',
    expiry: data?.expiry ? new Date(data.expiry).toISOString().split('T')[0] : '',

    department: data?.department || '',
    active: data?.active || 'true'
  };
  const handleSubmit = async (values) => {
    const res = await UpdateOpening(id, values);
    if (res?.status) {
      Navigate('/current-openings');
      showSuccessToast('Successfully Edited');
    }
  };
  useEffect(() => {
    if (id) {
      response();
    }
  }, [id]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values }) => (
        <FormikForm className="container mt-4">
          <h4>Edit Job Opening</h4>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Field name="title" className="form-control" placeholder="Enter Title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Field as="textarea" name="description" className="form-control" placeholder="Enter Description" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Field name="department" className="form-control" placeholder="Enter Description" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Expiry</Form.Label>
            <Field name="expiry" className="form-control" type="date" placeholder="Select expiry date" />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Experience</Form.Label>
            <Field name="experience" className="form-control" placeholder="Enter Description" />
          </Form.Group> */}

          <Form.Group className="mb-3">
            <Form.Label>Experience</Form.Label>
            <FieldArray name="perks">
              {({ push, remove }) => (
                <>
                  {values.perks.map((perk, index) => (
                    <Row key={index} className="mb-2">
                      <Col>
                        <Field name={`perks.${index}`} className="form-control" placeholder="Enter Perk" />
                      </Col>
                      <Col xs="auto">
                        {index > 0 && (
                          <Button variant="danger" onClick={() => remove(index)}>
                            Remove
                          </Button>
                        )}
                      </Col>
                    </Row>
                  ))}
                  <Button variant="success btn btn-outline" onClick={() => push('')} className="mt-2">
                    Add New Perk
                  </Button>
                </>
              )}
            </FieldArray>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publish</Form.Label>
            <Field as="select" name="active" className="form-control">
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Field>
          </Form.Group>

          <div className="text-end">
            <Button className="success" type="submit" variant="primary">
              Save
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default EditOpeningForm;
