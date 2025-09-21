import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Album, Track } from '@/types/library';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toTrackNumber = (album: Album, track: Track) => {
	const multiDisc = (album.tracks.at(-1)?.discNumber || 0) > 1;
	return `${multiDisc ? `${track.discNumber}.` : ''}${track.trackNumber}` || 0;
};
