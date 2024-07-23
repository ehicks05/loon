const apiUrl =
  import.meta.env.PROD ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL;

export default apiUrl;
