import { Link } from "react-router-dom";
import { getTrackById } from "../../common/AppContextProvider";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { useWindowSize } from "usehooks-ts";
import { useUserStore } from "../../common/UserContextProvider";

export default function TrackDescription() {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const { width } = useWindowSize();

  const selectedTrack = getTrackById(selectedTrackId);

  const artist = selectedTrack ? selectedTrack.artist : "";
  const albumArtist = selectedTrack ? selectedTrack.albumArtist : "";
  const album = selectedTrack ? selectedTrack.album : "";
  const title = selectedTrack ? selectedTrack.title : "";

  const textWidth = width >= 768 ? "calc(100vw - 408px)" : "100%";

  const imageUrl = selectedTrack?.spotifyAlbumImageThumb;

  // todo: does this need to be lazyload?
  const albumArt = (
    <img
      src={PLACEHOLDER_IMAGE_URL}
      data-src={imageUrl}
      alt="Placeholder"
      className="lazyload h-20 m-0 rounded"
    />
  );

  return (
    <div className="flex items-center justify-center md:justify-start gap-2">
      {albumArt}
      <span
        id="track"
        className="flex flex-col max-h-20 overflow-auto"
        style={{ maxWidth: textWidth }}
      >
        <b className="text-sm">{title}</b>
        <span id="artistAlbumText" className="text-sm">
          <Link to={`/artists/${artist}`}>{artist}</Link>
          {" - "}
          <Link to={`/artists/${albumArtist}/albums/${album}`}>
            <i>{album}</i>
          </Link>
        </span>
      </span>
    </div>
  );
}
