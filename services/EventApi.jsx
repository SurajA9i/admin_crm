import httpServiceInstance from '../utils/httpServiceInstance';
import { Event } from '../utils/ApiUrl';

export const FetchEvent = async (data) => {
  const res = await httpServiceInstance.get(`${Event.EVENTS}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return res;
};

export const EventCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Event.EVENTS}`, data);
  return response;
};

export const deleteEvent = async (id) => {
  const res = await httpServiceInstance.delete(`${Event.EVENTS}/${id}`);
  return res;
};

export const UpdateEvent = async (id, data) => {
  const res = await httpServiceInstance.patch(
    `${Event.EVENTS}/${id}`,
    data
    // { headers: { 'Content-Type': 'multipart/form-data' }}
  );
  return res;
};

export const getEventById = async (id) => {
  const res = await httpServiceInstance.get(`${Event.EVENTS}/${id}`);
  return res;
};
