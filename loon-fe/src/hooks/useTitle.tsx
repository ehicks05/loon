import { getTrackById } from "@/common/AppContextProvider";
import { useUserStore } from "@/hooks/useUserStore";
import { useDocumentTitle } from "usehooks-ts";

export function useTitle() {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrack = getTrackById(selectedTrackId);

  const title = selectedTrack
    ? `${selectedTrack.title} by ${selectedTrack.artist}`
    : "Loon";

  useDocumentTitle(title);
}
