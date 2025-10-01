import httpServiceInstance from '../utils/httpServiceInstance';
import { Coupon } from '../utils/ApiUrl';

export const createCoupon = async (data) => {
  const response = await httpServiceInstance.post(Coupon.COUPON, data);
  return response;
};
export const getCoupon = async (data) => {
  const response = await httpServiceInstance.get(`${Coupon.COUPON}/admin?page=${data.page}&limit=${data.limit}&search=${data.search}`);
  return response;
};
export const getCouponById = async (id) => {
  const response = await httpServiceInstance.get(`${Coupon.COUPON}/${id}`);
  return response;
};
export const deleteCoupon = async (id) => {
  const response = await httpServiceInstance.delete(`${Coupon.COUPON}/${id}`);
  return response;
};
export const updateCouponStatus = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Coupon.COUPON}/${id}`, data);
  return response;
};
export const editCoupon = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Coupon.COUPON}/${id}`, data);
  return response;
};
