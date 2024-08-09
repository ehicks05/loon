import { PLACEHOLDER_IMAGE_URL } from "@/constants";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/ehicks/image/upload/";

const getImageUrl = (id?: string | null) =>
  id ? `${CLOUDINARY_BASE_URL}${id}` : PLACEHOLDER_IMAGE_URL;

export { getImageUrl };
