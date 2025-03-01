import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div>
      <Loader className="text-blue-500 animate-spin" width={70} height={70} />
    </div>
  )
}
