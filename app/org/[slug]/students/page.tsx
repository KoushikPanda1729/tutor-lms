"use client";

import { useState, use } from "react";
import { Search, Users, Mail, Phone, BookOpen, Link2, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { mockStudents, mockBatches } from "@/lib/mock-data";
import { getInitials, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function StudentsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const inviteLink = `https://${slug}.tutorlms.com/join/abc123xyz`;

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${mockStudents.length} students enrolled`}
        action={
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Link2 className="h-3.5 w-3.5" /> Invite Students
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Students</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  Share this link with students to join your coaching center.
                </p>
                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <p className="text-xs font-mono text-slate-700 flex-1 truncate">{inviteLink}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(inviteLink);
                      toast.success("Copied!");
                    }}
                    className="shrink-0 text-indigo-600 hover:text-indigo-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {mockBatches
                    .filter((b) => b.status === "active")
                    .map((batch) => (
                      <button
                        key={batch.id}
                        onClick={() => {
                          toast.success("Batch-specific link copied!");
                        }}
                        className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-left"
                      >
                        <BookOpen className="h-4 w-4 text-indigo-600 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-slate-800 line-clamp-1">
                            {batch.name}
                          </p>
                          <p className="text-xs text-slate-400">Copy link</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="flex h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Student", "Contact", "Batches", "Joined", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-indigo-600">
                            {getInitials(student.name)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-800">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {student.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />
                        {student.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{student.enrolledBatches.length} batches</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-indigo-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
