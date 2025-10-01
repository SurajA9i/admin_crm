// import React, { useEffect, useState } from 'react';
// import { getAllBookings } from '../../../services/DashBoardApi';
// import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
// // import { Form } from 'react-router-dom';
// import { formattedDate } from '../../../utils/Constant';

// const Bookings = () => {
//   const [state, setState] = useState({
//     search: '',
//     page: 1,
//     limit: 10,
//     category_id: null
//   });
//   const [totalPages, setTotalPages] = useState(1);
//   const [bookingList, setBookingList] = useState([]);

//   const fetchAllBooking = async () => {
//     const response = await getAllBookings(state);
//     if (response?.status) {
//       setBookingList(response?.data?.data?.result);
//       setTotalPages(response?.data?.data.totalPages || 1);
//     }
//   };
//   const updateState = (key, value) => {
//     setState((prevState) => ({
//       ...prevState,
//       [key]: value
//     }));
//   };
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchAllBooking();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [state.search, state.page, state.limit, state.category_id]);

//   return (
//     <div className="container mt-4">
//       <div className="card">
//         <div className="card-header">
//           <Row className="mb-0 align-items-center">
//             <Col>
//               <h5>Bookings</h5>
//             </Col>
//           </Row>
//         </div>
//         <div className="card-body">
//           <Row className="mb-3">
//             <Col>
//               <Form.Group controlId="limit">
//                 <Form.Label>Show entries</Form.Label>
//                 <Form.Control
//                   as="select"
//                   value={state.limit}
//                   onChange={(e) => updateState('limit', Number(e.target.value))}
//                   style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={20}>20</option>
//                   <option value={20}>30</option>
//                 </Form.Control>
//               </Form.Group>
//             </Col>
//             <Col className="text-end">
//               <InputGroup>
//                 <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
//               </InputGroup>
//             </Col>
//           </Row>
//           <Table bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>S.No.</th>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Number of Adults</th>
//                 <th>Number of Children's</th>
//                 <th>Booked Date </th>
//                 <th>Price</th>
//                 {/* <th>Status</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {bookingList?.map((item, index) => (
//                 <tr key={item._id}>
//                   <td>{(state.page - 1) * state.limit + index + 1}</td>
//                   <td>{item.name}</td>
//                   <td>{item.phone}</td>
//                   <td> {item?.adults}</td>
//                   <td> {item?.children}</td>
//                   <td>
//                     {item?.from && formattedDate(item.from)} {' - '} {item?.from && formattedDate(item.to)}
//                   </td>
//                   <td>{item.price}</td>
//                   {/* <td>
//                     <Form.Check
//                       type="switch"
//                       id={`status-switch-${item._id}`}
//                       defaultChecked={item.status}
//                       onChange={(e) => handleStatusToggle(item._id, e)}
//                     />
//                   </td> */}
//                   {/* <td>
//                     <Button
//                       variant="primary"
//                       size="sm"
//                       className="me-2"
//                       onClick={() => navigate(`/jungle-expeditions/edit-expeditions/${item._id}`)}
//                     >
//                       Edit
//                     </Button>
//                     <Button variant="danger" size="sm" onClick={() => deleteConfirmation(() => handleDelete(item._id))}>
//                       Delete
//                     </Button>
//                   </td> */}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <div className="d-flex justify-content-between">
//             <div>
//               Showing {bookingList?.length} of {totalPages * state.limit} entries
//             </div>
//             <Pagination>
//               {[...Array(totalPages)]?.map((_, index) => (
//                 <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
//                   {index + 1}
//                 </Pagination.Item>
//               ))}
//             </Pagination>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Bookings;

// import React, { useEffect, useState } from 'react';
// import { getAllBookings } from '../../../services/DashBoardApi';
// import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table, Modal } from 'react-bootstrap'; // <-- Import Modal
// import { formattedDate } from '../../../utils/Constant';
// import { Link } from 'react-router-dom'; // <-- Import Link for viewing ID proofs

