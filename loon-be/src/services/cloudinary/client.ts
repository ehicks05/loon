import { v2 as cloudinary } from "cloudinary";
import { env } from "../../env.js";

const {
  CLOUDINARY_API_KEY: api_key,
  CLOUDINARY_API_SECRET: api_secret,
  CLOUDINARY_CLOUD: cloud_name,
} = env;

cloudinary.config({ api_key, api_secret, cloud_name });

console.log(cloudinary.url);

export { cloudinary };
