"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SuperAdminSettingsPage() {
  const [appName, setAppName] = useState("TutorLMS");
  const [supportEmail, setSupportEmail] = useState("support@tutorlms.com");
  const [rootDomain, setRootDomain] = useState("tutorlms.com");

  const save = () => toast.success("Settings saved!");

  return (
    <div>
      <PageHeader title="Platform Settings" description="Configure global platform settings" />

      <Tabs defaultValue="general" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Platform Name", value: appName, setter: setAppName },
                { label: "Support Email", value: supportEmail, setter: setSupportEmail },
                { label: "Root Domain", value: rootDomain, setter: setRootDomain },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              ))}
              <Button onClick={save}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">Require Manual Approval</p>
                  <p className="text-xs text-slate-500">
                    New coaching centers require admin approval before activation
                  </p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">Free Plan</p>
                  <p className="text-xs text-slate-500">
                    Allow new centers to register on the free plan
                  </p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">Email Verification</p>
                  <p className="text-xs text-slate-500">
                    Require email verification on registration
                  </p>
                </div>
                <Badge variant="secondary">Disabled</Badge>
              </div>
              <Button onClick={save}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-800 mb-1">Payment Gateway</p>
                <p className="text-xs text-amber-700">
                  Connect Razorpay to enable billing for coaching centers.
                </p>
              </div>
              {[
                { label: "Razorpay Key ID", placeholder: "rzp_live_xxxxxxxxxxxx" },
                { label: "Razorpay Key Secret", placeholder: "••••••••••••••••" },
                { label: "Webhook Secret", placeholder: "whsec_xxxxxxxxxxxx" },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                  <input
                    type="password"
                    placeholder={placeholder}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
              ))}
              <Button onClick={save}>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
