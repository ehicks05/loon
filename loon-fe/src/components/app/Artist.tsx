import { sortBy } from "lodash";
import React from "react";
import { useRouteMatch } from "react-router-dom";
import { useAppStore } from "../../common/AppContextProvider";
import { ArtistCard } from "../ArtistCard";
import MediaItem from "../MediaItem";
import Albums from "./Albums";

export default function Artist() {
  const { params } = useRouteMatch<{ artist: string }>();
  const artistParam = params.artist;
  const tracks = useAppStore((state) => state.tracks);

  const artistTracks = sortBy(
    tracks.filter((track) => track.artist === artistParam),
    ["album", "discNumber", "trackNumber"],
  );

  return (
    <div>
      <section className="">
        <div className="">
          <div className="">
            <ArtistCard
              artist={{
                name: artistTracks[0].artist,
                imageId: artistTracks[0].artistImageId,
              }}
            />
          </div>
          <div className="">
            <div className="text-lg font-bold">Albums</div>
            <Albums tracks={artistTracks} hideAlbumArtist={true} />

            <div className="text-lg font-bold">Tracks</div>
            <ul className="flex flex-col">
              {artistTracks.map((track) => (
                <MediaItem
                  key={track.id}
                  playlistId={0}
                  track={track}
                  trackNumber={`${track.discNumber}.${track.trackNumber}`}
                />
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
