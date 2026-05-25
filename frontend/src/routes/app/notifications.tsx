import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Filter, AlertTriangle, Wallet, ParkingSquare, BadgeCheck, Download, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({
  component: Notifications,
});

const tabs = ["All Activity", "Reservations", "Finance", "System Warnings", "Updates"];

function Notifications() {
  const [tab, setTab] = useState("All Activity");
  return (
    <AppLayout searchPlaceholder="Search activities or alerts...">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Center</h1>
          <p className="text-muted-foreground mt-1">Stay updated with real-time parking ecosystem events.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Trash2 className="h-4 w-4 mr-2" /> Clear All</Button>
          <Button className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"><Filter className="h-4 w-4 mr-2" /> Filters</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium ${tab === t ? "bg-sidebar text-sidebar-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-4">
        <Card className="p-5 border-destructive/40">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0"><AlertTriangle className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-bold">Critical: Gate 04 Sensor Malfunction</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">2 mins ago</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">The ultrasonic sensor at Gate 04 (Level 2) has stopped reporting data. Entry/Exit verification for this zone is currently disabled.</p>
              <div className="flex gap-4 mt-4">
                <button className="text-sm font-semibold text-destructive hover:underline">Dispatch Maintenance</button>
                <button className="text-sm font-semibold text-muted-foreground hover:underline">Acknowledge</button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Wallet className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold">Daily Settlement Processed</h3>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Daily payouts for March 24th have been successfully initiated. Total volume: $42,500.20.</p>
              </div>
            </div>
          </Card>
          <Card className="p-5 bg-sidebar text-sidebar-foreground">
            <div className="flex gap-3">
              <Download className="h-5 w-5 mt-1" />
              <div>
                <h3 className="font-bold">Version 2.4.0 Ready</h3>
                <p className="text-xs text-sidebar-foreground/70 mt-1">A new system update is available with optimized plate recognition algorithms.</p>
                <Button variant="secondary" className="mt-3 w-full">Review Patch Notes</Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0"><ParkingSquare className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-bold">New VIP Reservation: Zone A-12</h3>
                <span className="text-xs text-muted-foreground">3 hours ago</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">License Plate: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">K-4592-XL</code> has reserved Spot A-12 for 18:00 Today.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 opacity-60">
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0"><BadgeCheck className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className="font-bold line-through">Monthly Audit Completed</h3>
                <span className="text-xs text-muted-foreground">Yesterday</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Internal compliance audit for Zone C (Commercial) has been finalized with 99.8% accuracy.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="rounded-full">Load Older Activity <ChevronDown className="h-4 w-4 ml-2" /></Button>
      </div>
    </AppLayout>
  );
}
