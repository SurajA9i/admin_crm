import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Table, Button, Breadcrumb, Pagination } from 'react-bootstrap';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { FetchPages } from '../../../services/PagesApi';
import { deletePage } from '../../../services/PagesApi';

const Pages = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });
  const [pageData, setPageData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const getData = async () => {
    const res = await FetchPages(state);
    if (res?.status) {
      setPageData(res?.data?.data?.result);
      setTotalPages(res?.data?.data?.totalPages || 1);
    }
  };
  const handleDelete = async (id) => {
    const res = await deletePage(id);
    if (res?.status) {
      showSuccessToast('Page Deleted Successfully');
      getData();
    }
  };
  useEffect(() => {
    getData();
  }, [state?.page]);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>All Pages</Breadcrumb.Item>
      </Breadcrumb>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Header as="h5" className="text-black d-flex justify-content-between align-items-center">
              <h5>All Pages</h5>
              <Button className="m-0" variant="success" onClick={() => navigate('/pages/add-page')}>
                Add Page
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive bordered hover>
                <thead className="">
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Type</th>
                    <th className="">Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData?.map((page, index) => (
                    <tr key={page.id}>
                      <td>{index + 1}</td>
                      <td>{page.title}</td>
                      <td>{page.slug}</td>
                      <td>{page.type}</td>
                      <td>{<TruncatedText text={page.description && StripTag(page.description)} />}</td>

                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            navigate(`/pages/edit-page/${page?._id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="me-2"
                          onClick={(_id) => {
                            deleteConfirmation(() => handleDelete(page?._id));
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {pageData?.length > 0 && (
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    Showing {pageData?.length} of {(state?.page - 1) * state?.limit + pageData?.length} entries
                  </div>
                  <Pagination>
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item key={index + 1} active={index + 1 === state?.page} onClick={() => updateState('page', index + 1)}>
                        {index + 1}
                      </Pagination.Item>
                    ))}
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Pages;
