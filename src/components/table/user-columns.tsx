
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./colum-headers";
import { User } from "@/models/User";
import { Button } from "../ui/button";



declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    handleEdit: (row: Row<TData>) => void;
    handleDelete: (row: Row<TData>) => void;
  }
}


export const user_columns: ColumnDef<User>[] = [
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: "role",
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="role" />
    ),
  },
  {
    id: "actions",
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row, table }) => (
      <div className="flex justify-center items-center gap-4">
        <Button variant={"outline"} onClick={() => table.options.meta?.handleEdit(row)}>Edit</Button>
        <Button variant={"destructive"} onClick={() => table.options.meta?.handleDelete(row)}>Delete</Button>
      </div>
    ),
  }
];
