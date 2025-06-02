import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function UploadProgress({
  files,
  message,
}: {
  files: File[];
  message: string;
}) {
  return (
    <div className="w-full max-w-lg flex flex-col items-center justify-center space-y-6 p-6 bg-neutral-800/50 backdrop-blur-md rounded-xl shadow-2xl">
      <Loader2 className="text-blue-500 animate-spin h-16 w-16 sm:h-20 sm:w-20" />
      <div className="flex items-baseline">
        <motion.p
          className="text-neutral-100 text-lg sm:text-xl font-medium text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          key={message}
        >
          {message}
        </motion.p>
        <motion.span
          className="text-neutral-100 text-lg sm:text-xl font-medium overflow-hidden inline-block align-bottom"
          style={{ width: '1.2em' }}
        >
          {['.', '.', '.'].map((dot, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.2,
                ease: "linear"
              }}
            >
              {dot}
            </motion.span>
          ))}
        </motion.span>
      </div>

      {files.length > 0 && (
        <div className="w-full mt-4">
          <p className="text-sm text-neutral-400 mb-2 text-center">
            Uploading {files.length} {files.length === 1 ? 'file' : 'files'}...
          </p>
        </div>
      )}
    </div>
  );
}
