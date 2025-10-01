import httpServiceInstance from '../utils/httpServiceInstance';
import { Testimonial } from '../utils/ApiUrl';

export const FetchTestimonial = async (data) => {
  const res = await httpServiceInstance.get(`${Testimonial.TESTIMONIAL}?page=${data.page}&limit=${data.limit}&search=${data.search}`);
  return res;
};

export const TestimonialCreate = async (data) => {
  const response = await httpServiceInstance.post(`${Testimonial.TESTIMONIAL}`, data);
  return response;
};
export const UpdateTestimonial = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Testimonial.TESTIMONIAL}/${id}`, data);
  return res;
};

export const getTestimonialById = async (id) => {
  const res = await httpServiceInstance.get(`${Testimonial.TESTIMONIAL}/${id}`);
  return res;
};

export const deleteTestimonial = async (id) => {
  const res = await httpServiceInstance.delete(`${Testimonial.TESTIMONIAL}/${id}`);
  return res;
};

export const UpdateTestimonialStatus = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Testimonial.TESTIMONIAL}/${id}`, data);
  return res;
};