// const Bookings = () => {
//   const [state, setState] = useState({
//     search: '',
//     page: 1,
//     limit: 10,
//   });
//   const [totalPages, setTotalPages] = useState(1);
//   const [bookingList, setBookingList] = useState([]);
  
//   // === NEW STATE FOR THE DETAILS MODAL ===
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const fetchAllBooking = async () => {
//     try {
//         const response = await getAllBookings(state);
//         if (response?.status) {
//           setBookingList(response?.data?.data?.result);
//           setTotalPages(response?.data?.data.totalPages || 1);
//         }
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//     }
//   };

//   const updateState = (key, value) => {
//     setState((prevState) => ({ ...prevState, [key]: value }));
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchAllBooking();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [state.search, state.page, state.limit]);

//   // === NEW FUNCTION TO OPEN THE MODAL ===
//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetailsModal(true);
//   };

//   // === NEW FUNCTION TO CLOSE THE MODAL ===
//   const handleCloseModal = () => {
//     setShowDetailsModal(false);
//     setSelectedBooking(null);
//   };

//   return (
//     <>
//       <div className="container mt-4">
//         <div className="card">
//           <div className="card-header">
//             <Row className="mb-0 align-items-center">
//               <Col><h5>Bookings</h5></Col>
//             </Row>
//           </div>
//           <div className="card-body">
//             <Row className="mb-3">
//               <Col>
//                 <Form.Group controlId="limit">
//                   <Form.Label>Show entries</Form.Label>
//                   <Form.Control as="select" value={state.limit} onChange={(e) => updateState('limit', Number(e.target.value))} style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}>
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={30}>30</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col className="text-end">
//                 <InputGroup>
//                   <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
//                 </InputGroup>
//               </Col>
//             </Row>
//             <Table bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>Name</th>
//                   <th>Phone</th>
//                   <th>Adults</th>
//                   <th>Children</th>
//                   <th>Booked Date</th>
//                   <th>Price</th>
//                   <th>Actions</th> {/* <-- ADDED NEW COLUMN HEADER */}
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookingList?.map((item, index) => (
//                   <tr key={item._id}>
//                     <td>{(state.page - 1) * state.limit + index + 1}</td>
//                     <td>{item.name}</td>
//                     <td>{item.phone}</td>
//                     <td>{item?.adults}</td>
//                     <td>{item?.children}</td>
//                     <td>
//                       {item?.from && formattedDate(item.from)} {' - '} {item?.from && formattedDate(item.to)}
//                     </td>
//                     <td>{item.price}</td>
//                     <td>
//                       {/* Conditionally render the button only if explorer details exist */}
//                       {item.explorers && item.explorers.length > 0 ? (
//                         <Button
//                           variant="info"
//                           size="sm"
//                           onClick={() => handleViewDetails(item)}
//                         >
//                           View Details
//                         </Button>
//                       ) : (
//                         <span className="text-muted">No Details</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="d-flex justify-content-between">
//               <div>
//                 Showing {bookingList?.length} of {totalPages * state.limit} entries
//               </div>
//               <Pagination>
//                 {[...Array(totalPages)]?.map((_, index) => (
//                   <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//               </Pagination>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* === NEW MODAL COMPONENT TO DISPLAY EXPLORER DETAILS === */}
//       {selectedBooking && (
//         <Modal show={showDetailsModal} onHide={handleCloseModal} centered size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>Explorer Details for Booking</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <h6>Primary Contact: {selectedBooking.name}</h6>
//             <Table striped bordered>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Explorer Name</th>
//                   <th>Age</th>
//                   <th>Identity Proof</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedBooking.explorers.map((explorer, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{explorer.name}</td>
//                     <td>{explorer.age}</td>
//                     <td>
//                       <a 
//                         href={`${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="btn btn-sm btn-outline-primary"
//                       >
//                         View ID
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default Bookings;

// import React, { useEffect, useState } from 'react';
// import { getAllBookings } from '../../../services/DashBoardApi';
// import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table, Modal, Badge } from 'react-bootstrap';
// import { formattedDate } from '../../../utils/Constant';
// import DownloadIcon from '../..//assets/images/download_icon.svg';

// const Bookings = () => {
//   const [state, setState] = useState({
//     search: '',
//     page: 1,
//     limit: 10,
//   });
//   const [totalPages, setTotalPages] = useState(1);
//   const [bookingList, setBookingList] = useState([]);
  
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const fetchAllBooking = async () => {
//     try {
//         const response = await getAllBookings(state);
//         if (response?.status) {
//           setBookingList(response?.data?.data?.result);
//           setTotalPages(response?.data?.data.totalPages || 1);
//         }
//     } catch (error) {
//         console.error("Error fetching bookings:", error);
//     }
//   };

//   const updateState = (key, value) => {
//     setState((prevState) => ({ ...prevState, [key]: value }));
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchAllBooking();
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [state.search, state.page, state.limit]);

//   const handleViewDetails = (booking) => {
//     setSelectedBooking(booking);
//     setShowDetailsModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowDetailsModal(false);
//     setSelectedBooking(null);
//   };

//   return (
//     <>
//       <div className="container mt-4">
//         <div className="card">
//           <div className="card-header">
//             <Row className="mb-0 align-items-center">
//               <Col><h5>Bookings</h5></Col>
//             </Row>
//           </div>
//           <div className="card-body">
//             {/* Search and Limit controls remain the same */}
//             <Row className="mb-3">
//               <Col>
//                 <Form.Group controlId="limit">
//                   <Form.Label>Show entries</Form.Label>
//                   <Form.Control as="select" value={state.limit} onChange={(e) => updateState('limit', Number(e.target.value))} style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}>
//                     <option value={5}>5</option>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={30}>30</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col className="text-end">
//                 <InputGroup>
//                   <FormControl placeholder="Search" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
//                 </InputGroup>
//               </Col>
//             </Row>
//             <Table bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>Name</th>
//                   <th>Phone</th>
//                   <th>Guests</th>
//                   <th>Booked Date</th>
//                   <th>Price</th>
//                   <th className="text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookingList?.map((item, index) => (
//                   <tr key={item._id}>
//                     <td>{(state.page - 1) * state.limit + index + 1}</td>
//                     <td>{item.name}</td>
//                     <td>{item.phone}</td>
//                     <td>
//                         <div>Adults: {item?.adults}</div>
//                         <div>Children: {item?.children}</div>
//                     </td>
//                     <td>
//                       {item?.from && formattedDate(item.from)} {' - '} {item?.from && formattedDate(item.to)}
//                     </td>
//                     <td>{item.price}</td>
//                     <td className="text-center">
//                       {item.explorers && item.explorers.length > 0 ? (
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           onClick={() => handleViewDetails(item)}
//                         >
//                           View Explorers
//                         </Button>
//                       ) : (
//                         <Badge bg="secondary">No Details</Badge>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="d-flex justify-content-between">
//               {/* Pagination remains the same */}
//               <div>
//                 Showing {bookingList?.length} of {totalPages * state.limit} entries
//               </div>
//               <Pagination>
//                 {[...Array(totalPages)]?.map((_, index) => (
//                   <Pagination.Item key={index + 1} active={index + 1 === state.page} onClick={() => updateState('page', index + 1)}>
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//               </Pagination>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal with your own SVG icon */}
//       {selectedBooking && (
//         <Modal show={showDetailsModal} onHide={handleCloseModal} centered size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>Explorer Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="mb-3">
//                 <h6 className="mb-1">Primary Contact:</h6>
//                 <p className="text-muted">{selectedBooking.name} ({selectedBooking.phone})</p>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead className="table-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>Explorer Name</th>
//                   <th>Age</th>
//                   <th className="text-center">Identity Proof</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedBooking.explorers.map((explorer, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{explorer.name}</td>
//                     <td>{explorer.age}</td>
//                     <td className="text-center">
//                       <div className="d-flex justify-content-center align-items-center gap-2">
//                         <a 
//                           href={`${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="btn btn-sm btn-outline-primary"
//                         >
//                           View
//                         </a>
//                         <a 
//                           href={`${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`} 
//                           download
//                           className="btn btn-sm btn-outline-success d-flex align-items-center"
//                         >
//                           {/* === 2. USE YOUR SVG ICON HERE === */}
//                           <img src={DownloadIcon} alt="Download" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
//                           Download
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleCloseModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default Bookings;

// import React, { useEffect, useState, useMemo } from 'react';
// import { getAllBookings, getBookingFilterOptions } from '../../../services/DashBoardApi'; // Import the new service
// import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table, Modal, Badge } from 'react-bootstrap';
// import { formattedDate } from '../../../utils/Constant';
// import DownloadIcon from '../../assets/images/download_icon.svg';

// const Bookings = () => {
//   const [state, setState] = useState({
//     search: '',
//     page: 1,
//     limit: 10,
//     filterBy: '',      // For 'Booked For' column
//     filterDate: '',    // For 'Travel Date' column
//   });
  
//   const [totalPages, setTotalPages] = useState(1);
//   const [bookingList, setBookingList] = useState([]);
//   const [totalEntries, setTotalEntries] = useState(0);
  
//   // === NEW: State to hold the permanent filter options ===
//   const [filterOptions, setFilterOptions] = useState({ destinations: [], travelDates: [] });

//   // State for the modal
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   // This useEffect fetches data whenever the state changes.
//   useEffect(() => {
//     const fetchAllBooking = async () => {
//       try {
//           const response = await getAllBookings(state);
//           if (response?.status) {
//             setBookingList(response.data?.data?.result || []);
//             setTotalPages(response.data?.data.totalPages || 1);
//             setTotalEntries(response.data?.data.totalItems || 0);
//           }
//       } catch (error) {
//           console.error("Error fetching bookings:", error);
//       }
//     };

//     const timer = setTimeout(() => {
//       fetchAllBooking();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [state]);

//   // This useEffect fetches the filter options ONLY ONCE when the component mounts.
//   useEffect(() => {
//     const fetchOptions = async () => {
//         try {
//             const res = await getBookingFilterOptions();
//             if (res.status) {
//                 setFilterOptions(res.data.data);
//             }
//         } catch (error) {
//             console.error("Error fetching filter options:", error);
//         }
//     };
//     fetchOptions();
//   }, []);

//   const updateState = (key, value) => {
//     setState((prevState) => ({ ...prevState, [key]: value, page: 1 }));
//   };

//   const handlePageClick = (pageNumber) => {
//     setState(prevState => ({ ...prevState, page: pageNumber }));
//   }

//   const handleViewDetails = (booking) => { setSelectedBooking(booking); setShowDetailsModal(true); };
//   const handleCloseModal = () => { setSelectedBooking(null); setShowDetailsModal(false); };

//   return (
//     <>
//       <div className="container mt-4">
//         <div className="card">
//           <div className="card-header">
//             <Row className="mb-0 align-items-center">
//               <Col><h5>Bookings</h5></Col>
//             </Row>
//           </div>
//           <div className="card-body">
//             <Row className="mb-3 align-items-end">
//               <Col md={2}>
//                 <Form.Group controlId="limit">
//                   <Form.Label>Show</Form.Label>
//                   <Form.Control as="select" value={state.limit} onChange={(e) => updateState('limit', Number(e.target.value))}>
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                   </Form.Control>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group controlId="bookingFilter">
//                     <Form.Label>Filter by Destination</Form.Label>
//                     <Form.Select value={state.filterBy} onChange={(e) => updateState('filterBy', e.target.value)}>
//                         <option value="">All Destinations</option>
//                         {filterOptions.destinations.map(title => (
//                             <option key={title} value={title}>{title}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={3}>
//                 <Form.Group controlId="dateFilter">
//                     <Form.Label>Filter by Travel Date</Form.Label>
//                     <Form.Select value={state.filterDate} onChange={(e) => updateState('filterDate', e.target.value)}>
//                         <option value="">All Dates</option>
//                         {filterOptions.travelDates.map(date => (
//                             <option key={date} value={date}>{formattedDate(date)}</option>
//                         ))}
//                     </Form.Select>
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Label> </Form.Label>
//                 <InputGroup>
//                   <FormControl placeholder="Search by name or phone" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
//                 </InputGroup>
//               </Col>  
//             </Row>
//             <Table bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>Name / Phone</th>
//                   <th>Guests</th>
//                   <th>Booked For</th>
//                   <th>Booked On</th> 
//                   <th>Travel Date</th>
//                   {/* === UPDATED PRICE COLUMN HEADER === */}
//                   <th>Price / Coupon</th>
//                   {/* === NEW PAYMENT STATUS COLUMN HEADER === */}
//                   <th className="text-center">Payment</th> 
//                   <th className="text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bookingList.map((item, index) => (
//                   <tr key={item._id}>
//                     <td>{(state.page - 1) * state.limit + index + 1}</td>
//                     <td>
//                         <div>{item.name}</div>
//                         <small className="text-muted">{item.phone}</small>
//                     </td>
//                     <td>
//                         <div>Adults: {item?.adults}</div>
//                         <div>Children: {item?.children}</div>
//                     </td>
//                     <td>
//                       {item.packageId?.title || item.resortId?.title || 'N/A'}
//                     </td>
//                     <td>{item?.createdAt && formattedDate(item.createdAt)}</td> 
//                     <td>
//                       {item?.from && formattedDate(item.from)}
//                     </td>
//                     {/* === UPDATED PRICE CELL TO SHOW MORE DETAIL === */}
//                     <td>
//                         <div>
//                             <strong>Final: {item.currency === 'INR' ? '₹' : '$'}{item.final_price}</strong>
//                         </div>
//                         {item.coupon_code && (
//                             <div className="small text-muted" title={`Original Price: ${item.price}`}>
//                                 Code: <Badge bg="info">{item.coupon_code}</Badge>
//                             </div>
//                         )}
//                     </td>
//                     {/* === NEW PAYMENT STATUS CELL === */}
//                     <td className="text-center">
//                         <Badge bg={item.payment_status ? "success" : "danger"}>
//                             {item.payment_status ? "Success" : "Failed"}
//                         </Badge>
//                     </td>
//                     <td className="text-center">
//                       {item.explorers && item.explorers.length > 0 ? (
//                         <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(item)}>
//                           View Details
//                         </Button>
//                       ) : (
//                         item.payment_status ?
//                         <Badge bg="warning" text="dark">Details Pending</Badge> :
//                         <Badge bg="secondary">No Details</Badge>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="d-flex justify-content-between">
//               <div>
//                 Showing {bookingList.length} of {totalEntries} entries
//               </div>
//               <Pagination>
//                 {[...Array(totalPages)].map((_, index) => (
//                   <Pagination.Item 
//                     key={index + 1} 
//                     active={index + 1 === state.page} 
//                     onClick={() => handlePageClick(index + 1)}
//                   >
//                     {index + 1}
//                   </Pagination.Item>
//                 ))}
//               </Pagination>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal with your own SVG icon */}
//       {selectedBooking && (
//         <Modal show={showDetailsModal} onHide={handleCloseModal} centered size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>Explorer Details</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="mb-3">
//                 <h6 className="mb-1">Primary Contact:</h6>
//                 <p className="text-muted">{selectedBooking.name} ({selectedBooking.phone})</p>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead className="table-dark">
//                 <tr>
//                   <th>#</th>
//                   <th>Explorer Name</th>
//                   <th>Age</th>
//                   <th>Gender</th> 
//                   <th className="text-center">Identity Proof</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedBooking.explorers.map((explorer, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{explorer.name}</td>
//                     <td>{explorer.age}</td>
//                     <td>{explorer.gender}</td> 
//                     <td className="text-center">
//                       <div className="d-flex justify-content-center align-items-center gap-2">
//                         <a 
//                           href={`${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="btn btn-sm btn-outline-primary"
//                         >
//                           View
//                         </a>
//                         <a 
//                           href={`${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`} 
//                           download={explorer.idProofUrl.split('/').pop()}
//                           className="btn btn-sm btn-outline-success d-flex align-items-center"
//                         >
//                           <img src={DownloadIcon} alt="Download" style={{ width: '16px', height: '16px', marginRight: '5px' }} />
//                           Download
//                         </a>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Modal.Body>
//           <Modal.Footer>  
//             <Button variant="dark" onClick={handleCloseModal}>
//               Close
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default Bookings;



import React, { useEffect, useState } from 'react';
import { getAllBookings, getBookingFilterOptions } from '../../../services/DashBoardApi';
import { Button, Col, Form, FormControl, InputGroup, Pagination, Row, Table, Modal, Badge } from 'react-bootstrap';
import { formattedDate } from '../../../utils/Constant';
import DownloadIcon from '../../assets/images/download_icon.svg';

// Helper function to check if the file URL points to a PDF
const isPdf = (url = '') => {
  return url.toLowerCase().endsWith('.pdf');
};

const Bookings = () => {
  const [state, setState] = useState({
    search: '',
    page: 1,
    limit: 10,
    filterBy: '',      // For 'Booked For' column
    filterDate: '',    // For 'Travel Date' column
  });
  
  const [totalPages, setTotalPages] = useState(1);
  const [bookingList, setBookingList] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);
  
  // State to hold the permanent filter options
  const [filterOptions, setFilterOptions] = useState({ destinations: [], travelDates: [] });

  // State for the modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // This useEffect fetches data whenever the state changes.
  useEffect(() => {
    const fetchAllBooking = async () => {
      try {
          const response = await getAllBookings(state);
          if (response?.status) {
            setBookingList(response.data?.data?.result || []);
            setTotalPages(response.data?.data.totalPages || 1);
            setTotalEntries(response.data?.data.totalItems || 0);
          }
      } catch (error) {
          console.error("Error fetching bookings:", error);
      }
    };

    const timer = setTimeout(() => {
      fetchAllBooking();
    }, 300);

    return () => clearTimeout(timer);
  }, [state]);

  // This useEffect fetches the filter options ONLY ONCE when the component mounts.
  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const res = await getBookingFilterOptions();
            if (res.status) {
                setFilterOptions(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching filter options:", error);
        }
    };
    fetchOptions();
  }, []);

  const updateState = (key, value) => {
    setState((prevState) => ({ ...prevState, [key]: value, page: 1 }));
  };

  const handlePageClick = (pageNumber) => {
    setState(prevState => ({ ...prevState, page: pageNumber }));
  }

  const handleViewDetails = (booking) => { setSelectedBooking(booking); setShowDetailsModal(true); };
  const handleCloseModal = () => { setSelectedBooking(null); setShowDetailsModal(false); };

  return (
    <>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header">
            <Row className="mb-0 align-items-center">
              <Col><h5>Bookings</h5></Col>
            </Row>
          </div>
          <div className="card-body">
            <Row className="mb-3 align-items-end">
              <Col md={2}>
                <Form.Group controlId="limit">
                  <Form.Label>Show</Form.Label>
                  <Form.Control as="select" value={state.limit} onChange={(e) => updateState('limit', Number(e.target.value))}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="bookingFilter">
                    <Form.Label>Filter by Destination</Form.Label>
                    <Form.Select value={state.filterBy} onChange={(e) => updateState('filterBy', e.target.value)}>
                        <option value="">All Destinations</option>
                        {filterOptions.destinations.map(title => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="dateFilter">
                    <Form.Label>Filter by Travel Date</Form.Label>
                    <Form.Select value={state.filterDate} onChange={(e) => updateState('filterDate', e.target.value)}>
                        <option value="">All Dates</option>
                        {filterOptions.travelDates.map(date => (
                            <option key={date} value={date}>{formattedDate(date)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Label> </Form.Label>
                <InputGroup>
                  <FormControl placeholder="Search by name or phone" value={state.search} onChange={(e) => updateState('search', e.target.value)} />
                </InputGroup>
              </Col>  
            </Row>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name / Phone</th>
                  <th>Guests</th>
                  <th>Booked For</th>
                  <th>Booked On</th> 
                  <th>Travel Date</th>
                  <th>Price / Coupon</th>
                  <th className="text-center">Payment</th> 
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingList.map((item, index) => (
                  <tr key={item._id}>
                    <td>{(state.page - 1) * state.limit + index + 1}</td>
                    <td>
                        <div>{item.name}</div>
                        <small className="text-muted">{item.phone}</small>
                    </td>
                    <td>
                        <div>Adults: {item?.adults}</div>
                        <div>Children: {item?.children}</div>
                    </td>
                    <td>
                      {item.packageId?.title || item.resortId?.title || 'N/A'}
                    </td>
                    <td>{item?.createdAt && formattedDate(item.createdAt)}</td> 
                    <td>
                      {item?.from && formattedDate(item.from)}
                    </td>
                    <td>
                        <div>
                            <strong>Final: {item.currency === 'INR' ? '₹' : '$'}{item.final_price}</strong>
                        </div>
                        {item.coupon_code && (
                            <div className="small text-muted" title={`Original Price: ${item.price}`}>
                                Code: <Badge bg="info">{item.coupon_code}</Badge>
                            </div>
                        )}
                    </td>
                    <td className="text-center">
                        <Badge bg={item.payment_status ? "success" : "danger"}>
                            {item.payment_status ? "Success" : "Failed"}
                        </Badge>
                    </td>
                    <td className="text-center">
                      {item.explorers && item.explorers.length > 0 ? (
                        <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(item)}>
                          View Details
                        </Button>
                      ) : (
                        item.payment_status ?
                        <Badge bg="warning" text="dark">Details Pending</Badge> :
                        <Badge bg="secondary">No Details</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between">
              <div>
                Showing {bookingList.length} of {totalEntries} entries
              </div>
              <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item 
                    key={index + 1} 
                    active={index + 1 === state.page} 
                    onClick={() => handlePageClick(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* Modal with enhanced UI for viewing/downloading files */}
      {selectedBooking && (
        <Modal show={showDetailsModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Explorer Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
                <h6 className="mb-1">Primary Contact:</h6>
                <p className="text-muted">{selectedBooking.name} ({selectedBooking.phone})</p>
            </div>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Explorer Name</th>
                  <th>Age</th>
                  <th>Gender</th> 
                  <th className="text-center">Identity Proof</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.explorers.map((explorer, index) => {
                  const isPdfFile = isPdf(explorer.idProofUrl);
                  const fileUrl = `${import.meta.env.VITE_APP_IMG_URL}/${explorer.idProofUrl}`;

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{explorer.name}</td>
                      <td>{explorer.age}</td>
                      <td>{explorer.gender}</td> 
                      <td className="text-center">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            {isPdfFile ? 'View PDF' : 'View Image'}
                          </a>
                          <a 
                            href={fileUrl} 
                            download={explorer.idProofUrl.split('/').pop()}
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                          >
                            <img src={DownloadIcon} alt="Download" style={{ width: '16px', height: '16px' }} />
                            Download
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>  
            <Button variant="dark" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Bookings;
