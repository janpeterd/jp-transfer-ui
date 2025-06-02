import { Progress } from "@/components/ui/progress";
import React from "react";

interface ProfileStatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  progress?: number;
}

export default function ProfileStatCard({
  title,
  value,
  icon,
  description,
  progress,
}: ProfileStatCardProps) {
  return (
    <div className="bg-neutral-800/70 border border-neutral-700/80 p-5 sm:p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[160px] sm:min-h-[180px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
            {title}
          </h3>
          <div className="p-2 bg-neutral-700/50 rounded-lg">
            {React.isValidElement(icon) && React.cloneElement(
              icon as React.ReactElement<{ className?: string }>,
              { className: "h-5 w-5 sm:h-6 sm:w-6" }
            )}
          </div>
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-1 truncate" title={value}>
          {value}
        </p>
        {description && (
          <p className="text-xs sm:text-sm text-neutral-500 leading-tight">
            {description}
          </p>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-auto pt-3"> {/* Pushes progress bar to bottom */}
          <Progress value={progress} className="h-2 bg-neutral-700 [&>div]:bg-blue-500" />
        </div>
      )}
    </div>
  );
}
