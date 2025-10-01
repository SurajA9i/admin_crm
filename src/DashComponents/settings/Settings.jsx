import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import { FetchSetting, UpdateSetting } from '../../../services/SettingApi';
import { ImgUrl } from '../../../utils/Constant';
import { showSuccessToast } from '../toastsAlert/Alert.jsx';

function WebsiteSetting() {
  const [data, setData] = useState([]);

  const getData = async () => {
    const res = await FetchSetting();
    setData(res?.data?.data, 'data');
  };
  const initialValues = {
    title: data?.title || '',
    logo_dark: data?.logo_dark || null,
    logo_light: data?.logo_light || null,
    logo_small: data?.logo_small || null,
    logo_favicon: data?.logo_favicon || null
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('logo_dark', values.logo_dark);
    formData.append('logo_light', values.logo_light);
    formData.append('logo_small', values.logo_small);
    formData.append('logo_favicon', values.logo_favicon);

    try {
      const res = await UpdateSetting(formData);
      if (res?.status) {
        showSuccessToast('Logo Changed Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Container className="mt-4 ">
      <div className="card">
        <div className="card-header">
          <h5>Website Setting</h5>
        </div>
        <div className="card-body">
          <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
            {({ values, handleChange, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                {/* Website Title */}
                <Form.Group controlId="title" className="mb-4">
                  <Form.Label>Website Title: *</Form.Label>
                  <Form.Control type="text" name="title" placeholder="Enter Website Title" value={values.title} onChange={handleChange} />
                </Form.Group>

                <Row>
                  {/* Website Logo Dark */}
                  <Col md={6} lg={3} className="">
                    <Card className="p-3 text-center logo_card">
                      <Card.Title>Website Logo Dark: *</Card.Title>
                      <div className="img_dark">
                        <i class="fas fa-image"></i>
                        {values.logo_dark &&
                          (typeof values.logo_dark === 'object' ? (
                            <img src={URL.createObjectURL(values.logo_dark)} alt="Website Logo Dark" className="img-fluid mb-3" />
                          ) : (
                            <img src={`${ImgUrl}${values.logo_dark}`} alt="Website Logo Dark" className="img-fluid" />
                          ))}
                      </div>
                      <Form.Group controlId="logo_dark">
                        <Form.Label className="btn btn-secondary mb-2 theme_bg w-100">Upload Logo Image</Form.Label>
                        <Form.Control
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => setFieldValue('logo_dark', e.target.files[0])}
                        />
                      </Form.Group>
                      <Button variant="secondary org_bg w-100">Change Logo Image</Button>
                    </Card>
                  </Col>

                  {/* Website Logo Light */}
                  <Col md={6} lg={3} className="">
                    <Card className="p-3 text-center logo_card">
                      <Card.Title>Website Logo Light: *</Card.Title>
                      <div className="img_dark">
                        <i class="fas fa-image"></i>
                        {values.logo_light &&
                          (typeof values.logo_light === 'object' ? (
                            <img src={URL.createObjectURL(values.logo_light)} alt="Website Logo Dark" className="img-fluid mb-3" />
                          ) : (
                            <img src={`${ImgUrl}${values.logo_light}`} alt="Website Logo Dark" className="img-fluid" />
                          ))}
                      </div>
                      <Form.Group controlId="logo_light">
                        <Form.Label className="btn btn-secondary mb-2 theme_bg w-100">Upload Logo Image</Form.Label>
                        <Form.Control
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => setFieldValue('logo_light', e.target.files[0])}
                        />
                      </Form.Group>
                      <Button variant="secondary org_bg w-100">Change Logo Image</Button>
                    </Card>
                  </Col>

                  {/* Website Logo Small */}
                  <Col md={6} lg={3} className="">
                    <Card className="p-3 text-center logo_card">
                      <Card.Title>Website Logo Small: *</Card.Title>
                      <div className="img_dark">
                        <i class="fas fa-image"></i>

                        {values.logo_small &&
                          (typeof values.logo_small === 'object' ? (
                            <img src={URL.createObjectURL(values.logo_small)} alt="Website Logo Dark" className="img-fluid mb-3" />
                          ) : (
                            <img src={`${ImgUrl}${values.logo_small}`} alt="Website Logo Dark" className="img-fluid" />
                          ))}
                      </div>
                      <Form.Group controlId="logo_small">
                        <Form.Label className="btn btn-secondary mb-2 theme_bg w-100">Upload Small Logo Image</Form.Label>
                        <Form.Control
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => setFieldValue('logo_small', e.target.files[0])}
                        />
                      </Form.Group>
                      <Button variant="secondary org_bg w-100">Change Small Logo Image</Button>
                    </Card>
                  </Col>

                  {/* Website Favicon */}
                  <Col md={6} lg={3} className="">
                    <Card className="p-3 text-center logo_card">
                      <Card.Title>Website Favicon: *</Card.Title>
                      <div className="img_dark">
                        <i class="fas fa-image"></i>
                        {values.logo_favicon &&
                          (typeof values.logo_favicon === 'object' ? (
                            <img src={URL.createObjectURL(values.logo_favicon)} alt="Website Logo Dark" className="img-fluid mb-3" />
                          ) : (
                            <img src={`${ImgUrl}${values.logo_favicon}`} alt="Website Logo Dark" className="img-fluid mb-3" />
                          ))}
                      </div>
                      <Form.Group controlId="logo_favicon">
                        <Form.Label className="btn btn-secondary mb-2 theme_bg w-100">Upload Favicon Image</Form.Label>
                        <Form.Control
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={(e) => setFieldValue('logo_favicon', e.target.files[0])}
                        />
                      </Form.Group>
                      <Button variant="secondary org_bg w-100">Change Favicon Image</Button>
                    </Card>
                  </Col>
                </Row>

                {/* Update Button */}
                <div className="text-end">
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Container>
  );
}

export default WebsiteSetting;
