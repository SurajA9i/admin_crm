import httpServiceInstance from '../utils/httpServiceInstance';
import { Querie } from '../utils/ApiUrl';

export const FetchQueries = async (data) => {
  const res = await httpServiceInstance.get(`${Querie.QUERIE}?page=${data.page}&size=${data.limit}5&search=${data.search}`);
  return res;
};

export const QueriesCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Querie.QUERIE}`, data);
  return response;
};
export const UpdateQueries = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Querie.QUERIE}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res;
};

export const getQueriesById = async (id) => {
  const res = await httpServiceInstance.get(`${Querie.QUERIE}/${id}`);
  return res;
};

export const deleteQueries = async (id) => {
  const res = await httpServiceInstance.delete(`${Querie.QUERIE}/${id}`);
  return res;
};
