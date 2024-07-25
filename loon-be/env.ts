const { DB_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

if (!DB_URL || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error("missing env var");
}

export const env = {
  DB_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
};
