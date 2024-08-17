import { getTrackById } from "@/hooks/useLibraryStore";
import { useUserStore } from "@/hooks/useUserStore";

export default function About() {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrack = getTrackById(selectedTrackId);

  return (
    <section className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Selected Track Info</div>
      <table className="text-left">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {selectedTrack
            ? Object.entries(selectedTrack).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val?.toString()}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </section>
  );
}
