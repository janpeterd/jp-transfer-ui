export default function ProfileStat({ statName, statValue }: { statName: string, statValue: string }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center h-[160px] md:max-w-[400px] rounded-xl p-4">
      <h3 className="text-2xl italic w-full">
        {statName}
      </h3>
      <p className="text-4xl font-bold tracking-tight">{statValue}</p>
    </div>
  )
}
