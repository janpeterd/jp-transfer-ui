
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FolderUp, X } from "lucide-react";
import FileList from "./FileList";
import UploadProgress from "./UploadProgress";
import SuccessMessage from "./SuccessMessage";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "motion/react";
import { z, ZodError } from "zod";
import { toast } from "sonner";
import { zipUploadFiles } from "@/api/fileUpload";
import { SharedLink } from "@/models/SharedLink";
import useStore from "@/store/store";

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [sharedLink, setSharedLink] = useState<SharedLink>();
  const maxFileSize = parseInt("20");
  const maxTotalSize = parseInt("100");
  const user = {
    email: "janpeter.dhalle@gmail.com"
  };
  const { uploadStatusMessage, setUploadStatusMessage } = useStore();

  const fileSchema = z
    .array(
      z
        .instanceof(File)
        .refine(
          (file) => file && file.size <= maxFileSize * 1024 * 1024 * 1024,
          {
            message: `Please upload files less than ${maxFileSize} GB`,
          }
        )
    ).nonempty()
    .refine(
      (files) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        return totalSize <= maxTotalSize * 1024 * 1024 * 1024;
      },
      {
        message: `Total file size should not exceed ${maxTotalSize} GB`,
      }
    )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  const resetComponent = () => {
    setFiles([]);
    setUploading(false);
    setUploadComplete(false);
    setSharedLink(undefined);
  };

  function handleDelete(name: string, size: number) {
    setFiles(
      files.filter((file: File) => file.name !== name && file.size !== size)
    );
  }
  

  const handleUpload = async () => {
    if (user?.email === null || user?.email === undefined) {
      toast.error("User email not found");
      return;
    }
    setUploading(true);
    try {
      const response: SharedLink | undefined = await zipUploadFiles(
        files,
        3,
        user.email,
        undefined,
        setUploadStatusMessage
      );
      if (response !== undefined) {
        console.log("LINK response:", response);
        setSharedLink(response);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
      toast.error(`Failed to upload files: ${error.message}`);
      }
      toast.error("Failed to upload files");
    }
    setUploadComplete(true);
    setUploading(false);
  };

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      try {
        fileSchema.parse(files);
        setFiles((prevFiles) => [...prevFiles, ...files]);
      } catch (error) {
        if (error instanceof ZodError) {
          toast.error(error.errors[0].message);
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    input.click();
  };

  const handleDirectorySelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("webkitdirectory", "");
    input.setAttribute("directory", "");
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      try {
        fileSchema.parse(files);
        setFiles((prevFiles) => [...prevFiles, ...files]);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    };
    input.click();
  };

  console.log("files:", files.length);
  return (
    <div
      className={`z-10 w-full max-w-7xl ${files.length > 0 ? "px-4" : "max-w-2xl"
        }`}
    >
      <div
        {...getRootProps()}
        className={`grid transition-all duration-500 ${files.length > 0 && !uploading && !uploadComplete
          ? "grid-cols-1 lg:grid-cols-2 gap-8"
          : "grid-cols-1"
          }`}
      >
        <div>
          {!uploading && !uploadComplete && (
            <div
              className={`flex flex-col justify-center border-2 min-h-[20vh] lg:min-h-[50vh] rounded-lg p-8 text-center transition-all duration-500 backdrop-blur-sm bg-black/20 ${files.length > 0 ? "h-full" : "aspect-auto"
                } ${isDragActive && "shadow-2xl shadow-secondary"}`}
            >
              {!isDragActive ? (
                <>
                  <input {...getInputProps()} />
                  <Upload
                    className={`mx-auto text-blue-500 mb-4 ${files.length > 0 ? "h-12 w-12" : "h-8 w-8"
                      }`}
                  />
                  <p
                    className={`text-white/60 mb-6 ${files.length > 0 ? "text-base" : "text-lg"
                      }`}
                  >
                    {files.length > 0
                      ? "Add more files to upload"
                      : "Drag & drop files here"}
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleFileSelect}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Select Files
                    </Button>
                    <Button
                      onClick={handleDirectorySelect}
                      className="bg-blue-500/20 text-blue-500 py-2 px-4 rounded-lg font-medium hover:bg-blue-500/30 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <FolderUp className="h-4 w-4" />
                      Upload Directory
                    </Button>
                    {files.length > 0 && (
                      <Button
                        onClick={() => setFiles([])}
                        variant={"destructive"}
                      >
                        <X className="h-4 w-4" />
                        Clear Files
                      </Button>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mt-6">
                    Max 20G/file, 100G total
                  </p>
                </>
              ) : (
                <div className="text-white h-full w-full flex flex-col items-center justify-center">
                  <Upload
                    className="mx-auto text-blue-500 mb-4"
                    width={70}
                    height={70}
                  />
                  Drop your files HERE!
                </div>
              )}
            </div>
          )}
        </div>
        <AnimatePresence>
          {files.length > 0 && !uploading && !uploadComplete && (
            <motion.div
              className="z-10 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <FileList key={files.length} givenFiles={files} onFileDelete={handleDelete}/>
              <Button
                onClick={handleUpload}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Upload {files.length} {files.length === 1 ? "File" : "Files"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {uploading && (
          <div className="col-span-1 lg:col-span-2">
            <UploadProgress files={files} message={uploadStatusMessage} />
          </div>
        )}

        {uploadComplete && (
          <div className="col-span-1 lg:col-span-2">
            {sharedLink && (
              <SuccessMessage
                sharedLink={sharedLink}
                resetCallBack={resetComponent}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
