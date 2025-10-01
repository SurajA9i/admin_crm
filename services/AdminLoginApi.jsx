import { Admin } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const AdminLogin = async (data) => {
  const response = await httpServiceInstance.post(Admin.LOGIN, data);
  return response;
};
