import httpServiceInstance from '../utils/httpServiceInstance';
import { NationalPark } from '../utils/ApiUrl';

export const FetchNationalPark = async (data) => {
  const res = await httpServiceInstance.get(`${NationalPark.PARK}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`);
  return res;
};

export const NationalParkCreate = async (data) => {
  const response = await httpServiceInstance.post(`${NationalPark.PARK}`, data);
  return response;
};
export const UpdateNationalPark = async (id, data) => {
  const res = await httpServiceInstance.patch(
    `${NationalPark.PARK}/${id}`,
    data
    //   {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }
  );
  return res;
};

export const getNationalParkById = async (id) => {
  const res = await httpServiceInstance.get(`${NationalPark.PARK}/${id}`);
  return res;
};

export const deleteNationalPark = async (id) => {
  const res = await httpServiceInstance.delete(`${NationalPark.PARK}/${id}`);
  return res;
};
