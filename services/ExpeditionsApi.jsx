import httpServiceInstance from '../utils/httpServiceInstance';
import { Expeditions, TripsAndSafaries } from '../utils/ApiUrl';

export const fetchExpeditions = async (data) => {
  const response = await httpServiceInstance.get(`${Expeditions.EXPEDITIONS}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return response;
};
export const fetchExpeditionsById = async (id) => {
  const response = await httpServiceInstance.get(`${Expeditions.EXPEDITIONS}/${id}`);
  return response;
};
export const addExpeditions = async (data) => {
  const response = await httpServiceInstance.post(`${Expeditions.EXPEDITIONS}`, data);
  return response;
};
export const updateExpeditions = async (id, data) => {
  const response = await httpServiceInstance.patch(
    `${Expeditions.EXPEDITIONS}/${id}`,
    data
    // {headers: { 'Content-Type': 'multipart/form-data' }}
  );
  return response;
};
export const deleteExpeditions = async (id) => {
  const response = await httpServiceInstance.delete(`${Expeditions.EXPEDITIONS}/${id}`);
  return response;
};
export const getAttraction = async () => {
  const response = await httpServiceInstance.get(`${Expeditions.EXPERIENCE}/attraction`);
  return response;
};
export const getAttractionById = async (id) => {
  const response = await httpServiceInstance.patch(`${Expeditions.EXPERIENCE}/attraction/${id}`);
  return response;
};
export const addAttraction = async (data) => {
  const response = await httpServiceInstance.post(`${Expeditions.EXPERIENCE}/attraction`, data);
  return response;
};
export const updateAttraction = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Expeditions.EXPERIENCE}/attraction/${id}`, data);
  return response;
};
export const deleteAttraction = async (id) => {
  const response = await httpServiceInstance.delete(`${Expeditions.EXPERIENCE}/attraction/${id}`);
  return response;
};
export const getExperience = async () => {
  const response = await httpServiceInstance.get(`${Expeditions.EXPERIENCE}`);
  return response;
};

export const addExperience = async (data) => {
  const response = await httpServiceInstance.post(`${Expeditions.EXPERIENCE}`, data);
  return response;
};
export const deleteExperience = async (id) => {
  const response = await httpServiceInstance.delete(`${Expeditions.EXPERIENCE}/${id}`);
  return response;
};
export const getExperienceById = async (id) => {
  const response = await httpServiceInstance.get(`${Expeditions.EXPERIENCE}/${id}`);
  return response;
};
export const updateExperienceById = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Expeditions.EXPERIENCE}/${id}`, data);
  return response;
};
export const getSafetyGuidelines = async (data) => {
  const response = await httpServiceInstance.get(`${Expeditions.SAFETY}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return response;
};
export const getSafetyGuidelinesById = async (id) => {
  const response = await httpServiceInstance.get(`${Expeditions.SAFETY}/${id}`);
  return response;
};
export const addSafetyGuidelines = async (data) => {
  const response = await httpServiceInstance.post(`${Expeditions.SAFETY}`, data);
  return response;
};
export const updateSafetyGuidelines = async (id, data) => {
  const response = await httpServiceInstance.patch(`${Expeditions.SAFETY}/${id}`, data);
  return response;
};
export const deleteSafetyGuidelines = async (id) => {
  const response = await httpServiceInstance.delete(`${Expeditions.SAFETY}/${id}`);
  return response;
};
