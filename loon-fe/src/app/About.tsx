import { getTrackById } from "@/common/AppContextProvider";
import { useUserStore } from "@/common/UserContextProvider";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export default function About() {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
  );
  const selectedTrack = getTrackById(selectedTrackId);

  const { data: pictures } = trpc.tracks.pictures.useQuery({
    id: selectedTrackId,
  });

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
                  <td>{val}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <div className="text-2xl font-bold">Pictures</div>
      <div>
        {pictures?.map((picture, i) => (
          <div key={i}>
            <div>
              <img src={picture.imgSrc} alt="cover" />
            </div>
            <div>type: {picture.type}</div>
            <div>format: {picture.format}</div>
            <div>name: {picture.name}</div>
            <div>description: {picture.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
