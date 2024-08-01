import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import type { Artist } from "@/app/Artists";
import { useAppStore } from "../common/AppContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "./utils";

export function ArtistCard({ artist }: { artist: Artist }) {
  const tracks = useAppStore((state) => state.tracks);

  const imageUrl = getImageUrl(artist.imageId);
  const contextMenuId = `artist=${artist.name}`;
  const artistTracks = tracks.filter((track) => track.artist === artist.name);

  return (
    <div>
      <div className="group relative">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={imageUrl}
          alt="Placeholder"
          className="lazyload rounded w-36 h-36 object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={artistTracks} contextMenuId={contextMenuId} />
        </div>
      </div>
      <div className="p-3">
        <Link to={`/artist/${artist.name}`}>{artist.name}</Link>
      </div>
    </div>
  );
}
