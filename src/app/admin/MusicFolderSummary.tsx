import { Button } from "@/components/Button";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export const MusicFolderSummary = () => {
  const [enabled, setEnabled] = useState(false);

  const { data, isFetching, refetch } = trpc.system.listMusicFolder.useQuery(
    undefined,
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
              {fileCount && Intl.NumberFormat().format(fileCount)}
            </span>
          )}{" "}
          media files
        </span>
      )}
    </div>
  );
};
