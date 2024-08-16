import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { Link } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { getTrackById } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function TrackDescription() {
  const { width } = useWindowSize();
  const textWidth = width >= 768 ? "calc(100vw - 408px)" : "100%";

  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrack = getTrackById(selectedTrackId);

  const artists = selectedTrack?.artists || [];
  const album = selectedTrack?.album;
  const title = selectedTrack?.title;
  const imageUrl = selectedTrack?.spotifyAlbumImageThumb;

  return (
    <div className="flex items-center justify-center md:justify-start gap-2">
      <img
        src={imageUrl || PLACEHOLDER_IMAGE_URL}
        data-src={imageUrl}
        alt="albumArt"
        className="h-20 m-0 rounded"
      />
      {selectedTrack && (
        <span
          className="flex flex-col max-h-20 overflow-auto"
          style={{ maxWidth: textWidth }}
        >
          <b className="text-sm">{title}</b>
          <span className="flex flex-col text-sm">
            <div>
              {artists.map((artist, i) => (
                <span key={artist}>
                  {i !== 0 && ", "}
                  <Link to={`/artists/${artist}`}>{artist}</Link>
                </span>
              ))}
            </div>
            <Link to={`/artists/${artists[0]}/albums/${album}`}>
              <i>{album}</i>
            </Link>
          </span>
        </span>
      )}
    </div>
  );
}
