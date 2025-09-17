// from https://github.com/Borewit/musicbrainz-api/blob/master/lib/musicbrainz.types.ts

export interface IPeriod {
  begin: string;
  ended: boolean;
  end: string;
}

export interface IArtist {
  id: string;
  name: string;
  disambiguation: string;
  "sort-name": string;
  "type-id"?: string;
  "gender-id"?: string;
  "life-span"?: IPeriod;
  country?: string;
  ipis?: string[];
  isnis?: string[];
  gender?: string;
  type?: string;
}
