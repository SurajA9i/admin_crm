import httpServiceInstance from '../utils/httpServiceInstance';
import { Resort } from '../utils/ApiUrl';

export const FetchResort = async (data) => {
  const res = await httpServiceInstance.get(`${Resort.RESORT}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return res;
};

export const addResort = async (data) => {
  const response = await httpServiceInstance.post(`${Resort.RESORT}`, data);
  return response;
};

export const deleteResort = async (id) => {
  const res = await httpServiceInstance.delete(`${Resort.RESORT}/${id}`);
  return res;
};

export const UpdateResort = async (id, data) => {
  const res = await httpServiceInstance.patch(
    `${Resort.RESORT}/${id}`,
    data
    //  {headers: { 'Content-Type': 'multipart/form-data' }  }
  );
  return res;
};

export const getResortById = async (id) => {
  const res = await httpServiceInstance.get(`${Resort.RESORT}/${id}`);
  return res;
};
