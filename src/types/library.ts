import type { Library } from '@/hooks/denormalize';

export type Artist = Library['artists'][number];
export type Album = Library['albums'][number];
export type Track = Library['tracks'][number];
