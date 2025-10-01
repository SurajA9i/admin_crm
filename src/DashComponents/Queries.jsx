import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Breadcrumb, InputGroup, FormControl, Pagination } from 'react-bootstrap';
import { FetchQueries } from '../../services/QueriesApi';
import { Link } from 'react-router-dom';

const Queries = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10
  });

  const updateState = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value
    }));
  };
  // Fetch queries data
  const getData = async () => {
    try {
      const res = await FetchQueries(state);
      setData(res?.data?.data?.result);
      setTotalPages(res?.data?.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      getData();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [state.page, state.limit, state.search]);

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Queries</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        {/* Header and Search */}
        <Card.Header>
          <Row className=" align-items-center">
            <Col>
              <h5>User Queries </h5>
            </Col>
            <Col>
              <InputGroup>
                <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
              </InputGroup>
            </Col>
          </Row>
        </Card.Header>
        {/* Table */}
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                {/* <th>Phone No.</th> */}
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.map((query, index) => (
                <tr key={query._id}>
                  <th scope="row">{(state.page - 1) * state.limit + index + 1}</th>
                  <td>{query.name}</td>
                  <td>{query.contact}</td>
                  {/* <td>{query.phone}</td> */}
                  <td>{query.message}</td>
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
              <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => setState({ ...state, page: index + 1 })}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </Card>
    </>
  );
};

export default Queries;
