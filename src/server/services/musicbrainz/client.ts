import { env } from "../../../../src/server/env.js";
import type { IArtist } from "./types.js";

const BASE = "https://musicbrainz.org/ws/2";

const APP_NAME = "loon";
const APP_VERSION = "0.1.0";
const APP_CONTACT = env.APP_CONTACT_EMAIL;
const userAgent = `${APP_NAME}/${APP_VERSION} (${APP_CONTACT})`;
const headers = {
  headers: { "User-Agent": userAgent },
};

const PARAMS = new URLSearchParams({ fmt: "json" }).toString();

export const musicBrainz = {
  lookup: async (entity: "artist", id: string) => {
    const url = `${BASE}/${entity}/${id}?${PARAMS}`;
    const response = await fetch(url, headers);

    if (response.status !== 200) {
      console.log(url, response);
    }

    const json = (await response.json()) as IArtist;
    return json;
  },
};
