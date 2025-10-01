import React, { useEffect, useState } from 'react';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import { Button, Container } from 'react-bootstrap';
import ReactQuill from 'react-quill'; // Using ReactQuill instead of RichTextEditor
import { getCaseStudyById, UpdateCaseStudy } from '../../../services/CaseStudtApi.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const PageInformationForm = () => {
  const Navigate = useNavigate();
  const params = useParams();
  const id = params.id;

  const [editorValue, setEditorValue] = useState('');
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await getCaseStudyById(id);
    setData(res?.data?.data);
    setEditorValue(res?.data?.data?.description);
  };

  const initialValues = {
    title: data?.title || '',
    slug: data?.slug || '',
    description: editorValue || '',
    banner: null,
    featured: data?.featured || 'true',
    status: data?.status || 'true'

    // setEditorValue(data?.description);
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append('title', values?.title);
    formData.append('slug', values?.slug);
    formData.append('description', editorValue);
    // formData.append('banner', values?.banner);
    if (values?.banner) {
      formData.append('banner', values.banner);
    }
    formData.append('featured', values?.featured);
    formData.append('status', values?.status);

    try {
      if (id) {
        const updateResponse = await UpdateCaseStudy(id, formData);
        if (updateResponse?.status) {
          resetForm(formData);
          Navigate('/case-Study');
          showSuccessToast('Editing Successfull');
        }
      }
    } catch (error) {
      console.error('Error creating/updating blog:', error);
    }
  };
  useEffect(() => {
    if (id) {
      getData(id);
    }
    if (data?.description) {
      setEditorValue(data.description);
    }
  }, [id]);

  return (
    <Container className="mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Edit Case Study</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {({ setFieldValue, isSubmitting, values }) => (
              <FormikForm className="row">
                {/* Title */}
                <div className="form-group col-lg-6 mb-3 ">
                  <label htmlFor="title">
                    Title<span className="text-danger">*</span>
                  </label>
                  <Field type="text" name="title" className="form-control" placeholder="Enter title" />
                  <ErrorMessage name="title" component="div" className="text-danger" />
                </div>

                {/* Slug */}
                <div className="form-group col-lg-6 mb-3">
                  <label htmlFor="slug">
                    Slug<span className="text-danger">*</span>
                  </label>
                  <Field type="text" name="slug" className="form-control" placeholder="Enter slug" />
                  <ErrorMessage name="slug" component="div" className="text-danger" />
                </div>

                {/* Description */}
                <div className="form-group col-lg-6 mb-3">
                  <label htmlFor="description">
                    Description<span className="text-danger">*</span>
                  </label>
                  <div style={{ border: '1px solid #ced4da', borderRadius: '4px' }}>
                    <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Enter description" />
                  </div>
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </div>

                {/* Image Upload */}
                <div className="form-group col-lg-6 mb-3">
                  <label htmlFor="banner">
                    Banner Image<span className="text-danger">*</span>
                  </label>
                  <div className="w-25">
                    <img src={values.banner&&URL.createObjectURL(values?.banner) || `${import.meta.env.VITE_APP_IMG_URL}/${data?.banner}`} alt="blog" className="img-fluid" />
                  </div>
                  <input
                    type="file"
                    name="banner"
                    className="form-control"
                    onChange={(event) => {
                      const file = event.target.files[0];
                      setFieldValue('banner', file);
                    }}
                  />
                  <ErrorMessage name="banner" component="div" className="text-danger" />
                </div>

                {/* Featured Case Study */}
                <div className="form-group col-lg-6 mb-3">
                  <label htmlFor="featuredCaseStudy">
                    Featured Case Study<span className="text-danger">*</span>
                  </label>
                  <Field as="select" name="featured" className="form-control">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Field>
                  <ErrorMessage name="featured" component="div" className="text-danger" />
                </div>

                {/* Status */}
                <div className="form-group col-lg-6 mb-3">
                  <label htmlFor="status">
                    Status<span className="text-danger">*</span>
                  </label>
                  <Field as="select" name="status" className="form-control">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="text-danger" />
                </div>

                {/* Submit Button */}
                <div className="col-lg-12">
                  <Button variant="primary" type="submit" className="mt-2 w-auto" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
};

export default PageInformationForm;
