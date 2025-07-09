
import { deleteTransfer } from '@/api/transfer';
import { formatSize } from "@/lib/utils";
import { TransferResponseDto } from "@/models/TransferResponseDto";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from 'react';
import { toast } from 'sonner';
import CopyLink from "../CopyLink";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DataTableColumnHeader } from "./colum-headers";
import { DataTable } from "./data-table";

export default function TransferColumns({
  data,
  reloader,
}: {
  data: TransferResponseDto[],
  reloader: () => void,
}) {

  const [rowToDelete, setRowToDelete] = useState<Row<TransferResponseDto> | null>(null);
  const queryClient = useQueryClient();
  const deleteSingleSharedLink = async () => {
    if (!rowToDelete) return;
    if (rowToDelete.original.id !== undefined) {
      await deleteTransfer(rowToDelete.original.id);
      queryClient.invalidateQueries({ queryKey: ['userProfileTransfers'] });
      queryClient.invalidateQueries({ queryKey: ['systemStorageInfoProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userStorageInfoProfile'] });
      toast.success('Transfer deleted successfully!');
    } else {
      toast.error('Failed to transfer: ID is undefined.');
    }
    setRowToDelete(null);
  };

  const columns: ColumnDef<TransferResponseDto>[] = [
    {
      id: "url",
      accessorKey: "url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="URL" />
      ),
      cell: ({ row }) => <CopyLink url={`${window.origin}/download/${row.original.sharedLink?.uuid}`} />,
    },
    {
      id: "downloads",
      accessorKey: "sharedLink.downloads",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Downloads" />
      ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ row }) => new Date(row.original.sharedLink?.createdAt ?? "").toLocaleString(),
    },
    {
      id: "expiresAt",
      accessorKey: "expiresAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Expires At" />
      ),
      cell: ({ row }) => new Date(row.original.sharedLink?.expiresAt ?? "").toLocaleString(),
    },
    {
      id: "fileSize",
      accessorKey: "fileSize",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="File Size" />
      ),
      cell: ({ row }) => formatSize(row.original.totalSize),
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-4">
          <Button variant={"destructive"} onClick={() => setRowToDelete(row)}>Delete</Button>
        </div>
      ),
    }
  ];
  return (
    <>

      <DataTable
        data={data}
        columns={columns}
        reload_data={reloader}
      />
      <AlertDialog
        open={!!rowToDelete}
        onOpenChange={(isOpen) => !isOpen && setRowToDelete(null)}
      >
        <AlertDialogContent className="bg-neutral-800 border-neutral-700 text-neutral-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-300">
              This action cannot be undone. This will permanently delete the selected shared link.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-neutral-700 focus:ring-neutral-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteSingleSharedLink}
              className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            >
              Yes, Delete Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
