import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, CheckCircle2, Car, Percent, LogIn, LogOut, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
});

const trends = [25, 45, 65, 95, 75, 55, 35, 45, 65, 70, 55];
const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

const grid = Array.from({ length: 4 }).map((_, row) =>
  Array.from({ length: 10 }).map((_, col) => {
    const id = `${String.fromCharCode(65 + row)}${String(col + 1).padStart(2, "0")}`;
    const free = Math.random() > 0.45;
    return { id, free };
  })
);

const live = [
  { icon: LogIn, color: "primary", text: <>Vehicle entered <b>Spot A12</b></>, time: "2 minutes ago" },
  { icon: LogOut, color: "muted", text: <>Vehicle left <b>Spot B03</b></>, time: "5 minutes ago" },
  { icon: LogIn, color: "primary", text: <>Vehicle entered <b>Spot C09</b></>, time: "12 minutes ago" },
  { icon: AlertTriangle, color: "destructive", text: <>Wrong-way detection <b className="text-destructive">Exit Gate 2</b></>, time: "18 minutes ago" },
];

function Analytics() {
  return (
    <AppLayout searchPlaceholder="Search facilities, spots or vehicles...">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Park Analytics</h1>
          <p className="text-muted-foreground mt-1">Real-time surveillance and occupancy optimization for Central District Lot.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline"><Calendar className="h-4 w-4 mr-2" /> Last 24 Hours</Button>
          <Button className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"><Download className="h-4 w-4 mr-2" /> Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {[
          { icon: CheckCircle2, label: "Available Spots", value: "248", chip: "+12% vs last hr", chipTone: "good", bg: "bg-primary/10", iconColor: "text-primary" },
          { icon: Car, label: "Occupied Spots", value: "264", chip: "Peak: 512", chipTone: "muted", bg: "bg-sidebar", iconColor: "text-white" },
          { icon: Percent, label: "Current Occupancy", value: "51.5%", chip: "-2% vs yesterday", chipTone: "bad", bg: "bg-muted", iconColor: "text-foreground", progress: 51.5 },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5">
              <div className="flex items-start justify-between mb-6">
                <div className={`h-11 w-11 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                <span className={`text-xs font-medium ${s.chipTone === "good" ? "text-primary" : s.chipTone === "bad" ? "text-destructive" : "text-muted-foreground"}`}>{s.chip}</span>
              </div>
              <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{s.label}</div>
              <div className="text-3xl font-bold mt-1">{s.value}</div>
              {s.progress !== undefined && (
                <div className="mt-3 h-1.5 rounded bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${s.progress}%` }} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Live Parking Map</h2>
              <p className="text-sm text-muted-foreground">Floor 01 - Central District Parking</p>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Available</span>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> Occupied</span>
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {grid.flat().map((s) => (
              <div key={s.id} className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${s.free ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {s.id}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
            <span>⓵ Sensor status: All active</span>
            <span>Last updated: Just now</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Live Activity</h2>
            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">LIVE</span>
          </div>
          <div className="space-y-4">
            {live.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                    a.color === "primary" ? "bg-primary/10 text-primary" :
                    a.color === "destructive" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="w-full mt-5">View Historical Logs</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Occupancy Trends</h2>
            <div className="flex gap-1 text-sm bg-muted rounded-md p-1">
              <button className="px-3 py-1 rounded bg-card font-semibold">Daily</button>
              <button className="px-3 py-1 text-muted-foreground">Weekly</button>
            </div>
          </div>
          <div className="flex items-end gap-3 h-48">
            {trends.map((h, i) => (
              <div key={i} className="flex-1 bg-sidebar rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            {hours.map((h) => <span key={h}>{h}</span>)}
          </div>
        </Card>

        <Card className="p-6 bg-sidebar text-sidebar-foreground">
          <h2 className="text-lg font-bold mb-3">Smart Forecast</h2>
          <p className="text-sm text-sidebar-foreground/60">Based on historical data, we predict the lot will reach 100% capacity in approximately 45 minutes.</p>
          <div className="mt-6 bg-sidebar-accent rounded-lg p-4">
            <div className="text-xs uppercase tracking-widest text-sidebar-primary font-semibold">Recommended Action</div>
            <div className="text-sm mt-2">Enable dynamic pricing surcharge to manage peak demand.</div>
          </div>
          <Button className="w-full mt-4 bg-white text-sidebar hover:bg-white/90">Execute Traffic Flow Plan</Button>
        </Card>
      </div>
    </AppLayout>
  );
}
