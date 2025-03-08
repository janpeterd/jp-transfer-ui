import { deleteUser, getUsers } from "@/api/users";
import LargeText from "@/components/LargeText";
import { DataTable } from "@/components/table/data-table";
import { user_columns } from "@/components/table/user-columns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import AddUserForm from "@/components/addUser";
import { User } from "@/models/User";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditUserForm from "@/components/editUserForm";


export default function Admin() {
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => getUsers(),
  });
  const email = localStorage.getItem("email");
  const [filter, setFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<User[]>(data || []);
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [userRow, setUserRow] = useState<Row<User>>();
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);


  useEffect(() => {
    if (data) {
      setFilteredData(data.filter((user) => user.email.includes(filter)));
    }
  }, [data, filter]);


  const handleEdit = (row: Row<User>) => {
    const user: User = {
      ...row.original,
    };
    setEditUser(user);
    setOpenForm(true);
  };
  const deleteSingleUser = async (row: Row<User>) => {
    await deleteUser(row.original.id);
    queryClient.invalidateQueries({ queryKey: ["users"] });
    toast.success("User deleted successfully");
  }

  const formClose = () => {
    setOpenForm(false);
    setEditUser(undefined);
  }

  const handleDelete = async (row: Row<User>) => {
    if (row.original.email === email) {
      toast.error("You cannot delete yourself");
      return;
    }
    setOpen(true);
    setUserRow(row);
  };

  return (
    <div className="flex flex-col gap-4 w-[80%] max-w-[800px] mx-auto z-20">
      <LargeText string="Admin" />
      {(data && data.length > 0) && (
        <>
          <Input placeholder="Filter on email" onChange={(event) => setFilter(event.target.value)} />
          <DataTable
            data={filteredData}
            columns={user_columns}
            reload_data={refetch}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user and all associated data.
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

          <Dialog open={openForm} onOpenChange={formClose}>
            <Button onClick={() => setOpenForm(true)}>
              Add User
            </Button>
            {editUser ? <EditUserForm editUser={editUser} onComplete={formClose} /> : <AddUserForm />}
          </Dialog>
        </>
      )}
    </div >
  );
}
