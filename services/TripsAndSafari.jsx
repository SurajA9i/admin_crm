import httpServiceInstance from '../utils/httpServiceInstance';
import { TripsAndSafaries } from '../utils/ApiUrl';

export const fetchTripsAndSafari = async (data) => {
  const res = await httpServiceInstance.get(`${TripsAndSafaries.TRIPS_SAFARI}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return res; // /?page=1&limit=10&search&feature=true
};
export const fetchTripsAndSafariById = async (id) => {
  const response = await httpServiceInstance.get(`${TripsAndSafaries.TRIPS_SAFARI}/${id}`);
  return response;
};
export const addTripSafari = async (data) => {
  const response = await httpServiceInstance.post(`${TripsAndSafaries.TRIPS_SAFARI}`, data);
  return response;
};
export const updateTripsSafariData = async (id, data) => {
  const response = await httpServiceInstance.patch(
    `${TripsAndSafaries.TRIPS_SAFARI}/${id}`,
    data
    // {headers: { 'Content-Type': 'multipart/form-data' }}
  );
  return response;
};
export const deleteTripsAndSafari = async (id) => {
  const response = await httpServiceInstance.delete(`${TripsAndSafaries.TRIPS_SAFARI}/${id}`);
  return response;
};

// export const deleteResort = async (id) => {
//   const res = await httpServiceInstance.delete(`${Resort.RESORT}/${id}`);
//   return res;
// };

// export const UpdateResort = async (id, data) => {
//   const res = await httpServiceInstance.patch(`${Resort.RESORT}/${id}`, data, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return res;
// };

// export const getResortById = async (id) => {
//   const res = await httpServiceInstance.get(`${Resort.RESORT}/${id}`);
//   return res;
// };
