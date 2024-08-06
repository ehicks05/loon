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
  const artistTracks = tracks.filter((track) => track.artist === artist.name);

  return (
    <div className="group relative flex flex-col w-full items-start">
      <img
        src={PLACEHOLDER_IMAGE_URL}
        data-src={imageUrl}
        alt="Placeholder"
        className="lazyload w-full rounded-full object-cover"
      />
      <div className="invisible group-hover:visible absolute top-2 right-2">
        <ActionMenu tracks={artistTracks} />
      </div>
      <div className="absolute bottom-0 left-0 p-2 w-full bg-neutral-900 bg-opacity-75">
        <Link to={`/artists/${artist.name}`}>{artist.name}</Link>
      </div>
    </div>
  );
}
