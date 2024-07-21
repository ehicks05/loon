import React, { useEffect, useState } from "react";
import apiUrl from "../../../apiUrl";
import superFetch from "../../../common/SuperFetch";
import { Button } from "../../Button";
import Select from "../../Select";
import TextInput from "../../TextInput";

const transcodeQualityOptions = [
  { value: "0", text: "v0 (~240 Kbps)" },
  { value: "1", text: "v1 (~220 Kbps)" },
  { value: "2", text: "v2 (~190 Kbps)" },
  { value: "3", text: "v3 (~170 Kbps)" },
  { value: "4", text: "v4 (~160 Kbps)" },
  { value: "5", text: "v5 (~130 Kbps)" },
  { value: "6", text: "v6 (~120 Kbps)" },
];

export default function SystemSettings() {
  const [settings, setSettings] = useState(null);
  const [taskState, setTaskState] = useState(null);

  useEffect(() => {
    superFetch("/admin/systemSettings", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setSettings(data));
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${apiUrl}/system-events`, {
      withCredentials: true,
    });
    eventSource.addEventListener("taskStateUpdate", (e) => {
      setTaskState(JSON.parse(e.data));
    });

    return function cleanup() {
      eventSource.close();
    };
  }, []);

  function tasksInProgress() {
    if (!taskState?.tasks) return null;

    let inProgress = Object.entries(taskState.tasks).filter(
      (entry) => entry[1].status === "incomplete",
    );
    if (inProgress.filter((task) => task[0] === "LibrarySyncTask").length === 1)
      inProgress = inProgress.filter((task) => task[0] === "LibrarySyncTask");

    return inProgress;
  }

  function submitForm(
    rescan,
    deleteTracksWithoutFiles,
    deleteLibrary,
    librarySync,
  ) {
    if (deleteTracksWithoutFiles || deleteLibrary)
      if (!window.confirm("Are you sure?")) return;

    const formData = new FormData(document.getElementById("frmSystemSettings"));
    formData.append("rescan", rescan ? "true" : "false");
    formData.append(
      "deleteTracksWithoutFiles",
      deleteTracksWithoutFiles ? "true" : "false",
    );
    formData.append("deleteLibrary", deleteLibrary ? "true" : "false");
    formData.append("librarySync", librarySync ? "true" : "false");

    updateSystemSettings(formData).then(() => {
      if (deleteTracksWithoutFiles || deleteLibrary) {
        const action = deleteTracksWithoutFiles
          ? "deleting tracks without files"
          : "deleting library";
        console.log(
          `Finished ${action}. Refreshing track listing and playlists.`,
        );

        // todo reimplement
        // self.props.store.appState.loadTracks();
        // self.props.store.appState.loadPlaylists();
      }
    });
  }

  function updateSystemSettings(formData) {
    return superFetch("/admin/systemSettings", {
      method: "PUT",
      body: formData,
    }).then((response) => response.json());
  }

  function doImageScan() {
    superFetch("/admin/systemSettings/imageScan", { method: "GET" });
  }

  function doTranscodeLibrary() {
    superFetch("/admin/systemSettings/transcodeLibrary", { method: "GET" });
  }

  if (!settings || !taskState) return <div>Loading...</div>;

  const isTasksRunning = taskState.tasksRunning > 0;

  return (
    <div>
      <SystemStatusBar
        tasks={taskState.tasks}
        tasksInProgress={tasksInProgress()}
      />
      <section className={"section"}>
        <h1 className="font-bold text-2xl">Admin</h1>
        <h2 className="">Modify System</h2>
      </section>
      <section className="section">
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
              <TextInput
                id="instanceName"
                label="Instance Name"
                value={settings.instanceName}
              />
              <TextInput
                id="logonMessage"
                label="Welcome Message"
                value={settings.logonMessage}
                size={50}
              />
              <div className="field">
                <input
                  type="checkbox"
                  id="registrationEnabled"
                  name="registrationEnabled"
                  defaultChecked={settings.registrationEnabled}
                />
                <label
                  htmlFor="registrationEnabled"
                  style={{ padding: ".5rem" }}
                >
                  Enable Signups
                </label>
              </div>
              <div className="field">
                <input
                  type="checkbox"
                  id="directoryWatcherEnabled"
                  name="directoryWatcherEnabled"
                  defaultChecked={settings.directoryWatcherEnabled}
                />
                <label
                  htmlFor="directoryWatcherEnabled"
                  style={{ padding: ".5rem" }}
                >
                  Enable Directory Watcher
                </label>
              </div>
              <Select
                id="transcodeQuality"
                label="Transcode Quality"
                items={transcodeQualityOptions}
                value={settings.transcodeQuality}
                required={true}
              />
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className="font-bold text-lg">Locations</div>
              <TextInput
                id="musicFolder"
                label="Music Folder"
                value={settings.musicFolder}
              />
              <TextInput
                id="transcodeFolder"
                label="Transcode Folder"
                value={settings.transcodeFolder}
              />
              <TextInput
                id="dataFolder"
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
                <ProgressText taskStatus={taskState.tasks.LibrarySyncTask} />
              </div>
              <div className={"ml-4"}>
                <Button
                  disabled={isTasksRunning}
                  onClick={() => submitForm(true, false, false, false)}
                >
                  Step 1: Track Scan
                </Button>
                <ProgressText taskStatus={taskState.tasks.MusicScanner} />
              </div>
              <div className={"ml-4"}>
                <Button disabled={isTasksRunning} onClick={() => doImageScan()}>
                  Step 2: Image Scan
                </Button>
                <ProgressText taskStatus={taskState.tasks.ImageScanner} />
              </div>
              <div className={"ml-4"}>
                <Button
                  disabled={isTasksRunning}
                  onClick={() => doTranscodeLibrary()}
                >
                  Step 3: Transcode
                </Button>
                <ProgressText taskStatus={taskState.tasks.TranscoderTask} />
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

function ProgressText(props) {
  if (!props.taskStatus) return null;

  const progress = props.taskStatus.progress;
  const status = props.taskStatus.status;
  const progressClass = `button ${status === "complete" ? "is-success" : "is-info"}`;
  const showProgressBar = status === "complete" || status === "incomplete";

  return (
    showProgressBar && (
      <span className={progressClass} style={{}}>
        {progress}%
      </span>
    )
  );
}

function SystemStatusBar(props) {
  const tasks = props.tasks;
  if (!tasks) return null;

  const tasksInProgress = props.tasksInProgress;
  const progress =
    tasksInProgress.length !== 1 ? 0 : String(tasksInProgress[0][1].progress);

  return (
    <div>
      <progress
        className="progress is-info is-small"
        value={progress}
        max="100"
        style={{ borderRadius: 0, height: "6px" }}
      >
        test
      </progress>
    </div>
  );
}
