import { setTranscode, useUserStore } from "@/common/UserContextProvider";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export default function GeneralSettings() {
  const transcode = useUserStore((state) => state.userState.transcode);
  const [transcodeQuality, _] = useState("");

  const { data: user } = trpc.misc.me.useQuery();
  if (!user) {
    return <section>Please log in to access your settings.</section>;
  }

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="text-2xl font-bold">Settings</h1>
        <h2 className="subtitle">General Settings</h2>
      </section>
      <section>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="transcode"
            checked={transcode}
            onChange={(e) => setTranscode(e.target.checked)}
          />
          Prefer transcoded mp3 v{transcodeQuality} (if available)
        </label>
      </section>
    </div>
  );
}
