import { getUsers } from '@/api/users'
import UserColumns from '@/components/table/user-columns'
import { useQuery } from '@tanstack/react-query'

export default function Admin() {
  const { data, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => getUsers()
  })

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-neutral-100 space-y-10">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-700/80">
        <div>
          <h1 className="text-4xl uppercase font-bold tracking-tight text-primary">
            Admin
          </h1>
        </div>
      </header>
      <div className="bg-neutral-800/50 backdrop-blur-md border border-neutral-700/60 rounded-xl z-20 mx-auto flex w-[80%] max-w-[800px] flex-col gap-4 shadow-2xl p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-primary mb-6">Users</h2>
          {data && (data?.data?.length || 0) > 0 && (
            <UserColumns data={data?.data} reloader={refetch} />
          )}
        </section>
      </div>
    </div>
  )
}
