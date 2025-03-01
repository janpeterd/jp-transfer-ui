export default function ProfileStat({ statName, statValue }: { statName: string, statValue: string }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center h-[200px] md:max-w-[400px] border rounded-xl p-4">
      <h3 className="text-3xl italic w-full">
        {statName}
      </h3>
      <p className="text-4xl font-bold">{statValue}</p>
    </div>
  )
}
