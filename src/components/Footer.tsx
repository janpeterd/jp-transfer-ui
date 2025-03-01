import { useQuery } from "@tanstack/react-query";
import { formatSize } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getStorageInfo } from "@/api/storage";
import { useAuth } from "@/hooks/useAuth";
export default function Footer() {
  const isAuthenticated = useAuth(); // You can use the custom hook here too
  const { data: storageData } = useQuery({
    queryKey: ["storage"],
    queryFn: async () => getStorageInfo(),
    enabled: isAuthenticated,
  });
  return (
    <footer className="text-white/30 fixed bottom-0 font-custom flex flex-col justify-center items-center italic p-3 mt-24">
      {storageData && (
        <div className="flex justify-center items-center flex-col gap-1 md:gap-5 text-white/60">
          <div className="flex gap-2 text-center">
            <span>Left: {formatSize(storageData?.totalSpace - storageData?.usedSpace)}</span>
            <span className="not-italic">|</span>
            <span>Used: {(Math.round((storageData?.usedSpace * 100 / storageData?.totalSpace) * 100) / 100).toFixed(2)}%</span>
          </div>
          <Progress
            value={storageData?.usedSpace * 100 / storageData?.totalSpace}
            max={100}
            className="w-44 border-2 border-white/20" />
        </div>
      )}
    </footer>
  )
}
