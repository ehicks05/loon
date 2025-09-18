import { type Dirent, openAsBlob } from 'node:fs';
import { readdir } from 'node:fs/promises';

const SUPPORTED_MEDIA_TYPES = ['flac', 'mp3'];

const isSupportedFile = (file: Dirent) =>
	!file.isDirectory() &&
	SUPPORTED_MEDIA_TYPES.some((type) => file.name.endsWith(type));

const toFullPath = (file: Dirent) => `${file.parentPath}\\${file.name}`;

export const listMediaFiles = async (path: string) => {
	const files = await readdir(path, { recursive: true, withFileTypes: true });
	const filtered = files.filter(isSupportedFile).map(toFullPath);

	return filtered;
};

export const doesFileExist = async (path: string) => {
	const blob = await openAsBlob(path);
	if (!blob) {
		return false;
	}
	return true;
};
