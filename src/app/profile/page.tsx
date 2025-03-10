import LargeText from '@/components/LargeText'
import { deleteSharedLink, getUserSharedLinks } from '@/api/sharedLinks'
import { DataTable } from '@/components/table/data-table'
import { columns } from '@/components/table/columns'
import { getStorageInfo } from '@/api/storage'
import { formatSize } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import ProfileStat from '@/components/ProfileStat'
import { SharedLink } from '@/models/SharedLink'
import { Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import ChangePasswordForm from '@/components/changePassword'

export default function Profile() {
  const queryClient = useQueryClient()
  const email = localStorage.getItem('email')
  const encodedEmail = btoa(email || '')
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['profile', encodedEmail],
    queryFn: async () => getUserSharedLinks(encodedEmail),
    enabled: !!email
  })
  const [usedSpace, setUsedSpace] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [sharedLinkRow, setSharedLinkRow] = useState<Row<SharedLink>>()
  const [openChangePassword, setOpenChangePassword] = useState(false)

  const { data: storageData } = useQuery({
    queryKey: ['storage'],
    queryFn: async () => getStorageInfo()
  })

  const deleteSingleSharedLink = async (row: Row<SharedLink>) => {
    if (row.original.id !== undefined) {
      await deleteSharedLink(row.original.id)
    } else {
      toast.error('Failed to delete: ID is undefined')
    }
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    toast.success('SharedLink deleted successfully')
  }

  const handleDelete = async (row: Row<SharedLink>) => {
    setOpen(true)
    setSharedLinkRow(row)
  }

  useEffect(() => {
    // get total file size from sharedlinks
    if (!data) return
    setUsedSpace(data.reduce((acc: number, curr: any) => acc + curr.fileSize, 0))
  }, [data, usedSpace])

  const handleChangePassword = () => {
    setOpenChangePassword(true)
  }

  return (
    <>
      <div className="mb-24 flex flex-col items-center justify-center text-white">
        <LargeText string="Profile" />
        <div className="z-30 flex min-h-[65vh] w-[90vw] max-w-[1200px] flex-col items-start justify-start gap-4 overflow-auto rounded-lg border-white/10 bg-black/50 p-6">
          <Button variant={'destructive'} onClick={handleChangePassword}>
            Change Password
          </Button>
          <h2 className="text-5xl font-bold">Overview</h2>
          <div className="flex w-full flex-col items-stretch justify-stretch gap-6 md:flex-row md:items-center md:justify-start">
            {usedSpace > 0 && (
              <ProfileStat statName="Your space usage" statValue={formatSize(usedSpace)} />
            )}
            {storageData && (
              <ProfileStat
                statName="System space Usage"
                statValue={`${Math.round(((storageData?.usedSpace * 100) / storageData?.totalSpace) * 100) / 100}%`}
              />
            )}
          </div>
          {data && data.length > 0 && (
            <>
              <hr className="my-14 w-full border-white/20" />
              <h2 className="text-5xl font-bold">
                Links{' '}
                <span className="ml-2 align-middle text-lg italic">{data.length} active links</span>
              </h2>
              <div className="w-full overflow-auto">
                <DataTable
                  data={data}
                  columns={columns}
                  reload_data={refetch}
                  handleDelete={handleDelete}
                />
              </div>
            </>
          )}

          <Dialog open={openChangePassword} onOpenChange={setOpenChangePassword}>
            <ChangePasswordForm />
          </Dialog>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the link and all
                  associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => sharedLinkRow && deleteSingleSharedLink(sharedLinkRow)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {isLoading && <p>Loading...</p>}
        </div>
      </div>
    </>
  )
}
