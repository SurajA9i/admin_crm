import React, { useEffect, useState } from 'react';
import { Form as RouterForm, useNavigate } from 'react-router-dom';
import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
import { formattedDate, ImgUrl } from '../../../../utils/Constant';
import { showSuccessToast, deleteConfirmation } from '../../toastsAlert/Alert.jsx';
import { getAttraction, updateExpeditions, deleteAttraction } from '../../../../services/ExpeditionsApi';
import StripTag from 'config/StripTag';
import TruncatedText from 'common/TruncatedText';
import SkeletonLoader from 'components/Loader/SkeletonLoader';

const Attraction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [state, setState] = useState({
        search: '',
        page: 1,
        limit: 10,
    });

    const [expeditionData, setExpeditionData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const getExpeditions = async () => {
        setLoading(true);

        try {
            const response = await getAttraction();
            if (response?.status) {
                setExpeditionData(response?.data?.data?.result);
                setTotalPages(response?.data?.data?.totalPages || 1);
            }
        } catch (error) {
            console.error('Failed to fetch expeditions:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateState = (key, value) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleDelete = async (id) => {
        const res = await deleteAttraction(id);
        if (res?.status) {
            showSuccessToast('Item deleted successfully!');
            getExpeditions();
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            getExpeditions();
        }, 300);
        return () => clearTimeout(timer);
    }, [state.search, state.page, state.limit, state.category_id]);

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <Row className="mb-0 align-items-center">
                        <Col>
                            <h5>Attraction</h5>
                        </Col>
                        <Col className="text-end">
                            <Button
                                className="mb-0"
                                variant="success"
                                onClick={() => {
                                    navigate('/expeditions/add-attraction');
                                }}
                            >
                                Add Attraction
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div className="card-body">
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="limit">
                                <Form.Label>Show entries</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={state.limit}
                                    onChange={(e) => updateState('limit', Number(e.target.value))}
                                    style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="text-end">
                            <InputGroup>
                                <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
                            </InputGroup>
                        </Col>
                    </Row>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Name</th>
                                <th> Image</th>
                                <th>Date</th>
                                <th>Description</th>

                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ?
                                <SkeletonLoader rows={5} columns={6} /> // Skeleton loader when loading
                                :
                                expeditionData?.length > 0 ?
                                    expeditionData?.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{(state.page - 1) * state.limit + index + 1}</td>
                                            <td>{item.title}</td>
                                            <td> <img src={`${ImgUrl}${item.image}`} alt={item.name} width={50} height={50} /></td>
                                            <td>{item?.createdAt && formattedDate(item.createdAt)}</td>
                                            {/* <td>{item.description && StripTag(item.description)}</td> */}
                                            <td>  <TruncatedText text={item.description && StripTag(item.description)} /></td>

                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => navigate(`/expeditions/edit-attraction/${item._id}`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => deleteConfirmation(() => handleDelete(item._id))}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    )) :
                                    <tr>
                                        <td colSpan={9} className="text-center">
                                            No Record Found
                                        </td>
                                    </tr>}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between">
                        <div>
                            Showing {expeditionData?.length} of {totalPages * state.limit} entries
                        </div>
                        <Pagination>
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attraction;
