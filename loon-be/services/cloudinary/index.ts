/*

grab image from spotify, could be an artist or an album

create output filename, art/artist/artist or art/artist/album

upload image bytes and filename to cloudinary

we kept a map of filenamy to cloudinary publicId to use as a cache

 - check cache, return if present
 - otherwise upload to cloudinary, cache the result, and return the id

we saved full size and thumbnail separately - can't cloudinary do that?

*/
