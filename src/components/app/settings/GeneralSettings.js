import React, { useEffect, useState } from "react";
import {
  useUserStore,
  setTranscode,
} from "../../../common/UserContextProvider";
import superFetch from "../../../common/SuperFetch";

export default function GeneralSettings() {
  const transcode = useUserStore((state) => state.userState.transcode);
  const [transcodeQuality, setTranscodeQuality] = useState("");

  useEffect(() => {
    superFetch("/systemSettings/transcodeQuality", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setTranscodeQuality(data));
  }, []);

  function handleSetTranscode(e) {
    setTranscode(e.target.checked);
  }

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Settings</h1>
        <h2 className="subtitle">General Settings</h2>
      </section>
      <section className="section">
        <form id="frmGeneralSettings" method="post" action="">
          <div className="field">
            <input
              type="checkbox"
              id="transcode"
              name="transcode"
              checked={transcode}
              onChange={(e) => handleSetTranscode(e)}
            />
            <label htmlFor="transcode" style={{ padding: ".5rem" }}>
              Prefer transcoded mp3 v{transcodeQuality} (if available)
            </label>
          </div>
        </form>
      </section>
    </div>
  );
}
