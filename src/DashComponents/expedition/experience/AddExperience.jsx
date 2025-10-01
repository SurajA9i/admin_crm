// import React from 'react';
// import { Breadcrumb, Button, Form, Container, Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
// import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
// import { addExperience } from '../../../../services/ExpeditionsApi';

// import { Link, useNavigate } from 'react-router-dom';
// import { showSuccessToast, showFailureToast } from '../../toastsAlert/Alert.jsx';

// const AddExperience = () => {
//     const navigate = useNavigate();
//     const initialValues = {
//         title: '',
//         description: '',
//         image: null
//     };

//     const onSubmit = async (e,values, { setSubmitting, resetForm }) => {
//         e.preventDefault();
//         console.log(values,"ooo")
//         try {
//             const formData = new FormData();
//             formData.append("title", values.title);
//             formData.append("description", values.description);
//             if (values.image) {
//                 formData.append("image", values.image);
//             }
//             const response = await addExperience(values);
//             if (response?.status) {
//                 showSuccessToast('Experience Added Successfully');
//                 navigate('/expeditions/wildlife-experience');
//                 // Reset form after successful submission
//                 resetForm();
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             showFailureToast('Failed');
//         } finally {
//             setSubmitting(false);
//         }
//     };
//     return (
//         <Container className="mt-4">
//             {/* Breadcrumbs */}
//             <Breadcrumb>
//                 <Breadcrumb.Item>
//                     <Link to="/admin/dashboard">Dashboard</Link>
//                 </Breadcrumb.Item>
//                 <Breadcrumb.Item>
//                     <Link to="/expeditions/wildlife-experience">Experience</Link>
//                 </Breadcrumb.Item>
//                 <Breadcrumb.Item active>Add Experience</Breadcrumb.Item>
//             </Breadcrumb>

//             {/* Form */}
//             <div className="card">
//                 <div className="card-header">
//                     <Row className="mb-0 align-items-center">
//                         <Col>
//                             <h5>Add Experience</h5>
//                         </Col>
//                     </Row>
//                 </div>

//                 <div className="card-body">
//                     <Formik initialValues={initialValues} onSubmit={onSubmit}>
//                         {({ setFieldValue, isSubmitting }) => (
//                             <div className="card">
//                                 <div className="card-body">
//                                     <Form className="row">
//                                         <FormGroup className="col-lg-6 mb-3">
//                                             <FormLabel>Title</FormLabel>
//                                             <Field name="title" type="text" className="form-control" placeholder="Enter title" />
//                                             <ErrorMessage name="title" component="div" className="text-danger" />
//                                         </FormGroup>

//                                         <FormGroup className="col-lg-6 mb-3">
//                                             <FormLabel>Description</FormLabel>
//                                             <Field as="textarea" name="description" className="form-control" placeholder="Enter Description" />
//                                             <ErrorMessage name="description" component="div" className="text-danger" />
//                                         </FormGroup>

//                                         <FormGroup className="col-lg-12 mb-3">
//                                             <FormLabel>Image</FormLabel>
//                                             <input
//                                                 name="image"
//                                                 type="file"
//                                                 className="form-control"
//                                                 onChange={(e) => setFieldValue("image", e.target.files[0])}
//                                             />
//                                         </FormGroup>

//                                         <div className="col-lg-12">
//                                             <Button type="submit" variant="primary" className="mt-1 w-auto" disabled={isSubmitting}>
//                                                 {isSubmitting ? "Submitting..." : "Submit"}
//                                             </Button>
//                                         </div>
//                                     </Form>
//                                 </div>
//                             </div>
//                         )}
//                     </Formik>
//                 </div>
//             </div>
//         </Container>
//     );
// };

// export default AddExperience;
import React from "react";
import { Breadcrumb, Button, Form, Container, Row, Col, FormGroup, FormLabel } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import { addExperience } from "../../../../services/ExpeditionsApi";
import { Link, useNavigate } from "react-router-dom";
import { showSuccessToast, showFailureToast } from "../../toastsAlert/Alert.jsx";

const AddExperience = () => {
  const navigate = useNavigate();
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

      const response = await addExperience(formData); // Use formData here

      if (response?.status) {
        showSuccessToast("Experience Added Successfully");
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
        <Breadcrumb.Item active>Add Experience</Breadcrumb.Item>
      </Breadcrumb>

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Add Experience</h5>
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
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
                  <input
                    name="image"
                    type="file"
                    className="form-control"
                    onChange={(e) => setFieldValue("image", e.target.files[0])}
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
        </div>
      </div>
    </Container>
  );
};

export default AddExperience;
