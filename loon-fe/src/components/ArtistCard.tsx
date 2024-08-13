import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import type { Artist } from "@/common/types";
import { PLACEHOLDER_IMAGE_URL } from "@/constants";

interface Props {
  artist: Artist;
  size: "full" | "thumb";
}

export function ArtistCard({ artist, size }: Props) {
  const imageUrl = size === "full" ? artist.image : artist.imageThumb;
  const { albums, tracks } = artist;

  return (
    <div className="group relative flex flex-col w-full items-start">
      <div className="flex flex-shrink-0 w-full">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={imageUrl}
          alt="artist"
          className="lazyload rounded-lg aspect-square w-full object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={tracks} />
        </div>
      </div>
      <div className="p-2 bg-neutral-900 bg-opacity-75">
        <Link className="text-lg" to={`/artists/${artist.name}`}>
          {artist.name}
        </Link>
        <div className="text-sm">
          <span className="text-green-500 font-bold">{albums.length}</span>{" "}
          album{albums.length !== 1 ? "s" : ""}
        </div>
        <div className="text-sm">
          <span className="text-green-500 font-bold">{tracks.length}</span>{" "}
          track{tracks.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
