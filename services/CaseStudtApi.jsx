import { CaseStudy } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const createCaseStudy = async (data) => {
  const response = await httpServiceInstance.post(CaseStudy.CASE_STUDY, data);
  return response;
};

export const FetchCaseStudy = async (data) => {
  const res = await httpServiceInstance.get(`${CaseStudy.CASE_STUDY}?page=${data.page}&search=${data.search}&limit=${data.limit}`);
  return res;
};

export const getCaseStudyById = async (id) => {
  const res = await httpServiceInstance.get(`${CaseStudy.CASE_STUDY}/${id}`);
  return res;
};

export const deleteCaseStudy = async (id) => {
  const res = await httpServiceInstance.delete(`${CaseStudy.CASE_STUDY}/${id}`);
  return res;
};

export const UpdateCaseStudy = async (id, data) => {
  const res = await httpServiceInstance.patch(
    `${CaseStudy.CASE_STUDY}/${id}`,
    data
    //   , {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }
  );
  return res;
};
