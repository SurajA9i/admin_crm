import httpServiceInstance from '../utils/httpServiceInstance';
import { Dashboard, Booking } from '../utils/ApiUrl';

export const FetchDashData = async () => {
  const res = await httpServiceInstance.get(`${Dashboard.DASHBOARD}`);
  return res;
};

//================= Charts ===============

export const FetchGraph = async () => {
  const res = await httpServiceInstance.get(`${Dashboard.DASHBOARD}/${Dashboard.GRAPHS}`);
  return res;
};

// export const getAllBookings = async (data) => {
//   const response = await httpServiceInstance.get(`${Booking.BOOKING}?page=${data.page}&limit=${data.limit}&search=${data.search}`);
//   return response;
// };

export const getAllBookings = async (state) => {
  // Build the query string from the state object
  const params = new URLSearchParams({
    page: state.page,
    limit: state.limit,
    search: state.search || '',
    filterBy: state.filterBy || '',
    filterDate: state.filterDate || '',
  });

  // The 'toString()' method creates a perfect query string like "page=1&limit=10&..."
  const response = await httpServiceInstance.get(`/booking?${params.toString()}`);
  return response;
};

export const getBookingFilterOptions = async () => {
  // Assuming your booking route is at '/booking'
  const response = await httpServiceInstance.get('/booking/filters/options');
  return response;
};