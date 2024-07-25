import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "../../Button";
import Select from "../../Select";
import { TextInput } from "../../TextInput";

const transcodeQualityOptions = [
  { value: "v0", text: "v0 (~240 Kbps)" },
  { value: "v1", text: "v1 (~220 Kbps)" },
  { value: "v2", text: "v2 (~190 Kbps)" },
  { value: "v3", text: "v3 (~170 Kbps)" },
  { value: "v4", text: "v4 (~160 Kbps)" },
  { value: "v5", text: "v5 (~130 Kbps)" },
  { value: "v6", text: "v6 (~120 Kbps)" },
];

export default function SystemSettings() {
  const { data: settings } = trpc.misc.systemSettings.useQuery();

  if (!settings) {
    return <div>Loading...</div>;
  }

  const isTasksRunning = false;

  return (
    <div className="flex flex-col gap-4">
      <section className={""}>
        <h1 className="font-bold text-2xl">Admin</h1>
        <h2 className="">Modify System</h2>
      </section>
      <section className="">
        <form id="frmSystemSettings" method="post" action="">
          <Button
            className={"bg-green-600"}
            onClick={() => submitForm(false, false, false, false)}
          >
            Save
          </Button>
          <div className={"flex flex-wrap gap-4"}>
            <div className={"flex flex-col gap-2"}>
              <div className="font-bold text-lg">General</div>
              <div className="field">
                <input
                  type="checkbox"
                  name="watchFiles"
                  defaultChecked={settings.watchFiles}
                />
                <label htmlFor="watchFiles" style={{ padding: ".5rem" }}>
                  Enable Directory Watcher
                </label>
              </div>
              <Select
                name="transcodeQuality"
                label="Transcode Quality"
                items={transcodeQualityOptions}
                value={settings.transcodeQuality}
                required={true}
              />
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className="font-bold text-lg">Locations</div>
              <TextInput
                name="musicFolder"
                label="Music Folder"
                value={settings.musicFolder}
              />
              <TextInput
                name="transcodeFolder"
                label="Transcode Folder"
                value={settings.transcodeFolder}
              />
              <TextInput
                name="dataFolder"
                label="Data Folder"
                value={settings.dataFolder}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="font-bold text-lg">Tasks</div>
              <div>
                <Button
                  disabled={isTasksRunning}
                  onClick={() => submitForm(false, false, false, true)}
                >
                  Library Sync
                </Button>
              </div>
              <div className={"ml-4"}>
                <Button
                  disabled={isTasksRunning}
                  onClick={() => submitForm(true, false, false, false)}
                >
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
                onClick={() => submitForm(false, true, false, false)}
              >
                Delete Tracks Without Files
              </Button>
              <Button
                className="bg-red-600"
                disabled={isTasksRunning}
                onClick={() => submitForm(false, false, true, false)}
              >
                Delete Library
              </Button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
