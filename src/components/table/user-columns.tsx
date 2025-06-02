import { deleteUser } from '@/api/users'
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
import { useAuth } from '@/hooks/useAuth'
import { UserResponseDto } from '@/models/User'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import AddUserForm from '../addUser'
import EditUserForm from '../editUserForm'
import SetPasswordForm from '../setPassword'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Input } from '../ui/input'
import { DataTableColumnHeader } from './colum-headers'
import { DataTable } from './data-table'

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    handleEdit: (row: Row<TData>) => void
    handleDelete: (row: Row<TData>) => void
    handleSetPassword: (row: Row<TData>) => void
  }
}

export default function UserColumns({
  data,
  reloader
}: {
  data: UserResponseDto[],
  reloader: () => void,
}) {
  const queryClient = useQueryClient()
  const [userRow, setUserRow] = useState<Row<UserResponseDto>>()
  const [open, setOpen] = useState(false)
  const [setPasswordForm, setSetPasswordForm] = useState(false)
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>('')
  const [filteredData, setFilteredData] = useState<UserResponseDto[]>(data || [])
  const [editUser, setEditUser] = useState<UserResponseDto | undefined>(undefined)
  const [openForm, setOpenForm] = useState(false)
  useEffect(() => {
    if (data) {
      setFilteredData(data?.filter((user) => user.email.includes(filter)))
    }
  }, [data, filter])


  const deleteSingleUser = async (row: Row<UserResponseDto>) => {
    await deleteUser(row.original.id)
    queryClient.invalidateQueries({ queryKey: ['users'] })
    toast.success('User deleted successfully')
  }

  const formClose = () => {
    setOpenForm(false)
    setEditUser(undefined)
  }

  const handleEdit = (row: Row<UserResponseDto>) => {
    const user: UserResponseDto = {
      ...row.original
    }
    setEditUser(user)
    setOpenForm(true)
  }
  const handleDelete = async (row: Row<UserResponseDto>) => {
    if (row.original.email === user?.email) {
      toast.error('You cannot delete yourself')
      return
    }
    setOpen(true)
    setUserRow(row)
  }

  const handleSetPassword = async (row: Row<UserResponseDto>) => {
    setUserRow(row)
    setSetPasswordForm(true)
  }



  const columns: ColumnDef<UserResponseDto>[] = [
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="role" />
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <Button variant={'outline'} onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button
            variant={'outline'}
            onClick={() =>
              handleSetPassword(row)
            }>
            Set Password
          </Button>
          <Button variant={'destructive'} onClick={() => handleDelete(row)}>
            Delete
          </Button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="flex gap-4 my-4">
        <Input
          placeholder="Filter on email"
          className="bg-neutral-700/50 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500"
          onChange={(event) => setFilter(event.target.value)}
        />
        <Dialog open={openForm} onOpenChange={formClose}>
          <Button onClick={() => setOpenForm(true)} variant={"secondary"}>Add User</Button>
          {editUser ? (
            <EditUserForm editUser={editUser} onComplete={formClose} />
          ) : (
            <AddUserForm />
          )}
        </Dialog>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => userRow && deleteSingleUser(userRow)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={setPasswordForm} onOpenChange={setSetPasswordForm}>
        {userRow && (
          <SetPasswordForm
            user={userRow?.original}
            closeForm={() => setSetPasswordForm(false)}
          />
        )}
      </Dialog>

      <DataTable
        data={filteredData}
        columns={columns}
        reload_data={reloader}
        handleEdit={handleEdit}
        handleSetPassword={handleSetPassword}
      />
    </div>
  )
}
