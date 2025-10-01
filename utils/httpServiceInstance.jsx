import axios from 'axios';
import { Constants } from './Constant.jsx';
import { RoutesUrl } from './RoutesUrl.jsx';
import { showFailureToast } from '../src/DashComponents/toastsAlert/Alert.jsx';
class HttpService {
  defaultOptions = () => {
    // Use Render backend URL in production, localhost in development
    const baseURL = import.meta.env.VITE_APP_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://junglore-crm-backend.onrender.com/api'
        : 'http://localhost:8000/api');
        
    return {
      baseURL: baseURL,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(Constants.accessToken) || ''}`
      }
    };
  };

  defaultOptionsFormdata = () => {
    return {
      baseURL: import.meta.env.VITE_APP_API_URL,
      // headers: {
      //   Authorization: 'Bearer ' + localStorage.getItem(Constants.accessToken) || '',
      //   'Content-Type': 'multipart/form-data'
      // }

      headers: {
        // token: localStorage.getItem(Constants.accessToken),
        Authorization: `Bearer ${localStorage.getItem(Constants.accessToken) || ''}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  };

  successResult = (res) => {
    // if (res?.data && res?.data?.status === true && res?.data?.statusCode === 200) {
    if (res?.data && res?.data?.status === true) {
      return { status: true, data: res?.data };
    } else {
      return { status: false, data: Constants.somethingWentWrong };
    }
  };

  failureResult = (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = RoutesUrl.login;
    }
    if (err.response?.status === 500) {
      // console.log("Error>",err);
      showFailureToast(err?.response?.data?.message);
    }
    let data = { status: false, data: null };
    try {
      data.data = err?.message;
      if (err?.response && err?.response?.data && err?.response?.data.status === false) {
        data.data = err?.response?.data?.message;
      }
    } catch (error) {
      data.data = error?.message;
    }
    return data;
  };

  get = async (url, options = {}) => {
    try {
      const res = await axios.get(url, {
        ...this.defaultOptions(),
        ...options
      });
      return this.successResult(res);
    } catch (err) {
      return this.failureResult(err);
    }
  };

  post = async (url, data, options = {}) => {
    try {
      const res = await axios.post(url, data, {
        ...this.defaultOptions(),
        ...options
      });
      return this.successResult(res);
    } catch (err) {
      return this.failureResult(err);
    }
  };

  postForm = async (url, data, options = {}) => {
    return axios
      .post(url, data, { ...this.defaultOptionsFormdata(), ...options })
      .then((res) => {
        return this.successResult(res);
      })
      .catch((err) => {
        return this.failureResult(err);
      });
  };

  put = async (url, data, options = {}) => {
    try {
      const res = await axios.put(url, data, {
        ...this.defaultOptions(),
        ...options
      });
      return this.successResult(res);
    } catch (err) {
      return this.failureResult(err);
    }
  };

  patch = async (url, data, options = {}) => {
    try {
      const res = await axios.patch(url, data, {
        ...this.defaultOptions(),
        ...options
      });
      return this.successResult(res);
    } catch (err) {
      return this.failureResult(err);
    }
  };

  delete = async (url, data, options = {}) => {
    try {
      const res = await axios.delete(url, {
        ...this.defaultOptions(),
        data,
        ...options
      });
      return this.successResult(res);
    } catch (err) {
      return this.failureResult(err);
    }
  };
}

const httpServiceInstance = new HttpService();

export default httpServiceInstance;
