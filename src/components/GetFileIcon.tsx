import {
  Image,
  Video,
  Music,
  FileText,
  FolderArchive,
  Presentation,
  FileType,
  FileJson,
  Book,
  File,
} from "lucide-react";

export default function getFileIcon({ fileType }: { fileType: string }) {
  if (fileType.startsWith("image")) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  if (fileType.startsWith("video")) {
    return <Video className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  if (fileType.startsWith("audio")) {
    return <Music className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  if (fileType.startsWith("text")) {
    return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // zip
  if (fileType === "application/zip") {
    return (
      <FolderArchive className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
    );
  }
  // pdf
  if (fileType === "application/pdf") {
    return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // doc
  if (fileType === "application/msword") {
    return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // docx
  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // ppt
  if (fileType === "application/vnd.ms-powerpoint") {
    return (
      <Presentation className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
    );
  }
  // pptx
  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return (
      <Presentation className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
    );
  }
  // excel
  if (fileType === "application/vnd.ms-excel") {
    return <FileText className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // epub
  if (fileType === "application/epub+zip") {
    return <Book className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // json
  if (fileType === "application/json") {
    return <FileJson className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }
  // ttf
  if (fileType === "font/ttf") {
    return <FileType className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
  }

  return <File className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />;
}
