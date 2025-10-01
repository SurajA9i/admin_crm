import { Setting } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const FetchSetting = async () => {
  const res = await httpServiceInstance.get(`${Setting.SETTING}`);
  return res;
};
export const UpdateSetting = async (data) => {
  const res = await httpServiceInstance.patch(`${Setting.SETTING}`, data);
  return res;
};
