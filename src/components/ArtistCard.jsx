import React from "react";
import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "../common/AppContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "./utils";

export function ArtistCard({ artist }) {
  const tracks = useAppStore((state) => state.tracks);

  const imageUrl = getImageUrl(artist.artistImageId);
  const contextMenuId = `artist=${artist.artistName}`;
  const artistTracks = tracks.filter(
    (track) => track.artist === artist.artistName,
  );

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
        <Link to={`/artist/${artist.artistName}`}>{artist.artistName}</Link>
      </div>
    </div>
  );
}
