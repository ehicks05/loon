import React from "react";
import Albums from "./Albums";
import { ArtistCard } from "../ArtistCard";
import { useAppStore } from "../../common/AppContextProvider";
import { useWindowSize } from "react-use";
import MediaItem from "../MediaItem";
import _ from "lodash";

export default function Artist(props) {
  const tracks = useAppStore((state) => state.tracks);
  const windowSize = useWindowSize();

  if (!tracks) return <div>Loading...</div>;

  const artistParam = props.match.params.artist;

  const artistTracks = _.chain(tracks)
    .filter((track) => track.artist === artistParam)
    .sortBy(["album", "discNumber", "trackNumber"])
    .value();

  const artist = {
    artistName: artistTracks[0].artist,
    artistImageId: artistTracks[0].artistImageId,
  };

  const maxWidth = windowSize.width > 768 ? "100%" : "500px";

  const mediaItems = artistTracks.map((track) => {
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
    <div>
      <section className={"section"}>
        <div className="columns">
          <div className="column is-one-third">
            <div style={{ maxWidth: maxWidth, margin: "auto" }}>
              <ArtistCard artist={artist} />
            </div>
          </div>
          <div className="column">
            <div
              className="subtitle"
              style={{ padding: ".25rem", margin: "0" }}
            >
              Albums
            </div>
            <Albums
              tracks={artistTracks}
              hideTitle={true}
              hideAlbumArtist={true}
            />

            <div
              className="subtitle"
              style={{ padding: ".25rem", margin: ".5em 0 0 0" }}
            >
              Tracks
            </div>
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
    </div>
  );
}
