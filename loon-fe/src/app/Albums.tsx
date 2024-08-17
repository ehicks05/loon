import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import AlbumCard from "@/components/AlbumCard";
import { useLibraryStore } from "@/hooks/useLibraryStore";

interface Props {
  artist?: string;
  hideAlbumArtist?: boolean;
}

export default function Albums({ artist, hideAlbumArtist }: Props) {
  const albums = useLibraryStore((state) => state.albums).filter((o) =>
    artist ? o.artist === artist : true,
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{albums.length} Albums</h2>
      <div className="grid gap-4 w-full grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))]">
        {albums.map((album) => (
          <AlbumCard
            key={`${album.artist}-${album.name}`}
            album={album}
            hideAlbumArtist={hideAlbumArtist}
          />
        ))}
      </div>
    </div>
  );
}
