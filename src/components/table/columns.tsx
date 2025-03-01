
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./colum-headers";
import { SharedLink } from "@/models/SharedLink";
import { formatSize } from "@/lib/utils";
import CopyLink from "../CopyLink";

export const columns: ColumnDef<SharedLink>[] = [
  {
    id: "url",
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => <CopyLink url={row.original.downloadLink} />,
  },
  {
    id: "downloads",
    accessorKey: "downloads",
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
    cell: ({ row }) => new Date(row.original.createdAt ?? "").toLocaleString(),
  },
  {
    id: "expiresAt",
    accessorKey: "expiresAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ row }) => new Date(row.original.createdAt ?? "").toLocaleString(),
  },

  {
    id: "maxDownloads",
    accessorKey: "maxDownloads",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Downloads" />
    ),
  },
  {
    id: "fileSize",
    accessorKey: "fileSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File Size" />
    ),
    cell: ({ row }) => formatSize(row.original.fileSize),
  },
  {
    id: "isProtected",
    accessorKey: "isProtected",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Protected" />
    ),
    cell: ({ row }) => (row.original.isProtected ? "Yes" : "No"),
  },
  {
    id: "password",
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Password" />
    ),
    cell: ({ row }) =>
      row.original.isProtected ? row.original.password : "N/A",
  },
];
