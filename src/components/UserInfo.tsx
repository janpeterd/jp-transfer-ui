import { UserResponseDto } from "@/models/User"; // Or your specific path to UserResponseDto

export default function UserInfo({ user }: { user: UserResponseDto }) {
  return (
    <div className="rounded-xl border-blue-500 p-4 border-2 bg-gray-700 shadow-sm">
      <pre className="text-lg font-bold text-gray-100 whitespace-pre-wrap break-words">
        {user.username}
      </pre>
    </div>
  );
}
