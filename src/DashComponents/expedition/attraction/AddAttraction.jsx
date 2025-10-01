import React from "react";
import { Breadcrumb, Button, Form, Container, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { addAttraction } from "../../../../services/ExpeditionsApi";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessToast, showFailureToast } from "../../toastsAlert/Alert.jsx";
import * as Yup from 'yup';

const AddExperience = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .min(3, 'Title must be at least 3 characters')
            .max(100, 'Title must not exceed 100 characters'),
        description: Yup.string()
            .required('Description is required')
            .min(10, 'Description must be at least 10 characters'),
        image: Yup.mixed()
            .required('Image is required')
            .test('fileFormat', 'Unsupported file format', value => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            })
    });

    const initialValues = {
        title: "",
        description: "",
        image: null,
    };

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.image) {
                formData.append("image", values.image);
            }

            const response = await addAttraction(formData);

            if (response?.status) {
                showSuccessToast("Attraction Added Successfully");
                navigate("/expeditions/attraction");
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            showFailureToast("Failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="mt-4">
            {/* Breadcrumbs */}
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/expeditions/attraction">Attraction</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Add Attraction</Breadcrumb.Item>
            </Breadcrumb>

            {/* Form */}
            <div className="card">
                <div className="card-header">
                    <Row className="mb-0 align-items-center">
                        <Col>
                            <h5>Add Attraction</h5>
                        </Col>
                    </Row>
                </div>

                <div className="card-body">
                    <Formik 
                        initialValues={initialValues} 
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({ setFieldValue, isSubmitting, touched, errors }) => (
                            <FormikForm className="row">
                                <FormGroup className="col-lg-6 mb-3">
                                    <FormLabel>Title<span className="text-danger">*</span></FormLabel>
                                    <Field 
                                        name="title" 
                                        type="text" 
                                        className={`form-control ${touched.title && errors.title ? 'is-invalid' : ''}`}
                                        placeholder="Enter title" 
                                    />
                                    <ErrorMessage name="title" component="div" className="text-danger" />
                                </FormGroup>

                                <FormGroup className="col-lg-6 mb-3">
                                    <FormLabel>Description<span className="text-danger">*</span></FormLabel>
                                    <Field 
                                        as="textarea" 
                                        name="description" 
                                        className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                                        placeholder="Enter Description" 
                                    />
                                    <ErrorMessage name="description" component="div" className="text-danger" />
                                </FormGroup>

                                <FormGroup className="col-lg-12 mb-3">
                                    <FormLabel>Image<span className="text-danger">*</span></FormLabel>
                                    <input
                                        name="image"
                                        type="file"
                                        className={`form-control ${touched.image && errors.image ? 'is-invalid' : ''}`}
                                        onChange={(e) => setFieldValue("image", e.target.files[0])}
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                    <ErrorMessage name="image" component="div" className="text-danger" />
                                </FormGroup>

                                <div className="col-lg-12">
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        className="mt-1 w-auto" 
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
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

export default AddExperience;