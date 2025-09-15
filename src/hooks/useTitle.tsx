import { getTrackById } from "@/hooks/useLibraryStore";
import { useUserStore } from "@/hooks/useUserStore";
import { useDocumentTitle } from "usehooks-ts";

export function useTitle() {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrack = getTrackById(selectedTrackId);

  const title = selectedTrack
    ? `${selectedTrack.title} by ${selectedTrack.artists.map((artist) => artist.name).join(", ")}`
    : "Loon";

  useDocumentTitle(title);
}
