import httpServiceInstance from '../utils/httpServiceInstance';
import { Application } from '../utils/ApiUrl';

export const FetchOpening = async (data) => {
  const res = await httpServiceInstance.get(
    `${Application.APPLICATION}/${Application.OPENING}?page=${data.page}&limit=${data.limit}&search=${data.search}&expiry=true`
  );
  return res;
};

export const OpeningCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Application.APPLICATION}/${Application.OPENING}`, data);
  return response;
};
export const UpdateOpening = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Application.APPLICATION}/${Application.OPENING}/${id}`, data);
  return res;
};

export const getOpeningById = async (id) => {
  const res = await httpServiceInstance.get(`${Application.APPLICATION}/${Application.OPENING}/${id}`);
  return res;
};

export const deleteOpening = async (id) => {
  const res = await httpServiceInstance.delete(`${Application.APPLICATION}/${Application.OPENING}/${id}`);
  return res;
};
