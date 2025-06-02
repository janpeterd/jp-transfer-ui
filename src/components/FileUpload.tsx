import { zipUploadFiles } from '@/api/fileUpload';
import { TransferResponseDto } from '@/models/TransferResponseDto';
import useStore from '@/store/store';
import { FolderUp, Upload, X } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { z, ZodError } from 'zod';
import FileList from './FileList';
import SuccessMessage from './SuccessMessage';
import { Button } from './ui/button';
import UploadProgress from './UploadProgress';

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const [uploadComplete, setUploadComplete] = useState(false);
  const [transferResponse, setTransferResponse] = useState<TransferResponseDto>();

  const maxFileSizeGB = 20;
  const maxTotalSizeGB = 100;
  const userEmail = typeof window !== 'undefined' ? user?.email : null;

  const { uploadStatusMessage, setUploadStatusMessage } = useStore();

  const fileSchema = z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= maxFileSizeGB * 1024 * 1024 * 1024, {
          message: `Individual files must be less than ${maxFileSizeGB} GB.`,
        })
    )
    .min(1, "Please select at least one file.")
    .refine(
      (files) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        return totalSize <= maxTotalSizeGB * 1024 * 1024 * 1024;
      },
      {
        message: `Total file size cannot exceed ${maxTotalSizeGB} GB.`,
      }
    );

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const currentFiles = files;


      try {

        const validNewFiles = acceptedFiles.filter(file => file.size <= maxFileSizeGB * 1024 * 1024 * 1024);
        const filesToValidate = [...currentFiles, ...validNewFiles];

        fileSchema.parse(filesToValidate);
        setFiles(filesToValidate);

        if (rejectedFiles.length > 0) {
          rejectedFiles.forEach(rejected => {
            rejected.errors.forEach((error: any) => toast.error(error.message));
          });
        }




      } catch (error) {
        if (error instanceof ZodError) {
          error.errors.forEach((err) => toast.error(err.message));
        } else {
          toast.error("An unexpected error occurred while adding files.");
        }
      }
    },
    [files, fileSchema, maxFileSizeGB]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,





  });

  const resetComponent = () => {
    setFiles([]);
    setUploading(false);
    setUploadComplete(false);
    setTransferResponse(undefined);
    setUploadStatusMessage('Starting upload...');
  };

  function handleDelete(name: string, size: number) {
    setFiles(files.filter((file: File) => !(file.name === name && file.size === size)));
  }

  const handleUpload = async () => {
    if (!userEmail) {
      toast.error('User email not found. Please sign in again.');
      return;
    }
    try {

      fileSchema.parse(files);
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => toast.error(err.message));
      } else {
        toast.error("File validation failed.");
      }
      setUploading(false);
      return;
    }

    setUploading(true);
    setUploadComplete(false);
    try {
      const response: TransferResponseDto | undefined = await zipUploadFiles(
        files,
        undefined,
        setUploadStatusMessage
      );
      if (response !== undefined) {
        setTransferResponse(response);
        setUploadComplete(true);
      } else {

        toast.error('Upload failed: No response from server.');
        setUploadComplete(false);
      }
    } catch (error) {

      if (error instanceof Error) {
        toast.error(`Upload Error: ${error.message}`);
      } else {
        toast.error('An unknown error occurred during upload.');
      }
      setUploadComplete(false);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFilesArray = Array.from(selectedFiles);
      onDrop(newFilesArray, []);
    }
  };

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => handleFileSelection((e.target as HTMLInputElement).files);
    input.click();
  };

  const openDirectoryDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('webkitdirectory', '');
    input.setAttribute('directory', '');
    input.multiple = true;
    input.onchange = (e) => handleFileSelection((e.target as HTMLInputElement).files);
    input.click();
  };

  const canUpload = files.length > 0 && !uploading;

  return (
    <div className={`-mt-24 z-10 w-full px-2 sm:px-4 ${files.length > 0 && !uploading && !uploadComplete ? 'max-w-7xl' : 'max-w-3xl'}`}>
      <div
        {...getRootProps()}
        className={`grid transition-all duration-300 ease-in-out ${files.length > 0 && !uploading && !uploadComplete
          ? 'grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 items-start'
          : 'grid-cols-1'
          }`}
      >

        {(!uploading && !uploadComplete) && (
          <div
            className={`
              flex flex-col justify-center rounded-xl border
              border-gray-700/50
              p-6 py-8 text-center backdrop-blur-sm transition-all duration-300
              ${files.length > 0 ? 'lg:min-h-[calc(50vh+100px)]' : 'min-h-[40vh] lg:min-h-[50vh]'} 
              ${isDragActive ? 'border-blue-500 bg-primary/10 shadow-2xl shadow-primary/30 border-primary/60' : 'shadow-md hover:border-blue-500/30'}
            `}
          >
            <input {...getInputProps()} />
            {!isDragActive ? (
              <>
                <Upload
                  className={`mx-auto mb-4 text-blue-500 transition-all duration-300 ${files.length > 0 ? 'h-10 w-10' : 'h-12 w-12'
                    }`}
                />
                <p className={`mb-2 font-semibold text-lg text-neutral-100 ${files.length > 0 ? 'text-base' : 'text-xl'
                  }`}>
                  {files.length > 0 ? 'Add more files' : 'Drag & Drop files here'}
                </p>
                <p className="mb-6 text-sm text-neutral-400">
                  or select files/directory from your computer
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                  <Button
                    onClick={openFileDialog}
                    variant="default"
                    className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Upload className="h-4 w-4" />
                    Select Files
                  </Button>
                  <Button
                    onClick={openDirectoryDialog}
                    variant="outline"
                    className="w-full sm:w-auto gap-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <FolderUp className="h-4 w-4" />
                    Upload Directory
                  </Button>
                </div>

                {files.length > 0 && (
                  <Button
                    onClick={() => setFiles([])}
                    variant="ghost"
                    className="mt-6 text-neutral-400 bg-red-500/10 hover:text-red-500 hover:bg-red-500/30 mx-auto gap-2"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                    Clear All Files
                  </Button>
                )}
                <p className="mt-6 text-xs text-neutral-500">
                  Max {maxFileSizeGB}GB/file, {maxTotalSizeGB}GB total
                </p>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-primary pointer-events-none">
                <Upload className="mx-auto mb-4 h-16 w-16" />
                <p className="text-xl font-semibold">Drop your files here!</p>
              </div>
            )}
          </div>
        )}


        <AnimatePresence>
          {files.length > 0 && !uploading && !uploadComplete && (
            <motion.div
              className="z-10 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
            >
              <FileList
                key={files.map(f => f.name + f.size).join('-')}
                givenFiles={files}
                onFileDelete={handleDelete}
              />
              <Button
                onClick={handleUpload}
                disabled={!canUpload || files.length === 0}
                className="w-full py-3 text-base font-semibold bg-green-600 hover:bg-green-700 text-white disabled:bg-neutral-600 disabled:text-neutral-400"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>


        {uploading && (
          <div className="col-span-1 lg:col-span-2 flex items-center justify-center w-full min-h-[50vh]">
            <UploadProgress files={files} message={uploadStatusMessage} />
          </div>
        )}

        {uploadComplete && transferResponse && (
          <div className="col-span-1 lg:col-span-2 flex items-center justify-center w-full min-h-[50vh]">
            <SuccessMessage transferResponse={transferResponse} resetCallBack={resetComponent} />
          </div>
        )}

        {uploadComplete && !transferResponse && !uploading && (
          <div className="col-span-1 lg:col-span-2 flex flex-col items-center justify-center w-full min-h-[50vh] text-center p-6">
            <X className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-100 mb-2">Upload Failed</h2>
            <p className="text-neutral-400 mb-6">There was an issue with the upload. Please check the error messages or try again.</p>
            <Button onClick={resetComponent} variant="outline" className="text-blue-400 border-blue-500 hover:bg-blue-500/10">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
