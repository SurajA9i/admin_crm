import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Form, Container, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { updateExperienceById, getExperienceById } from "../../../../services/ExpeditionsApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showSuccessToast, showFailureToast } from "../../toastsAlert/Alert.jsx";
import { ImgUrl } from '../../../../utils/Constant';

const EditExperience = () => {
    const navigate = useNavigate();
    const params = useParams();
    const id = params.id;

    const [idData, setIdData] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // For selected image preview

    const fetchExperienceById = async () => {
        try {
            const response = await getExperienceById(id);
            setIdData(response?.data?.data);
            setImagePreview(response?.data?.data?.image); // Set initial image preview
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.image) {
                formData.append("image", values.image);
            }

            const response = await updateExperienceById(id, formData);

            if (response?.status) {
                showSuccessToast("Experience Updated Successfully");
                navigate("/expeditions/wildlife-experience");
                resetForm();
            }
        } catch (error) {
            console.error("Error:", error);
            showFailureToast("Failed");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchExperienceById();
    }, []);

    return (
        <Container className="mt-4">
            {/* Breadcrumbs */}
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/admin/dashboard">Dashboard</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/expeditions/wildlife-experience">Experience</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Edit Experience</Breadcrumb.Item>
            </Breadcrumb>

            {/* Form */}
            <div className="card">
                <div className="card-header">
                    <Row className="mb-0 align-items-center">
                        <Col>
                            <h5>Edit Experience</h5>
                        </Col>
                    </Row>
                </div>

                <div className="card-body">
                    {idData && (
                        <Formik
                            initialValues={{
                                title: idData.title,
                                description: idData.description,
                                image: null,
                            }}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({ setFieldValue, isSubmitting }) => (
                                <FormikForm className="row">
                                    <FormGroup className="col-lg-6 mb-3">
                                        <FormLabel>Title</FormLabel>
                                        <Field name="title" type="text" className="form-control" placeholder="Enter title" />
                                        <ErrorMessage name="title" component="div" className="text-danger" />
                                    </FormGroup>

                                    <FormGroup className="col-lg-6 mb-3">
                                        <FormLabel>Description</FormLabel>
                                        <Field as="textarea" name="description" className="form-control" placeholder="Enter Description" />
                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                    </FormGroup>

                                    <FormGroup className="col-lg-12 mb-3">
                                        <FormLabel>Image</FormLabel>
                                        {/* Show Existing Image */}
                                        {imagePreview && (
                                            <div className="mb-3">
                                                <img src={`${ImgUrl}${imagePreview}`} alt="Preview" style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                                            </div>
                                        )}

                                        <input
                                            name="image"
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                setFieldValue("image", file);
                                                setImagePreview(file ? URL.createObjectURL(file) : idData.image);
                                            }}
                                        />
                                    </FormGroup>

                                    <div className="col-lg-12">
                                        <Button type="submit" variant="primary" className="mt-1 w-auto" disabled={isSubmitting}>
                                            {isSubmitting ? "Submitting..." : "Submit"}
                                        </Button>
                                    </div>
                                </FormikForm>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default EditExperience;

