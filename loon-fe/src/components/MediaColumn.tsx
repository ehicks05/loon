import { getTrackById, useAppStore } from "@/common/AppContextProvider";
import { useUserStore } from "@/common/UserContextProvider";
import { PLACEHOLDER_IMAGE_URL } from "@/constants";

export const MediaColumn = () => {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const track = getTrackById(selectedTrackId);
  const artist = useAppStore((state) => state.artists).find(
    (o) => o.name === track?.artist,
  );
  const album = artist?.albums.find((o) => o.name === track?.album);

  if (!artist || !album) return "Welcome!";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <img
          src={artist.image || PLACEHOLDER_IMAGE_URL}
          alt="artist"
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold">{artist.name}</h1>
      </div>

      <div className="flex flex-col gap-2">
        <img
          src={album.image || PLACEHOLDER_IMAGE_URL}
          alt="artist"
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold">{album.name}</h1>
      </div>
    </div>
  );
};
