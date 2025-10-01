import httpServiceInstance from '../utils/httpServiceInstance';
import { Application } from '../utils/ApiUrl';

export const FetchApplication = async (data) => {
  const res = await httpServiceInstance.get(`${Application.APPLICATION}?page=${data.page}&size=${data.size}&search=${data.search}`);
  return res;
};

export const ApplicationCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Application.APPLICATION}`, data);
  return response;
};
export const UpdateApplication = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Application.APPLICATION}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res;
};

export const getApplicationById = async (id) => {
  const res = await httpServiceInstance.get(`${Application.APPLICATION}/${id}`);
  return res;
};

export const deleteApplication = async (id) => {
  const res = await httpServiceInstance.delete(`${Application.APPLICATION}/${id}`);
  return res;
};
