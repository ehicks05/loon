const HOST = "https://images.unsplash.com";
const PATH = "photo-1609667083964-f3dbecb7e7a5";
const OPTIONS = new URLSearchParams({
  ixid: "MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D",
  ixlib: "rb-1.2.1",
  auto: "format",
  fit: "crop",
  w: "600",
  q: "80",
});

export const PLACEHOLDER_IMAGE_URL = `${HOST}/${PATH}?${OPTIONS.toString()}`;
