import { CheckCircle, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Button
      onClick={copyLink}
      className={`ml-4  text-white py-2 px-4 rounded ${copied ? "bg-green-600" : "bg-blue-800"
        }`}
    >
      {copied ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      Copy Link
    </Button>
  );
}
