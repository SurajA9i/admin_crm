import httpServiceInstance from '../utils/httpServiceInstance';
import { EmailSubscription } from '../utils/ApiUrl';

export const FetchSubscription = async (data) => {
  const res = await httpServiceInstance.get(`${EmailSubscription.SUBSCRIBE}?page${data.page}&limit=${data.limit}&search=${data.search}`);
  return res;
};