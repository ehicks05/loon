import fs from "node:fs";
import { open } from "node:fs/promises";

export const listFiles = (path: string) => {
  const files: string[] = [];

  fs.readdirSync(path, { recursive: true, withFileTypes: true })
    .filter(
      (file) =>
        !file.isDirectory() &&
        (file.name.endsWith(".mp3") || file.name.endsWith(".flac")),
    )
    .forEach((file) => {
      console.log(`${file.parentPath}\\${file.name}`);
      files.push(`${file.parentPath}\\${file.name}`);
    });

  return files;
};

export const doesFileExist = async (path: string) => {
  const file = await open(path);
  if (!file) {
    return false;
  }
  await file.close();
  return true;
};
