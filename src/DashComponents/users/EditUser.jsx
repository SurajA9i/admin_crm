import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import side from '../../assets/images/sidebar.png';
import { UserCreate, UpdateUser, getUserById } from '../../../services/UserApi.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';

const EditUser = () => {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null); // Changed from [] to null for better type handling
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // side
  const [imgView, setImgView] = useState(null);
  const [apiImage, setApiImage] = useState(null); // Image fetched from the API

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     setSelectedImage(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // Save the selected file
      setPreviewImage(URL.createObjectURL(file)); // Set the preview image
    }
  };

  const fetchUserData = async () => {
    try {
      if (id) {
        const response = await getUserById(id);
        setUserData(response?.data?.data || {});
        // setPreviewImage(response?.data?.data?.image);
        setImgView(response?.data?.data?.image);
        const apiImageData = response?.data?.data?.image || null;
        setApiImage(apiImageData); // Set the API image
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true, // Allow reinitializing form values when `userData` updates
    initialValues: {
      name: userData?.name || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      image: userData?.image || null,
      // password: '',
      // confirmPassword: ''
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('phone', values.phone);
      formData.append('email', values.email);
      // if (values.password) formData.append('password', values.password); // Only append if password is provided
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      try {
        if (id) {
          const updateResponse = await UpdateUser(id, formData);
          if (updateResponse?.status) {
            navigate('/user-management/users');
            resetForm();
            showSuccessToast(updateResponse?.data?.message);
            // showSuccessToast('Editing Successfull');
          }
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  });

  return (
    <Row>
      <Col sm={12}>
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body center_file">
                <div className="input_browse">
                  <div>
                    <i class="fa fa-camera" aria-hidden="true"></i>
                    <p class="choose-file">Choose File</p>
                  </div>
                  <input type="file" onChange={handleImageChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <div className="img_browse">
                  {previewImage ? (
                    <img src={previewImage} className="img-fluid" alt="Selected Preview" />
                  ) : apiImage ? (
                    <img src={`${ImgUrl}${apiImage}`} className="img-fluid" alt="API Preview" />
                  ) : (
                    <p>No image available</p>
                  )}

                  {/* {previewImage && <img src={`${ImgUrl}${previewImage}`} className=" img-fluid " alt="Preview" />}

                  {!previewImage && <img src={`${ImgUrl}${imgView}`} className=" img-fluid " alt="Preview" />} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <Card.Header>
            <Card.Title as="h5">Edit User</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Form.Group className="col-md-6 mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3" controlId="formBasicMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="number"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </Form.Group>

                {/* <Form.Group className="col-md-6 mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                </Form.Group> */}

                {/* <Form.Group className="col-md-6 mb-3" controlId="formBasicConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  />
                </Form.Group> */}
                <div className="col-md-12">
                  <Button variant="primary w-auto" type="submit">
                    Submit
                  </Button>
                </div>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EditUser;
