import React from "react";
import MediaItem from "../MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "../../common/AppContextProvider";
import { useWindowSize } from "react-use";
import AlbumCard from "../AlbumCard";
import _ from "lodash";

export default function Album(props) {
  const artist = props.match.params.artist;
  const album = props.match.params.album;

  const tracks = useAppStore((state) => state.tracks);
  const maxWidth = useWindowSize().width >= 768 ? "100%" : "500px";

  if (!tracks) return <div>Loading...</div>;

  const albumTracks = _.chain(tracks)
    .filter((track) => track.albumArtist === artist && track.album === album)
    .sortBy(["discNumber", "trackNumber"])
    .value();

  const mediaItems = albumTracks.map((track) => {
    return (
      <MediaItem
        key={track.id}
        playlistId={0}
        track={track}
        trackNumber={track.discNumber + "." + track.trackNumber}
      />
    );
  });

  return (
    <section className={"section"}>
      <div className="columns">
        <div className="column is-one-third">
          <div style={{ maxWidth: maxWidth, margin: "auto" }}>
            <AlbumCard
              album={{
                albumArtist: albumTracks[0].albumArtist,
                album: albumTracks[0].album,
                albumImageId: albumTracks[0].albumImageId,
              }}
            />
          </div>
        </div>
        <div className="column">
          <ul
            id="list"
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              flexGrow: "1",
            }}
          >
            {mediaItems}
          </ul>
        </div>
      </div>
    </section>
  );
}
