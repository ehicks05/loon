import React from "react";
import { getTrackById } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function About() {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );

  const selectedTrack = getTrackById(selectedTrackId);

  const selectedTrackInfoRows = selectedTrack
    ? Object.entries(selectedTrack).map(([key, val]) => (
        <tr key={key}>
          <td>{key}</td>
          <td>{val}</td>
        </tr>
      ))
    : null;

  return (
    <section className={"section"}>
      <div className={"subtitle"}>Selected Track Info</div>
      <table className={"table is-narrow"}>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{selectedTrackInfoRows}</tbody>
      </table>
    </section>
  );
}
