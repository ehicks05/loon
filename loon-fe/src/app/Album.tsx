import MediaItem from "@/components/MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "@/common/AppContextProvider";
import AlbumCard from "@/components/AlbumCard";
import { sortBy } from "lodash";
import { useRouteMatch } from "react-router-dom";
import { useWindowSize } from "react-use";

export default function Album() {
  const {
    params: { album, artist },
  } = useRouteMatch<{ artist: string; album: string }>();

  const tracks = useAppStore((state) => state.tracks);
  const maxWidth = useWindowSize().width >= 768 ? "100%" : "500px";

  const albumTracks = sortBy(
    tracks.filter(
      (track) => track.albumArtist === artist && track.album === album,
    ),
    ["discNumber", "trackNumber"],
  );

  const mediaItems = albumTracks.map((track) => {
    return (
      <MediaItem
        key={track.id}
        playlistId={""}
        track={track}
        trackNumber={`${track.discNumber}.${track.trackNumber}`}
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
                artist: albumTracks[0].albumArtist,
                name: albumTracks[0].album,
                imageId: albumTracks[0].spotifyAlbumImageThumb,
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
