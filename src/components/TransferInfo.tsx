import { FileResponseDto } from "@/models/FileResponseDto"; // Ensure this path is correct
import { TransferResponseDto } from "@/models/TransferResponseDto";

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(dateString?: Date | string): string {
  if (!dateString) return "Never";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return typeof dateString === 'string' ? dateString : "Invalid Date";
    }
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return `Invalid Date: ${error}`;
  }
}

export default function TransferInfo({
  transfer,
}: {
  transfer: TransferResponseDto;
}) {
  const remainingDownloads = transfer.sharedLink.maxDownloads
    ? transfer.sharedLink.maxDownloads - transfer.sharedLink.downloads
    : null;

  const user = transfer.user;
  const avatarInitials = user.username.substring(0, 2).toUpperCase();

  return (
    <div className="p-6 sm:p-8 rounded-xl w-full shadow-2xl border border-gray-700/60">

      <h2 className="text-3xl uppercase tracking-tight font-bold mb-8 text-primary">
        Download Details
      </h2>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        {/* User Info Section */}
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4 flex-shrink-0">
            {avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-400">Shared by</p>
            <p className="text-lg font-semibold text-gray-100 truncate" title={user.username}>
              {user.username}
            </p>
          </div>
        </div>
        <div>
          <p className="font-medium text-gray-400">Total Files:</p>
          <p className="text-xl text-gray-100">{transfer.files.length}</p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Total Size:</p>
          <p className="text-xl text-gray-100">
            {formatBytes(transfer.totalSize)}
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-400">Expires:</p>
          <p className="text-xl text-gray-100">
            {formatDate(transfer.sharedLink.expiresAt)}
          </p>
        </div>
        {transfer.sharedLink.maxDownloads !== undefined && remainingDownloads !== null && (
          <div>
            <p className="font-medium text-gray-400">Downloads Left:</p>
            <p className="text-xl text-gray-100">
              {remainingDownloads > 0 ? `${remainingDownloads} / ${transfer.sharedLink.maxDownloads}` : "None"}
            </p>
          </div>
        )}
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-200">File List:</h3>
        <ul className="space-y-2 max-h-80 overflow-y-auto p-4 rounded-lg border border-gray-700">
          {transfer.files.map((file: FileResponseDto) => (
            <li
              key={file.id}
              className="flex justify-between items-center p-3 bg-gray-900/60 rounded-md hover:bg-gray-700/80 transition-colors duration-150"
            >
              <div className="flex items-center min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block mr-3 text-blue-400 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="truncate text-gray-200"
                  title={file.fileName}
                >
                  {file.fileName}
                </span>
              </div>
              <span className="text-sm text-gray-400 flex-shrink-0 ml-2">
                {formatBytes(file.fileSize)}
              </span>
            </li>
          ))}
          {transfer.files.length === 0 && (
            <li className="text-gray-400 text-center p-3">No files in this transfer.</li>
          )}
        </ul>
      </div>

      {(remainingDownloads === null || remainingDownloads > 0) && transfer.files.length > 0 ? (
        <a
          href={transfer.sharedLink.downloadLink}
          download
          className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg text-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Download All ({formatBytes(transfer.totalSize)})
        </a>
      ) : (
        <p className="w-full block text-center bg-gray-600 text-gray-400 font-bold py-3.5 px-6 rounded-lg text-lg cursor-not-allowed">
          Download Not Available
        </p>
      )}
    </div>
  );
}
