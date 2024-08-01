import { trpc } from "@/utils/trpc";
import React, { useEffect, useState } from "react";
import superFetch from "../../../common/SuperFetch";
import {
  setTranscode,
  useUserStore,
} from "../../../common/UserContextProvider";

export default function GeneralSettings() {
  const transcode = useUserStore((state) => state.userState.transcode);
  const [transcodeQuality, setTranscodeQuality] = useState("");

  const { data: user } = trpc.misc.me.useQuery();
  if (!user) {
    return <section>Please log in to access your settings.</section>;
  }

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Settings</h1>
        <h2 className="subtitle">General Settings</h2>
      </section>
      <section className="section">
        <div className="field">
          <input
            type="checkbox"
            id="transcode"
            name="transcode"
            checked={transcode}
            onChange={(e) => setTranscode(e.target.checked)}
          />
          <label htmlFor="transcode" style={{ padding: ".5rem" }}>
            Prefer transcoded mp3 v{transcodeQuality} (if available)
          </label>
        </div>
      </section>
    </div>
  );
}
