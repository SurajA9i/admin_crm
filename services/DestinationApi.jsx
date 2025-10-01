import httpServiceInstance from '../utils/httpServiceInstance';
import { Destination } from '../utils/ApiUrl';

export const FetchDestination = async (data) => {
  // const res = await httpServiceInstance.get(`${Destination.DETINATION}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  const res = await httpServiceInstance.get(Destination.DETINATION);
  return res;
};

export const DestinationCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Destination.DETINATION}`, data);
  return response;
};

export const deleteDestination = async (id) => {
  const res = await httpServiceInstance.delete(`${Destination.DETINATION}/${id}`);
  return res;
};

export const UpdateDetination = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Destination.DETINATION}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res;
};

export const getDetinationById = async (id) => {
  const res = await httpServiceInstance.get(`${Destination.DETINATION}/${id}`);
  return res;
};
