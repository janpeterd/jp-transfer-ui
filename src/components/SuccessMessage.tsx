import { ArrowLeft, CheckCircle, Loader } from "lucide-react";
import { Button } from "./ui/button";
import { SharedLink } from "@/models/SharedLink";
import { formatSize } from "@/lib/utils";
import CopyLink from "./CopyLink";
import { getSharedLink } from "@/api/sharedLinks";
import { useQuery } from "@tanstack/react-query";

export default function SuccessMessage({
  sharedLink,
  resetCallBack,
}: {
  sharedLink: SharedLink;
  resetCallBack: () => void;
}) {

  const { data } = useQuery({
    queryKey: ["sharedLink", sharedLink.id],
    queryFn: async () => (sharedLink?.id ? getSharedLink(sharedLink.id) : sharedLink),
    // Poll until we get a non-zero file size
    refetchInterval: (dat) => {
      if (dat.state.data && dat.state.data.fileSize > 0) {
        return false; // Stop polling
      }
      return 300;
    },
    // Keep polling even when the tab is in the background
    refetchIntervalInBackground: true,
  });


  return (
    <div className="mt-4 backdrop-blur-sm bg-black/20 rounded-lg p-6 text-center border border-blue-500/20">
      <CheckCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
      <h2 className="text-white text-2xl font-semibold mb-2">
        Upload Complete!
      </h2>

      <div className="py-4">
        <p className="text-white/70">
          Your files have been successfully uploaded!
        </p>
        {data && data.fileSize > 0 ? (
          <p className="text-white/70">
            Download size: {formatSize(data.fileSize)}
          </p>
        ) : (
          <p className="flex items-center justify-center text-white/70 my-2">
            <Loader className="animate-spin" />
          </p>
        )
        }

        {sharedLink.expiresAt ? (
          <p>
            <span className="text-white/70">The link will expire on </span>
            <span className="text-white font-bold">
              {new Date(sharedLink.expiresAt).toLocaleString()}
            </span>
          </p>
        ) : (
          <p className="text-white/70">This link will never expire</p>
        )}
      </div>
      <div className="mt-4 text-white">
        <CopyLink url={sharedLink.downloadLink} />
        <Button
          onClick={resetCallBack}
          className="ml-4 bg-red-500 text-white py-2 px-4 rounded"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );
}
