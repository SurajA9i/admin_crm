import { SurveyForm } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const createSurveyForm = async (data) => {
  const response = await httpServiceInstance.post(SurveyForm.SURVEY_FORM, data);
  return response;
};

export const FetchSurveyForm = async (data) => {
  const res = await httpServiceInstance.get(
    `${SurveyForm.SURVEY_FORM}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`
  );
  return res;
};

export const getSurveyFormById = async (id) => {
  const res = await httpServiceInstance.get(`${SurveyForm.SURVEY_FORM}/${id}`);
  return res;
};

export const deleteSurveyForm = async (id) => {
  const res = await httpServiceInstance.delete(`${SurveyForm.SURVEY_FORM}/${id}`);
  return res;
};

export const UpdateSurveyForm = async (id, data) => {
  const res = await httpServiceInstance.patch(`${SurveyForm.SURVEY_FORM}/${id}`, data);
  return res;
};

// =================== survey form API =====================

export const createFormField = async (data) => {
  const response = await httpServiceInstance.post(SurveyForm.SURVEY_FORM_FIELDS, data);
  return response;
};
export const createBudgetFormField = async (data) => {
  const response = await httpServiceInstance.patch(`${SurveyForm.SURVEY_FORM_FIELDS}/${'67593678aafe6c4e3a3b0918'}`, data);
  return response;
};
export const FetchFormField = async (data) => {
  const res = await httpServiceInstance.get(
    `${SurveyForm.SURVEY_FORM_FIELDS}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`
  );
  return res;
};

export const getFormFieldById = async (id) => {
  const res = await httpServiceInstance.get(`${SurveyForm.SURVEY_FORM_FIELDS}/${id}`);
  return res;
};

export const deleteFormField = async (id) => {
  const res = await httpServiceInstance.delete(`${SurveyForm.SURVEY_FORM_FIELDS}/${id}`);
  return res;
};

export const UpdateFormField = async (id, data) => {
  const res = await httpServiceInstance.patch(`${SurveyForm.SURVEY_FORM_FIELDS}/${id}`, data);
  return res;
};

//=========================== Budget Range =========================

export const createBudget = async (data) => {
  const response = await httpServiceInstance.post(SurveyForm.BUDGET, data);
  return response;
};
