import { Links } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const FetchSocialLinks = async (data) => {
  const res = await httpServiceInstance.get(`${Links.LINKS}`);
  return res;
};
export const UpdateSocialLinks = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Links.LINKS}/${id}`, data);
  return res;
};

export const createSocialLinks = async (data) => {
  const response = await httpServiceInstance.post(Links.LINKS, data);
  return response;
};
