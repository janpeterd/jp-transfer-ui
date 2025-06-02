import { deleteSharedLink } from "@/api/sharedLinks";
import { TransferResponseDto } from "@/models/TransferResponseDto";
import { TableMeta } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

// New DeleteButton component
function DeleteButton({
  sharedLinkId,
  table,
}: {
  sharedLinkId: number;
  table: TableMeta<TransferResponseDto> | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteConfirm = async () => {
    if (sharedLinkId) {
      try {
        await deleteSharedLink(sharedLinkId); // Call the API delete function

        table?.options.meta?.reload_data(); // Refresh the data
        toast(`Successfully deleted this link.`);
      } catch {
        toast.error("Error deleting the link"); // Show an error toast
      }
      setIsOpen(false); // Close the dialog after the action
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-y-0.5">
      <Button onClick={() => setIsOpen(true)} className="bg-accent px-3 py-1">
        <Trash />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete your data and this link?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The data and access will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteConfirm();
              }}
              className="bg-accent"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default DeleteButton;
