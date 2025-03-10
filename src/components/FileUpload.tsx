import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FolderUp, X } from 'lucide-react'
import FileList from './FileList'
import UploadProgress from './UploadProgress'
import SuccessMessage from './SuccessMessage'
import { Button } from './ui/button'
import { AnimatePresence, motion } from 'motion/react'
import { z, ZodError } from 'zod'
import { toast } from 'sonner'
import { zipUploadFiles } from '@/api/fileUpload'
import { SharedLink } from '@/models/SharedLink'
import useStore from '@/store/store'

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [sharedLink, setSharedLink] = useState<SharedLink>()
  const maxFileSize = parseInt('20')
  const maxTotalSize = parseInt('100')
  const userEmail = localStorage.getItem('email')

  const { uploadStatusMessage, setUploadStatusMessage } = useStore()

  const fileSchema = z
    .array(
      z.instanceof(File).refine((file) => file && file.size <= maxFileSize * 1024 * 1024 * 1024, {
        message: `Please upload files less than ${maxFileSize} GB`
      })
    )
    .nonempty()
    .refine(
      (files) => {
        const totalSize = files.reduce((acc, file) => acc + file.size, 0)
        return totalSize <= maxTotalSize * 1024 * 1024 * 1024
      },
      {
        message: `Total file size should not exceed ${maxTotalSize} GB`
      }
    )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true
  })

  const resetComponent = () => {
    setFiles([])
    setUploading(false)
    setUploadComplete(false)
    setSharedLink(undefined)
  }

  function handleDelete(name: string, size: number) {
    setFiles(files.filter((file: File) => file.name !== name && file.size !== size))
  }

  const handleUpload = async () => {
    if (userEmail === null || userEmail === undefined) {
      toast.error('User email not found')
      return
    }
    setUploading(true)
    try {
      const response: SharedLink | undefined = await zipUploadFiles(
        files,
        3,
        userEmail,
        undefined,
        setUploadStatusMessage
      )
      if (response !== undefined) {
        setSharedLink(response)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.errors[0].message)
      } else if (error instanceof Error) {
        toast.error(`Failed to upload files: ${error.message}`)
      }
      toast.error('Failed to upload files')
    }
    setUploadComplete(true)
    setUploading(false)
  }

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      try {
        fileSchema.parse(files)
        setFiles((prevFiles) => [...prevFiles, ...files])
      } catch (error) {
        if (error instanceof ZodError) {
          toast.error(error.errors[0].message)
        } else if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred')
        }
      }
    }
    input.click()
  }

  const handleDirectorySelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.setAttribute('webkitdirectory', '')
    input.setAttribute('directory', '')
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || [])
      try {
        fileSchema.parse(files)
        setFiles((prevFiles) => [...prevFiles, ...files])
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('An unknown error occurred')
        }
      }
    }
    input.click()
  }

  return (
    <div className={`z-10 w-full max-w-7xl ${files.length > 0 ? 'px-4' : 'max-w-2xl'}`}>
      <div
        {...getRootProps()}
        className={`grid transition-all duration-500 ${
          files.length > 0 && !uploading && !uploadComplete
            ? 'grid-cols-1 gap-8 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}>
        <div>
          {!uploading && !uploadComplete && (
            <div
              className={`flex min-h-[20vh] flex-col justify-center rounded-lg border-2 bg-black/20 p-8 text-center backdrop-blur-sm transition-all duration-500 lg:min-h-[50vh] ${
                files.length > 0 ? 'h-full' : 'aspect-auto'
              } ${isDragActive && 'shadow-2xl shadow-secondary'}`}>
              {!isDragActive ? (
                <>
                  <input {...getInputProps()} />
                  <Upload
                    className={`mx-auto mb-4 text-blue-500 ${
                      files.length > 0 ? 'h-12 w-12' : 'h-8 w-8'
                    }`}
                  />
                  <p className={`mb-6 text-white/60 ${files.length > 0 ? 'text-base' : 'text-lg'}`}>
                    {files.length > 0 ? 'Add more files to upload' : 'Drag & drop files here'}
                  </p>
                  <div className="flex flex-col justify-center gap-4 md:flex-row">
                    <Button
                      onClick={handleFileSelect}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600">
                      <Upload className="h-4 w-4" />
                      Select Files
                    </Button>
                    <Button
                      onClick={handleDirectorySelect}
                      className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 font-medium text-blue-500 backdrop-blur-sm hover:bg-blue-500/30">
                      <FolderUp className="h-4 w-4" />
                      Upload Directory
                    </Button>
                    {files.length > 0 && (
                      <Button onClick={() => setFiles([])} variant={'destructive'}>
                        <X className="h-4 w-4" />
                        Clear Files
                      </Button>
                    )}
                  </div>
                  <p className="mt-6 text-sm text-white/50">Max 20G/file, 100G total</p>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-white">
                  <Upload className="mx-auto mb-4 text-blue-500" width={70} height={70} />
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
              transition={{ duration: 0.5, ease: 'easeInOut' }}>
              <FileList key={files.length} givenFiles={files} onFileDelete={handleDelete} />
              <Button
                onClick={handleUpload}
                className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
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
              <SuccessMessage sharedLink={sharedLink} resetCallBack={resetComponent} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
