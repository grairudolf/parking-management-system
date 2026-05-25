import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Settings as SettingsIcon, ShieldCheck, KeyRound, Shield, Monitor } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const [digest, setDigest] = useState(true);

  return (
    <AppLayout searchPlaceholder="Search settings...">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your administrative identity, system preferences, and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-11 w-11 rounded-lg bg-sidebar text-sidebar-foreground flex items-center justify-center"><User className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-bold">Profile Identity</h2><p className="text-sm text-muted-foreground">Public information within the ParkCar network.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="Marcus Vance" /></div>
            <div className="space-y-2"><Label>Email Address</Label><Input defaultValue="m.vance@citygov.smart" /></div>
            <div className="space-y-2"><Label>Department</Label><Input defaultValue="Traffic & Infrastructure" /></div>
            <div className="space-y-2"><Label>Role</Label><Input defaultValue="Systems Administrator" /></div>
          </div>
          <div className="flex justify-end mt-5"><Button className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground">Save Identity Changes</Button></div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/15 flex items-center justify-center"><SettingsIcon className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-bold">Preferences</h2>
          </div>
          <div className="space-y-5">
            {[
              { label: "Dark Mode", desc: "Switch to high-contrast dark UI", v: dark, set: setDark },
              { label: "System Alerts", desc: "Enable push desktop notifications", v: alerts, set: setAlerts },
              { label: "Email Digests", desc: "Weekly analytical performance reports", v: digest, set: setDigest },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between">
                <div><div className="font-semibold text-sm">{p.label}</div><div className="text-xs text-muted-foreground">{p.desc}</div></div>
                <Switch checked={p.v} onCheckedChange={p.set} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center"><ShieldCheck className="h-5 w-5" /></div>
            <div><h2 className="text-lg font-bold">Security & Access</h2><p className="text-sm text-muted-foreground">Ensure your account remains locked down and audit-compliant.</p></div>
          </div>
          <span className="text-xs bg-muted px-3 py-1.5 rounded-full">Last security audit: 2 days ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 font-bold mb-2"><KeyRound className="h-4 w-4" /> Password</div>
            <p className="text-sm text-muted-foreground mb-4">Change your account password regularly to maintain high security standards.</p>
            <Button variant="outline" className="w-full">Update Password</Button>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 font-bold mb-2"><Shield className="h-4 w-4" /> Two-Factor (2FA)</div>
            <p className="text-sm text-muted-foreground mb-4">Currently: <span className="text-primary font-semibold">Active</span> via Authenticator App.</p>
            <Button variant="outline" className="w-full">Manage 2FA</Button>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 font-bold mb-2"><Monitor className="h-4 w-4" /> Active Sessions</div>
            <div className="text-sm space-y-1 mb-4">
              <div className="flex items-center gap-2"><span className="h-2 w-2 bg-primary rounded-full" /> <b>MacBook Pro</b> · London, UK · Current</div>
              <div className="flex items-center gap-2 text-muted-foreground"><span className="h-2 w-2 bg-muted-foreground rounded-full" /> iPhone 15 · London, UK · 4h ago</div>
            </div>
            <Button variant="outline" className="w-full text-destructive border-destructive/40 hover:bg-destructive/5">Terminate All Sessions</Button>
          </Card>
        </div>
      </Card>
    </AppLayout>
  );
}
