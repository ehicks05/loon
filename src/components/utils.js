const PLACEHOLDER_IMAGE_URL =
  "https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/ehicks/image/upload/";

const getImageUrl = (id) =>
  id ? `${CLOUDINARY_BASE_URL}${id}` : PLACEHOLDER_IMAGE_URL;

export { PLACEHOLDER_IMAGE_URL, getImageUrl };
