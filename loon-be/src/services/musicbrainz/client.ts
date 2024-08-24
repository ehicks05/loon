import { MusicBrainzApi } from "musicbrainz-api";
import { env } from "../../env.js";

export const musicBrainz = new MusicBrainzApi({
  appName: "loon",
  appVersion: "0.1.0",
  appContactInfo: env.MUSICBRAINZ_CONTACT_EMAIL,
});
