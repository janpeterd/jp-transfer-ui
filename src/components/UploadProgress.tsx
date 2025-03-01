import { Loader } from "lucide-react";
import FileList from "./FileList";
import { motion } from "motion/react";

export default function UploadProgress({
  files,
  message,
}: {
  files: File[];
  message: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-transparent p-8 rounded-lg flex flex-col items-center justify-center space-y-4 mt-12">
        <Loader className="text-blue-500 animate-spin" width={70} height={70} />
        <div className="flex">
          <motion.p
            className="text-white text-lg"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            key={message} // Add key to trigger re-animation on message change
          >
            {message}
          </motion.p>
          <motion.div
            className="text-white text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </div>

        <FileList givenFiles={files} readonly={true} />
      </div>
    </div>
  );
}
