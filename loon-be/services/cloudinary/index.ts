import { v2 as cloudinary } from "cloudinary";
import { env } from "../../env";

const {
  CLOUDINARY_API_KEY: api_key,
  CLOUDINARY_API_SECRET: api_secret,
  CLOUDINARY_CLOUD: cloud_name,
} = env;

cloudinary.config({ api_key, api_secret, cloud_name });

console.log(cloudinary.url);

export { cloudinary };

/*

grab image from spotify, could be an artist or an album

create output filename, art/artist/artist or art/artist/album

upload image bytes and filename to cloudinary

we kept a map of filenamy to cloudinary publicId to use as a cache

 - check cache, return if present
 - otherwise upload to cloudinary, cache the result, and return the id

we saved full size and thumbnail separately - can't cloudinary do that?

*/
