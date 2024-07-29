import React, { useEffect, useState } from "react";
import type { SystemSettings as ISystemSettings } from "../../../common/types";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../Button";
import Select from "../../Select";
import { CheckboxInput, TextInput } from "../../TextInput";
import { MusicFolderSummary } from "./MusicFolderSummary";
import { TRANSCODE_QUALITY_OPTIONS } from "./constants";

export default function SystemSettings() {
  const { data, isFetching } = trpc.misc.systemSettings.useQuery();
  const { mutate, isPending } = trpc.misc.setSystemSettings.useMutation();
  const isLoading = isFetching || isPending;

  // local, mutable cache
  const [settings, setSettings] = useState<ISystemSettings | undefined>(
    undefined,
  );

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  if (!settings) {
    return <div>Loading...</div>;
  }

  const onChange = (name: string, value: string | boolean) => {
    setSettings({ ...settings, [name]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="font-bold text-2xl">Admin</h1>
        <h2>Modify System</h2>
      </section>
      <section className="flex gap-4">
        <div className="flex flex-col gap-4 p-4 bg-black rounded">
          <div className={"flex flex-col gap-2"}>
            <div className="font-bold text-lg">General</div>
            <TextInput
              name="musicFolder"
              label="Music Folder"
              value={settings.musicFolder}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            <MusicFolderSummary />
            <CheckboxInput
              name="watchFiles"
              label="Watch Music Folder for Changes"
              checked={settings.watchFiles}
              onChange={(e) => onChange(e.target.name, e.target.checked)}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className="font-bold text-lg">
              Transcoder <span className="text-blue-500">(WIP)</span>
            </div>

            <TextInput
              name="transcodeFolder"
              label="Output Folder"
              value={settings.transcodeFolder}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
            <Select
              name="transcodeQuality"
              label="Quality"
              items={TRANSCODE_QUALITY_OPTIONS}
              value={settings.transcodeQuality}
              required={true}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>
          <Button
            className={"bg-green-600"}
            onClick={() => mutate(settings)}
            disabled={isLoading}
          >
            Save
          </Button>
        </div>

        <div className="flex flex-col gap-2 bg-black p-4 rounded">
          <div className="font-bold text-lg">Tasks</div>
          <div>
            <Button disabled={true} onClick={() => null}>
              Sync Library
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button disabled={true} onClick={() => null}>
              Step 1: Track Scan
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button disabled={true} onClick={() => null}>
              Step 2: Image Scan
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button disabled={true} onClick={() => null}>
              Step 3: Transcode
            </Button>
          </div>
          <Button className="bg-red-600" disabled={true} onClick={() => null}>
            Delete Tracks Without Files
          </Button>
          <Button className="bg-red-600" disabled={true} onClick={() => null}>
            Delete Library
          </Button>
        </div>
      </section>
    </div>
  );
}
