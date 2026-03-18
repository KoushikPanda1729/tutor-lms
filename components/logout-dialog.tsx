"use client";

import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLogout } from "@/hooks/use-logout";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const logout = useLogout();

  const handleConfirm = async () => {
    onOpenChange(false);
    await logout();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-lg">Sign out?</DialogTitle>
          <DialogDescription className="text-center text-slate-500">
            You&apos;ll be redirected to the login page. Any unsaved changes will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:flex-row mt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleConfirm()}
            className="flex-1 h-10 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
          >
            Yes, sign out
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
