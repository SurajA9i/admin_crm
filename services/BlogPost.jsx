import { ApiUrl } from '../utils/ApiUrl';
import httpServiceInstance from '../utils/httpServiceInstance';

export const createBlog = async (data) => {
  const response = await httpServiceInstance.post(ApiUrl.Blog_POST, data);
  return response;
};
export const FetchBlogs = async (data) => {
  const res = await httpServiceInstance.get(`${ApiUrl.Blog_POST}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`);
  return res;
};

export const getBlogById = async (id) => {
  const res = await httpServiceInstance.get(`${ApiUrl.Blog_POST}/${id}`);
  return res;
};

export const deleteBlog = async (id) => {
  const res = await httpServiceInstance.delete(`${ApiUrl.Blog_POST}/${id}`);
  return res;
};

export const UpdateBlog = async (id, data) => {
  const res = await httpServiceInstance.patch(
    `${ApiUrl.Blog_POST}/${id}`,
    data
    //   , {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }
  );
  return res;
};

// ===========================Category===============

export const BlogCategoryCreate = async (data) => {
  const response = await httpServiceInstance.post(`${ApiUrl.CATEGORY}`, data);
  return response;
};

export const getAllCategory = async (data) => {
  const res = await httpServiceInstance.get(`${ApiUrl.CATEGORY}?page=${data.page}&search=${data.search}&category_id&limit=${data.limit}`);
  return res;
};
export const getAllCategory1 = async () => {
  const res = await httpServiceInstance.get(`${ApiUrl.CATEGORY}`);
  return res;
};

export const getCategoryById = async (id) => {
  const res = await httpServiceInstance.get(`${ApiUrl.CATEGORY}/${id}`);
  return res;
};

export const deleteBlogCategory = async (id) => {
  const res = await httpServiceInstance.delete(`${ApiUrl.CATEGORY}/${id}`);
  return res;
};

export const UpdateCategory = async (id, data) => {
  const res = await httpServiceInstance.patch(`${ApiUrl.CATEGORY}/${id}`, data);
  return res;
};
