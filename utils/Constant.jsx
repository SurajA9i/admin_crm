export const Constants = {
  accessToken: 'accessToken',
  somethingWentWrong: 'Something Went wrong!'
};

export const ImgUrl = import.meta.env.VITE_APP_IMG_URL;

export const formattedDate = (timestamp) => {
  if (!timestamp) return ''; // Handle null/undefined cases

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
