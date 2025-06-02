import { formatSize } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import GetFileIcon from "./GetFileIcon";

interface FileListProps {
  givenFiles: File[];
  readonly?: boolean;
  onFileDelete?: (name: string, size: number) => void;

}

export default function FileList({
  givenFiles,
  readonly = false,
  onFileDelete,

}: FileListProps) {

  const totalSizeFormatted = useMemo(() => {
    const total = givenFiles.reduce((acc, file) => acc + file.size, 0);
    return formatSize(total);
  }, [givenFiles]);

  return (
    <div
      className={`
        w-full z-10 backdrop-blur-md rounded-xl 
        border border-neutral-700/80 shadow-lg
        max-h-[60vh] overflow-y-auto relative 
        p-4 pt-0
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-neutral-700/20
        [&::-webkit-scrollbar-thumb]:bg-neutral-500/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-track]:rounded-full
      `}
    >
      <div className={`
          flex justify-between items-center mb-3 sticky top-0 
          bg-gray-800/80 ${'py-2 -mx-4 px-4 border-b border-neutral-700'} 
          backdrop-blur-lg z-10
        `}>
        <h2 className="text-base tracking-tight font-semibold text-neutral-100">
          Selected Files
        </h2>
        <span className="text-xs sm:text-sm text-neutral-400">
          {givenFiles.length} {givenFiles.length === 1 ? 'file' : 'files'} - {totalSizeFormatted}
        </span>
      </div>


      <ul className="space-y-1.5">
        {givenFiles.map((file, index) => (
          <li
            key={`${file.name}-${file.size}-${index}`}
            className={`
              flex items-center justify-between rounded-md transition-colors duration-150
              ${'p-2 sm:p-3 text-sm'}
              ${!readonly ? 'hover:bg-neutral-700/70' : ''}
            `}
          >
            <div className="flex items-center min-w-0 flex-1 mr-2 sm:mr-3"> {/* flex-1 and min-w-0 for truncation */}
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <GetFileIcon fileType={file.type} />
              </div>
              <p className="truncate text-neutral-200 hover:text-neutral-50" title={file.name}>
                {file.name}
              </p>
            </div>

            <div className="flex items-center flex-shrink-0 gap-x-2 sm:gap-x-3">
              <span className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">
                {formatSize(file.size)}
              </span>
              {!readonly && onFileDelete && (
                <button
                  type="button"
                  onClick={() => onFileDelete(file.name, file.size)}
                  className="p-1 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
          </li>
        ))}
        {givenFiles.length === 0 && (
          <li className="text-center text-neutral-500 py-8">
            No files selected.
          </li>
        )}
      </ul>
    </div>
  );
}
