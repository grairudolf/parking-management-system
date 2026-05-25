import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Download, Plus, ParkingSquare, Calendar, Car, History, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

const stats = [
  { icon: ParkingSquare, label: "Available Spaces", value: "142", chip: "+4% vs prev hr", chipTone: "good", footer: <Progress value={72} className="h-1.5" />, sub: "72% Capacity Remaining" },
  { icon: Calendar, label: "Reserved Spots", value: "48", chip: "Next 12h", chipTone: "muted", sub: "+45 others waiting" },
  { icon: Car, label: "Active Vehicles", value: "1,284", chip: "High Flow", chipTone: "bad", sub: "Tracking all active sessions" },
  { icon: History, label: "Total Sessions", value: "8.4k", chip: "Live", chipTone: "good", sub: "Average 4.2h duration" },
];

const activity = [
  { id: "ABC-1234", action: "Entry Verified", spot: "Gate B-01 / #A12", time: "09:42 AM", status: "Completed" },
  { id: "XYZ-9876", action: "Exit Request", spot: "Gate A-02 / #B04", time: "09:38 AM", status: "Processing" },
  { id: "TRK-4411", action: "Payment Due", spot: "Gate C-01 / #E11", time: "09:30 AM", status: "Alert" },
  { id: "LPR-2022", action: "Spot Assigned", spot: "Gate B-01 / #A45", time: "09:25 AM", status: "Completed" },
];

const statusStyle = (s: string) =>
  s === "Completed" ? "bg-primary/10 text-primary" :
  s === "Processing" ? "bg-blue-100 text-blue-700" :
  "bg-red-100 text-red-700";

function Dashboard() {
  return (
    <AppLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Infrastructure Overview</h1>
          <p className="text-muted-foreground mt-2">Real-time status of ParkCar Smart Facility Zone 4A</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Data</Button>
          <Button><Plus className="h-4 w-4 mr-2" /> New Reservation</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-start justify-between mb-6">
                <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-xs font-medium ${
                  s.chipTone === "good" ? "text-primary" :
                  s.chipTone === "bad" ? "text-destructive" : "text-muted-foreground"
                }`}>{s.chip}</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{s.label}</div>
              <div className="text-4xl font-bold mt-1">{s.value}</div>
              <div className="mt-4 space-y-1.5">
                {s.footer}
                <div className="text-xs text-muted-foreground">{s.sub}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Vehicle ID</th>
                  <th className="pb-3 font-medium">Action</th>
                  <th className="pb-3 font-medium">Gate / Spot</th>
                  <th className="pb-3 font-medium">Timestamp</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-4 font-semibold">{a.id}</td>
                    <td className="py-4">{a.action}</td>
                    <td className="py-4 text-muted-foreground">{a.spot}</td>
                    <td className="py-4 text-muted-foreground">{a.time}</td>
                    <td className="py-4">
                      <Badge variant="secondary" className={statusStyle(a.status)}>{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Occupancy Trend</h2>
            <div className="flex items-end justify-between h-32 gap-2">
              {[40, 55, 75, 95, 70, 45, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full rounded-t ${i === 3 ? "bg-sidebar" : i === 2 || i === 4 ? "bg-sidebar/80" : "bg-muted"}`} style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>6am</span><span className="font-medium text-foreground">Peak (12pm)</span><span>6pm</span>
            </div>
            <div className="mt-5 pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Estimated Turnover</span><span className="font-semibold">12.4 min</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Peak Utilization</span><span className="font-semibold text-primary">94.2%</span></div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden bg-sidebar text-sidebar-foreground relative">
            <div className="aspect-[16/9] bg-gradient-to-br from-sidebar to-primary/40 relative">
              <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <ExternalLink className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-4">
                <div className="text-xs uppercase tracking-widest text-sidebar-primary font-semibold">Live View</div>
                <div className="text-lg font-bold mt-1">Parking Lot A-04</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
