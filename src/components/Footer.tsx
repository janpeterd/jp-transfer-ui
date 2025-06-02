import { getStorageInfo } from "@/api/storage";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { formatSize } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const { data: storageData, isLoading } = useQuery({
    queryKey: ["storageInfoFooter"],
    queryFn: async () => getStorageInfo(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });


  const showStorageInfo = isAuthenticated && storageData && !isLoading;

  return (
    <footer
      className={`
        fixed bottom-0 left-0 right-0 w-full
        bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50
        transition-all duration-300 ease-in-out z-50
        ${showStorageInfo ? "h-10 opacity-100" : "h-0 opacity-0 pointer-events-none"}
        font-custom 
      `}
    >
      {showStorageInfo && (
        <div className="container mx-auto h-full flex items-center justify-center px-4">
          <div className="flex items-center gap-x-3 text-xs text-neutral-400">
            <span className="italic">Left:</span>
            <span className="font-medium text-neutral-200">
              {formatSize(storageData.totalSpace - storageData.usedSpace)}
            </span>
            <span className="text-neutral-600 select-none">|</span>
            <span className="italic">Used:</span>
            <span className="font-medium text-neutral-200">
              {(
                (storageData.usedSpace * 100) /
                storageData.totalSpace
              ).toFixed(1)}
              %
            </span>
            <Progress
              value={
                (storageData.usedSpace * 100) / storageData.totalSpace
              }
              className="w-24 sm:w-32 h-1.5 bg-neutral-700 [&>div]:bg-blue-500"
            />
          </div>
        </div>
      )}
    </footer>
  );
}
