import LargeText from "@/components/LargeText";
import { useQuery } from "@tanstack/react-query";
import { getUserSharedLinks } from "@/api/sharedLinks";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import { getStorageInfo } from "@/api/storage";
import { formatSize } from "@/lib/utils";
import { useEffect, useState } from "react";
import ProfileStat from "@/components/ProfileStat";

export default function Profile() {
  const email = localStorage.getItem("email");
  const encodedEmail = btoa(email || "");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile", encodedEmail],
    queryFn: async () => getUserSharedLinks(encodedEmail),
    enabled: !!email,
  });
  const [usedSpace, setUsedSpace] = useState<number>(0);

  const { data: storageData } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => getStorageInfo(),
  });

  useEffect(() => {
    // get total file size from sharedlinks
    if (!data) return;
    setUsedSpace(data.reduce((acc: number, curr: any) => acc + curr.fileSize, 0));
    console.log("usedSpace", usedSpace)
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
              <h2 className="text-5xl font-bold">Links</h2>
              <div className="w-full overflow-auto">
                <DataTable data={data} columns={columns} reload_data={refetch} />
              </div>
          </>
          )}

          {isLoading && <p>Loading...</p>}
        </div>
      </div >
    </>
  );
}
