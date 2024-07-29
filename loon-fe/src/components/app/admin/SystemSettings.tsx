import React, { useEffect, useState } from "react";
import type { SystemSettings as ISystemSettings } from "../../../common/types";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../Button";
import Select from "../../Select";
import { CheckboxInput, TextInput } from "../../TextInput";

const transcodeQualityOptions = [
  { value: "v0", text: "v0 (~240 Kbps)" },
  { value: "v1", text: "v1 (~220 Kbps)" },
  { value: "v2", text: "v2 (~190 Kbps)" },
  { value: "v3", text: "v3 (~170 Kbps)" },
  { value: "v4", text: "v4 (~160 Kbps)" },
  { value: "v5", text: "v5 (~130 Kbps)" },
  { value: "v6", text: "v6 (~120 Kbps)" },
];

const MusicFolderSummary = () => {
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching, refetch } = trpc.tracks.musicFolderSummary.useQuery(
    null,
    { enabled },
  );
  const fileCount = data?.mediaFiles.length;

  const handleClick = () => {
    if (!enabled) {
      setEnabled(true);
    } else {
      refetch();
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button disabled={isFetching} className="text-sm" onClick={handleClick}>
        Check
      </Button>

      {data && (
        <span className="text-sm">
          Found{" "}
          {isFetching ? (
            "?"
          ) : (
            <span
              className={`font-bold ${fileCount ? "text-green-500" : "text-red-500"}`}
            >
              {fileCount}
            </span>
          )}{" "}
          media files
        </span>
      )}
    </div>
  );
};

export default function SystemSettings() {
  const { data, isFetching: isQueryFetching } =
    trpc.misc.systemSettings.useQuery();
  const { mutate, isPending: isMutationPending } =
    trpc.misc.setSystemSettings.useMutation();
  const isLoading = isQueryFetching || isMutationPending;

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

  const submitForm = () => {
    mutate(settings);
  };

  const onChange = (name: string, value: string | boolean) => {
    setSettings({ ...settings, [name]: value });
  };

  const isTasksRunning = false;

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
              items={transcodeQualityOptions}
              value={settings.transcodeQuality}
              required={true}
              onChange={(e) => onChange(e.target.name, e.target.value)}
            />
          </div>
          <Button
            className={"bg-green-600"}
            onClick={submitForm}
            disabled={isLoading}
          >
            Save
          </Button>
        </div>

        <div className="flex flex-col gap-2 bg-black p-4 rounded">
          <div className="font-bold text-lg">Tasks</div>
          <div>
            <Button disabled={isTasksRunning} onClick={() => submitForm()}>
              Library Sync
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button disabled={isTasksRunning} onClick={() => submitForm()}>
              Step 1: Track Scan
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button disabled={isTasksRunning} onClick={() => doImageScan()}>
              Step 2: Image Scan
            </Button>
          </div>
          <div className={"ml-4"}>
            <Button
              disabled={isTasksRunning}
              onClick={() => doTranscodeLibrary()}
            >
              Step 3: Transcode
            </Button>
          </div>
          <Button
            className="bg-red-600"
            disabled={isTasksRunning}
            onClick={() => submitForm()}
          >
            Delete Tracks Without Files
          </Button>
          <Button
            className="bg-red-600"
            disabled={isTasksRunning}
            onClick={() => submitForm()}
          >
            Delete Library
          </Button>
        </div>
      </section>
    </div>
  );
}
