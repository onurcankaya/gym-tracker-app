'use client';

import { useMemo, Dispatch, SetStateAction } from 'react';
import { Trash2 as TrashIcon, Loader } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

type DeleteDialog = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string;
  onCancel: () => void;
  onDelete: () => void;
  isLoading: boolean;
};

export default function DeleteDialog({
  open,
  setOpen,
  title,
  description,
  onCancel,
  onDelete,
  isLoading,
}: DeleteDialog) {
  const deleteButtonLabel = useMemo(() => {
    return isLoading ? (
      <Spinner icon={Loader} className="text-white" />
    ) : (
      'Delete'
    );
  }, [isLoading]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || 'This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            {deleteButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
