import httpServiceInstance from '../utils/httpServiceInstance';
import { Pages } from '../utils/ApiUrl';

export const FetchPages = async (data) => {
  const res = await httpServiceInstance.get(`${Pages.PAGES}?page=${data.page}&limit=${data.limit}&search=${data.search}`);
  return res;
};

export const PagesCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Pages.PAGES}`, data);
  return response;
};

export const deletePage = async (id) => {
  const res = await httpServiceInstance.delete(`${Pages.PAGES}/${id}`);
  return res;
};

export const UpdatePages = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Pages.PAGES}/${id}`, data);
  return res;
};

export const getPageById = async (id) => {
  const res = await httpServiceInstance.get(`${Pages.PAGES}/${id}`);
  return res;
};
