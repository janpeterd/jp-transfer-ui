import LargeText from "@/components/LargeText";
import { deleteSharedLink, getUserSharedLinks } from "@/api/sharedLinks";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import { getStorageInfo } from "@/api/storage";
import { formatSize } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProfileStat from "@/components/ProfileStat";
import { SharedLink } from "@/models/SharedLink";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function Profile() {
  const queryClient = useQueryClient();
  const email = localStorage.getItem("email");
  const encodedEmail = btoa(email || "");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile", encodedEmail],
    queryFn: async () => getUserSharedLinks(encodedEmail),
    enabled: !!email,
  });
  const [usedSpace, setUsedSpace] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [sharedLinkRow, setSharedLinkRow] = useState<Row<SharedLink>>();

  const { data: storageData } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => getStorageInfo(),
  });


  const deleteSingleSharedLink = async (row: Row<SharedLink>) => {
    if (row.original.id !== undefined) {
      await deleteSharedLink(row.original.id);
    } else {
      toast.error("Failed to delete: ID is undefined");
    }
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("SharedLink deleted successfully");
  }

  const handleDelete = async (row: Row<SharedLink>) => {
    setOpen(true);
    setSharedLinkRow(row);
  };


  useEffect(() => {
    // get total file size from sharedlinks
    if (!data) return;
    setUsedSpace(data.reduce((acc: number, curr: any) => acc + curr.fileSize, 0));
  }, [data, usedSpace]);


  return (
    <>
      <div className="flex flex-col justify-center items-center text-white mb-24">
        <LargeText string="Profile" />
        <div className="flex flex-col gap-4 items-start justify-start bg-black/50 border-white/10 rounded-lg p-6 w-[90vw] max-w-[1200px] min-h-[65vh] z-30 overflow-auto">
          <h2 className="text-5xl font-bold">Overview</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-stretch items-stretch md:justify-start md:items-center w-full">
            {usedSpace > 0 &&
              <ProfileStat statName="Your space usage" statValue={formatSize(usedSpace)} />
            }
            {storageData && (
              <ProfileStat statName="System space Usage" statValue={`${Math.round((storageData?.usedSpace * 100 / storageData?.totalSpace) * 100) / 100}%`} />
            )}
          </div>
          {(data && data.length > 0) && (
            <>

              <hr className="w-full my-14 border-white/20" />
              <h2 className="text-5xl font-bold">Links <span className="text-lg italic ml-2 align-middle">{data.length} active links</span></h2>
              <div className="w-full overflow-auto">
                <DataTable data={data} columns={columns} reload_data={refetch} handleDelete={handleDelete} />
              </div>
            </>
          )}

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the link and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => sharedLinkRow && deleteSingleSharedLink(sharedLinkRow)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {isLoading && <p>Loading...</p>}
        </div>
      </div >
    </>
  );
}
