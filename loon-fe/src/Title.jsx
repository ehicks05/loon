import { useAppStore, getTrackById } from "@/common/AppContextProvider";
import { useUserStore } from "@/common/UserContextProvider";
import { useEffect } from "react";

export default function Title() {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  const tracks = useAppStore((state) => state.tracks);

  useEffect(() => {
    const selectedTrack = getTrackById(selectedTrackId);

    window.document.title = selectedTrack
      ? `${selectedTrack.title} by ${selectedTrack.artist}`
      : "Loon";
  }, [tracks, selectedTrackId]);

  return null;
}
