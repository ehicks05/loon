import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import type { Artist } from "@/app/Artists";
import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { uniq } from "lodash";
import { useAppStore } from "../common/AppContextProvider";

export function ArtistCard({
  artist,
  size,
}: { artist: Artist; size: "full" | "thumb" }) {
  const tracks = useAppStore((state) => state.tracks);

  const imageUrl = size === "full" ? artist.image : artist.imageThumb;
  const artistTracks = tracks.filter((track) => track.artist === artist.name);
  const artistAlbums = uniq(artistTracks.map((track) => track.album));

  return (
    <div className="group relative flex w-full items-start">
      <div className="flex flex-shrink-0 h-32 w-32">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={imageUrl}
          alt="Placeholder"
          className="lazyload rounded-lg w-32 h-32 object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={artistTracks} />
        </div>
      </div>
      <div className="p-2 bg-neutral-900 bg-opacity-75">
        <Link className="text-lg" to={`/artists/${artist.name}`}>
          {artist.name}
        </Link>
        <div className="text-sm">
          <span className="text-green-500 font-bold">
            {artistAlbums.length}
          </span>{" "}
          album{artistAlbums.length !== 1 ? "s" : ""}
        </div>
        <div className="text-sm">
          <span className="text-green-500 font-bold">
            {artistTracks.length}
          </span>{" "}
          track{artistTracks.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
