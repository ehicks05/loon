import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "../../env";

const spotify = SpotifyApi.withClientCredentials(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
);

const items = await spotify.search("The Beatles", ["artist"]);

console.table(
  items.artists.items.map((item) => ({
    name: item.name,
    followers: item.followers.total,
    popularity: item.popularity,
  })),
);

export { spotify };
