import httpServiceInstance from '../utils/httpServiceInstance';
import { HomeMedia } from '../utils/ApiUrl'; // You will need to add a 'HomeMedia' URL to your ApiUrl.js file

/**
 * Fetches the homepage media settings.
 * Corresponds to the GET / route on your homeMedia backend endpoint.
 * @returns {Promise<Object>} The API response.
 */
export const fetchHomeMediaSettings = async () => {
  // We use HomeMedia.HOMEMEDIA which should point to your endpoint (e.g., '/home-media')
  const response = await httpServiceInstance.get(HomeMedia.HOMEMEDIA);
  return response;
};

/**
 * Updates the homepage media settings.
 * Corresponds to the PATCH / route on your homeMedia backend endpoint.
 * @param {FormData} data - The data to be sent. Must be a FormData object to support file uploads.
 * @returns {Promise<Object>} The API response.
 */
export const updateHomeMediaSettings = async (data) => {
  const response = await httpServiceInstance.patch(
    HomeMedia.HOMEMEDIA,
    data
    // Note: When using FormData with axios, the 'Content-Type': 'multipart/form-data' header
    // is usually set automatically by the browser, so you often don't need to specify it.
  );
  return response;
};