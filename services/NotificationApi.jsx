import httpServiceInstance from '../utils/httpServiceInstance';
import { Notification } from '../utils/ApiUrl';

export const FetchNotfi = async (data) => {
  const res = await httpServiceInstance.get(`${Notification.NOTIFICATION}?page=1&size=5&search=`);
  return res;
};

export const NotfiCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Notification.NOTIFICATION}`, data);
  return response;
};
export const UpdateNotfi = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Notification.NOTIFICATION}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res;
};

export const getNotfiById = async (id) => {
  const res = await httpServiceInstance.get(`${Notification.NOTIFICATION}/${id}`);
  return res;
};

export const deleteNotfi = async (id) => {
  const res = await httpServiceInstance.delete(`${Notification.NOTIFICATION}/${id}`);
  return res;
};
