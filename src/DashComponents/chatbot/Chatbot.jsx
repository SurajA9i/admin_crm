import React, { useEffect, useState } from 'react';
import { Table, Form, Button, InputGroup, FormControl, Row, Col, Pagination, Breadcrumb, ButtonGroup } from 'react-bootstrap';
import { getAllChatbotMedia, deleteChatbotMedia } from '../../../services/MediaApi';
import { formattedDate } from '../../../utils/Constant';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, deleteConfirmation } from '../toastsAlert/Alert.jsx';
import { ImgUrl } from '../../../utils/Constant';

const Chatbot = () => {
  const navigate = useNavigate();

  const [allMedia, setAllMedia] = useState([]);

  const fetchMedia = async () => {
    try {
      const response = await getAllChatbotMedia();
      if (response?.status) {
        setAllMedia(response?.data?.data);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };
  const handleDelete = async (id) => {
    const deleteResponse = await deleteChatbotMedia(id);
    if (deleteResponse?.status) {
      showSuccessToast('Chatbot Video is Deleted Successfully');
      fetchMedia();
    }
  };
  useEffect(() => {
    fetchMedia();
  }, []);
  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Chatbot</Breadcrumb.Item>
      </Breadcrumb>

      <div className="card">
        <div className="card-header">
          <Row className="mb-0 align-items-center">
            <Col>
              <h5>Chatbot</h5>
            </Col>
            <Col className="text-end">
              {/* <Button variant="success" onClick={() => navigate('/chat-bot/add-chatbot-video')}>
                Add video
              </Button> */}
            </Col>
          </Row>
        </div>

        <div className="card-body">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Title</th>
                <th>Media</th>
                <th>Created At</th>
                <th> Delete</th>
              </tr>
            </thead>
            <tbody>
              {allMedia?.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  {/* <td>{item.video}</td> */}
                  <td>
                    {item.video ? (
                      <>
                        <video width="100" height="100">
                          <source src={`${ImgUrl}${item.video}`} className="media-preview" type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </>
                    ) : (
                      'No Media'
                    )}
                  </td>
                  <td>{formattedDate(item?.createdAt)}</td>
                  <td>
                    <Button
                      style={{ background: '#1e2d27' }}
                      size="sm"
                      onClick={() => navigate(`/chat-bot/edit-chatbot-video/${item._id}`)}
                    >
                      Edit
                    </Button>
                    {/* <Button variant="danger" size="sm" onClick={(_id) => deleteConfirmation(() => handleDelete(item._id))}>
                      Delete
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <div>{/* Showing {allMedia?.length} of {filteredData.length} entries */}</div>
            <Pagination>
              {/* {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                  {page + 1}
                </Pagination.Item>
              ))} */}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
