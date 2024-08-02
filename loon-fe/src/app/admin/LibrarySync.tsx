import { Button } from "@/components/Button";
import { CheckboxInput } from "@/components/TextInput";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

const DEFAULT_SYNC_OPTIONS = {
  scanTracks: false,
  scanImages: false,
  transcode: false,
};

export const LibrarySync = () => {
  const [options, setOptions] = useState(DEFAULT_SYNC_OPTIONS);
  const [isSyncing, setIsSyncing] = useState(false);

  const { data } = trpc.system.librarySyncStatus.useQuery();
  const { mutate, isPending } = trpc.system.runLibrarySync.useMutation();

  const isDisableForm = isPending || isSyncing;

  useEffect(() => {
    if (data) {
      setIsSyncing(data.inProgress);
    }
  }, [data]);

  const runLibrarySync = () => {
    mutate();
    setIsSyncing(true);
  };

  const onChange = (name: string, value: string | boolean) => {
    setOptions({ ...options, [name]: value });
  };

  return (
    <div className="flex flex-col gap-8 bg-black p-4 rounded">
      <div>
        <div className="font-bold text-lg">Sync</div>
        <CheckboxInput
          label="Tracks"
          name="scanTracks"
          checked={options.scanTracks}
          onChange={(e) => onChange(e.target.name, e.target.checked)}
          disabled={isDisableForm}
        />
        <CheckboxInput
          label="Images"
          name="scanImages"
          checked={options.scanImages}
          onChange={(e) => onChange(e.target.name, e.target.checked)}
          disabled={isDisableForm}
        />
        <CheckboxInput
          label="Transcode"
          name="transcode"
          checked={options.transcode}
          onChange={(e) => onChange(e.target.name, e.target.checked)}
          disabled={isDisableForm}
        />
        <Button
          className="bg-green-600"
          disabled={isDisableForm}
          onClick={runLibrarySync}
        >
          Sync Library
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="font-bold text-lg">Cleanup</div>

        <Button
          className="bg-red-700"
          disabled={isDisableForm}
          onClick={() => alert("not implemented")}
        >
          Delete Tracks Without Files
        </Button>
        <Button
          className="bg-red-700"
          disabled={isDisableForm}
          onClick={() => alert("not implemented")}
        >
          Delete Library
        </Button>
      </div>
    </div>
  );
};
