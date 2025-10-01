import { Media } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const createMedia = async (data) => {
  const response = await httpServiceInstance.post(Media.MEDIA, data);
  return response;
};
export const FetchMedia = async (data) => {
  const res = await httpServiceInstance.get(`${Media.MEDIA}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`);
  return res;
};

export const getMediaById = async (id) => {
  const res = await httpServiceInstance.get(`${Media.MEDIA}/${id}`);
  return res;
};

export const deleteMedia = async (id) => {
  const res = await httpServiceInstance.delete(`${Media.MEDIA}/${id}`);
  return res;
};

export const UpdateMedia = async (id, data) => {
  const res = await httpServiceInstance.patch(`${Media.MEDIA}/${id}`, data);
  return res;
};
export const getAllChatbotMedia = async () => {
  const response = await httpServiceInstance.get(`${Media.CHATBOT} `);
  return response;
};
export const getSingleChatbotMedia = async (id) => {
  const response = await httpServiceInstance.get(`${Media.MEDIA}/${id} `);
  return response;
};
export const createChatbotMedia = async (data) => {
  const response = await httpServiceInstance.post(Media.CHATBOT, data);
  return response;
};
export const deleteChatbotMedia = async (id) => {
  const response = await httpServiceInstance.delete(`${Media.MEDIA}/${id}`);
  return response;
};
export const updateChatbotMedia = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Media.MEDIA}/${id}`, data);
  return response;
};
