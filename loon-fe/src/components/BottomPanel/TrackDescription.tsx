import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { Link } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { getTrackById } from "../../hooks/useLibraryStore";
import { useUserStore } from "../../hooks/useUserStore";

export default function TrackDescription() {
  const { width } = useWindowSize();
  const textWidth = width >= 768 ? "calc(100vw - 408px)" : "100%";

  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const track = getTrackById(selectedTrackId);

  const imageUrl = track?.album?.imageThumb;

  return (
    <div className="flex items-center justify-center md:justify-start gap-2">
      <img
        src={imageUrl || PLACEHOLDER_IMAGE_URL}
        data-src={imageUrl}
        alt="albumArt"
        className="h-20 m-0 rounded"
      />
      {track && (
        <span
          className="flex flex-col max-h-20 overflow-auto"
          style={{ maxWidth: textWidth }}
        >
          <b className="text-sm">{track.title}</b>
          <span className="flex flex-col text-sm">
            <div>
              {track.artists.map(({ id, name }, i) => (
                <span key={id}>
                  {i !== 0 && ", "}
                  <Link to={`/artists/${id}`}>{name}</Link>
                </span>
              ))}
            </div>
            <Link to={`/albums/${track.album.id}`}>
              <i>{track.album.name}</i>
            </Link>
          </span>
        </span>
      )}
    </div>
  );
}
