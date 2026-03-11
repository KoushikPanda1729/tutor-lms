"use client";

import { useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function SettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [orgName, setOrgName] = useState("Allen Career Institute");
  const [city, setCity] = useState("Kota");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("admin@allen.ac.in");

  const save = () => toast.success("Settings saved!");

  return (
    <div>
      <PageHeader title="Settings" description="Manage your institute settings" />

      <Tabs defaultValue="general" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Institute Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Institute Name",
                  value: orgName,
                  setter: setOrgName,
                  placeholder: "Allen Career Institute",
                },
                { label: "City", value: city, setter: setCity, placeholder: "Kota" },
                { label: "Phone", value: phone, setter: setPhone, placeholder: "9876543210" },
                {
                  label: "Email",
                  value: email,
                  setter: setEmail,
                  placeholder: "admin@example.com",
                },
              ].map(({ label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Subdomain</label>
                <div className="flex items-center gap-2">
                  <input
                    value={slug}
                    readOnly
                    className="flex h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                  />
                  <span className="text-sm text-slate-400">.tutorlms.com</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Contact support to change your subdomain.
                </p>
              </div>
              <Button onClick={save}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-bold text-indigo-800 text-lg">Enterprise Plan</p>
                <p className="text-xs text-indigo-600">Unlimited batches, students & storage</p>
              </div>
              <Button variant="outline">Manage Billing</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">Delete Institute</p>
                <p className="text-xs text-slate-500 mb-3">
                  This will permanently delete your institute and all associated data. This action
                  cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => toast.error("Please contact support to delete your account.")}
                >
                  Delete Institute
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
