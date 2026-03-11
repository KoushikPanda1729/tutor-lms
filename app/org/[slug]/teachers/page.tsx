"use client";

import { useState } from "react";
import { Plus, Mail, Phone, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockTeachers, mockBatches } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const invite = async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Invitation sent to ${email}`);
    setOpen(false);
    setEmail("");
  };

  return (
    <div>
      <PageHeader
        title="Teachers"
        description={`${mockTeachers.length} teachers`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5" /> Invite Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Teacher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Send an invitation email to add a teacher to your institute.
                </p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Teacher Email
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="teacher@example.com"
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={invite}>
                    Send Invite
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {mockTeachers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No teachers yet"
          description="Invite teachers to your institute."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTeachers.map((teacher) => {
            const assignedBatches = mockBatches.filter((b) =>
              teacher.assignedBatches.includes(b.id)
            );
            return (
              <Card key={teacher.id} className="hover:border-indigo-200 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-indigo-600">
                        {getInitials(teacher.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{teacher.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {teacher.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {teacher.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Assigned Batches</p>
                    <div className="flex flex-wrap gap-1.5">
                      {assignedBatches.map((b) => (
                        <Badge key={b.id} variant="secondary" className="text-xs">
                          {b.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
