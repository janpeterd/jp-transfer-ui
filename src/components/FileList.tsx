import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import GetFileIcon from "./GetFileIcon";
import { formatSize } from "@/lib/utils";

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
  const [totalSize, setTotalSize] = useState("");
 
  useEffect(() => {
    const totalSize: number = givenFiles.reduce(
      (acc: number, file: File) => acc + file.size,
      0
    );
    console.log("Total size:", totalSize);
    setTotalSize(formatSize(totalSize));
  }, [givenFiles]);

  return (
    <div
      className="w-full z-10 backdrop-blur-sm bg-black/20 rounded-lg p-4 border border-blue-500/20 max-h-[60vh] overflow-y-auto relative [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-track]:bg-neutral-700
[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div className="flex justify-between items-center mb-2 sticky -top-4 p-1 border-b-[1px] border-white/20 bg-black">
        <h2 className="text-white font-semibold sticky">Files</h2>
        <span className="text-sm truncate text-white/70">{`${givenFiles.length} files - ${totalSize}`}</span>
      </div>
      <ul className="space-y-2">
        {givenFiles.map((file: File, index: number) => (
          <li
            key={index}
            className="flex items-center justify-between text-white/70 hover:text-white transition-colors p-3"
          >
            <div className="flex items-center justify-start w-[80%]">
              <GetFileIcon fileType={file.type} />
              <p className="text-sm truncate">{file.name}</p>
            </div>
            <div className="flex items-center justify-end gap-x-2">
              <span className="text-sm truncate">{formatSize(file.size)}</span>
              {!readonly && (
                <Trash
                  className="h-4 w-4 text-red-500 cursor-pointer"
                  onClick={() => onFileDelete && onFileDelete(file.name, file.size)}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
