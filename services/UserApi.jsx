import httpServiceInstance from '../utils/httpServiceInstance';
import { UserUrl } from '../utils/ApiUrl';

export const FetchUsers = async (data) => {
  const res = await httpServiceInstance.get(`${UserUrl.USER}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`); //?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}
  return res;
};

export const UserCreate = async (data) => {
  const response = await httpServiceInstance.post(`${UserUrl.USER_CREATE}`, data);
  return response;
};

export const UpdateUser = async (id, data) => {
  const res = await httpServiceInstance.patch(`${UserUrl.USER}/${id}`, data);
  return res;
};

export const getUserById = async (id) => {
  const res = await httpServiceInstance.get(`${UserUrl.USER}/${id}`);
  return res;
};

export const deleteUser = async (id) => {
  const res = await httpServiceInstance.delete(`${UserUrl.USER}/${id}`);
  return res;
};
