import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Breadcrumb, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { FetchApplication } from '../../services/ApplicationApi';
import { Link } from 'react-router-dom';
import { ImgUrl } from '../../utils/Constant';

const Queries = () => {
  // State for queries data and search/pagination
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Dynamic state update function
  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };

  const getData = async () => {
    try {
      const res = await FetchApplication(state);
      setData(res?.data?.data?.result || []);
      setTotalPages(res?.data?.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleSearch = (e) => {
    updateState('search', e.target.value);
    updateState('page', 1); // Reset to first page on new search
  };

  // Handle page change
  const handlePageChange = (page) => {
    updateState('page', page);
  };

  const handleResumeDownload = async (resume) => {
    const resumeUrl = `${ImgUrl}${resume}`;
    try {
      // Fetch the file
      const response = await fetch(resumeUrl);
      const blob = await response.blob();

      // Create a temporary URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to release memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 300);
    return () => clearTimeout(timer);
  }, [state.search, state.page, state.limit]);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Applications</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
        <div className="card-header">
          {/* Header and Search */}
          <Row className="align-items-center">
            <Col>
              <h5>Applications</h5>
            </Col>
            <Col>
              <InputGroup>
                <FormControl placeholder="Search" value={state.search} onChange={handleSearch} />
              </InputGroup>
            </Col>
          </Row>
        </div>
        <div className="card-body">
          {/* Table */}
          <Card.Body>
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone No.</th>
                  <th>Position Applied For</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {data.map((query, index) => (
                  <tr key={query._id}>
                    <th scope="row">{(state.page - 1) * state.limit + index + 1}</th>
                    <td>{query.name}</td>
                    <td>{query.email}</td>
                    <td>{query.phone}</td>
                    <td>{query.position}</td>
                    <td onClick={() => handleResumeDownload(query.resume)}>
                      <Link href={query.resume}>Resume</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>

          {/* Pagination */}
          <div className="d-flex justify-content-between p-3">
            <div>
              Showing {data.length} of {totalPages * state.limit} entries
            </div>
            <Pagination>
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Queries;
