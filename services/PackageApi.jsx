import httpServiceInstance from '../utils/httpServiceInstance';
import { Package } from '../utils/ApiUrl';

export const FetchPackage = async (data) => {
  const res = await httpServiceInstance.get(`${Package.PACKAGE}?page=${data.page}&search=${''}&limit=${data.limit}`); //?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}
  return res;
};

export const addPackage = async (data) => {
  const response = await httpServiceInstance.post(`${Package.PACKAGE}`, data);
  return response;
};

export const deletePackage = async (id) => {
  const res = await httpServiceInstance.delete(`${Package.PACKAGE}/${id}`);
  return res;
};

export const UpdatePackage = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Package.PACKAGE}/${id}`, data);
  return res;
};

export const getPackageById = async (id) => {
  const res = await httpServiceInstance.get(`${Package.PACKAGE}/${id}`);
  return res;
};
