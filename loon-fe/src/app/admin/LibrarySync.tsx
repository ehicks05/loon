import { Button } from "@/components/Button";
import { trpc } from "@/utils/trpc";
import { useInterval } from "usehooks-ts";

export const LibrarySync = () => {
  const {
    data: syncStatus,
    isLoading,
    refetch,
  } = trpc.system.status.useQuery();
  const { mutate: runLibrarySync, isPending } =
    trpc.system.syncLibrary.useMutation({
      onSuccess: () => refetch(),
    });

  const isDisableForm = isLoading || isPending || syncStatus?.inProgress;

  useInterval(refetch, syncStatus?.inProgress ? 30_000 : null);

  return (
    <div className="flex flex-col gap-8 bg-black p-4 rounded">
      <div className="flex flex-col gap-2">
        <div className="font-bold text-lg">Sync</div>
        <Button
          className="bg-green-600"
          disabled={isDisableForm}
          onClick={() => runLibrarySync()}
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
