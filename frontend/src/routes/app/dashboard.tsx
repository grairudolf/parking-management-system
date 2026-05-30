import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addVehicle, getAllEntries, getAllSpots, getAllVehicles, getAnalyticsSummary } from "@/lib/api";
import { getUser } from "@/lib/auth";
import {
  Download, Plus, ParkingSquare, Calendar, Car, History, ExternalLink,
} from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/app/dashboard")({
  component: Dashboard,
});

const statusStyle = (s: string) =>
  s === "Completed" ? "bg-primary/10 text-primary" :
  s === "Processing" ? "bg-blue-100 text-blue-700" :
  "bg-red-100 text-red-700";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  const { data: analytics, isLoading: analyticsLoading, isError: analyticsError } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalyticsSummary,
  });

  const { data: spots, isLoading: spotsLoading, isError: spotsError } = useQuery({
    queryKey: ["spots"],
    queryFn: getAllSpots,
  });

  const { data: entries, isLoading: entriesLoading, isError: entriesError } = useQuery({
    queryKey: ["entries"],
    queryFn: getAllEntries,
  });

  const { data: vehicles, refetch: refetchVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles,
  });

  const availableSpotsCount = spots ? spots.filter(s => !s.occupied).length : 0;
  const reservedSpotsCount = spots ? spots.filter(s => s.occupied).length : 0;
  const totalSpotsCount = spots ? spots.length : 1;
  const spacesProgress = (availableSpotsCount / totalSpotsCount) * 100;

  const sortedEntries = entries
    ? [...entries]
        .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
        .slice(0, 5)
    : [];

  const customerVehicles = vehicles?.filter(v => v.customer?.customerId === user?.customerId) ?? [];

  const handleAddVehicle = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!vehicleModel.trim() || !vehicleType.trim() || !vehiclePlate.trim()) {
      toast.error("Enter model, type, and plate number.");
      return;
    }
    try {
      await addVehicle(vehicleModel.trim(), vehicleType.trim(), vehiclePlate.trim().toUpperCase(), user.customerId);
      setVehicleModel("");
      setVehicleType("");
      setVehiclePlate("");
      await refetchVehicles();
      toast.success("Vehicle saved.");
    } catch (error: any) {
      toast.error(error.message || "Could not save vehicle.");
    }
  };

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      analytics,
      spots: spots ?? [],
      entries: entries ?? [],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `parkcar-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded.");
  };

  return (
    <AppLayout>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Infrastructure Overview</h1>
          <p className="text-muted-foreground mt-2">Real-time status of ParkCar Smart Facility Zone 4A</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" /> Export Data</Button>
          <Button onClick={() => navigate({ to: "/app/reserve" })}><Plus className="h-4 w-4 mr-2" /> New Reservation</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Available Spaces */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <ParkingSquare className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">+4% vs prev hr</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Available Spaces</div>
          <div className="text-4xl font-bold mt-1">
            {spotsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : spotsError ? (
              <span className="text-xs text-muted-foreground">Failed to load</span>
            ) : (
              availableSpotsCount
            )}
          </div>
          <div className="mt-4 space-y-1.5">
            <Progress value={spacesProgress} className="h-1.5" />
            <div className="text-xs text-muted-foreground">{spots && spots.length > 0 ? `${spacesProgress.toFixed(0)}% Capacity Remaining` : "No spaces configured yet"}</div>
          </div>
        </Card>

        {/* Reserved Spots */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Next 12h</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Reserved Spots</div>
          <div className="text-4xl font-bold mt-1">
            {spotsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : spotsError ? (
              <span className="text-xs text-muted-foreground">Failed to load</span>
            ) : (
              reservedSpotsCount
            )}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="text-xs text-muted-foreground">+45 others waiting</div>
          </div>
        </Card>

        {/* Active Vehicles (Current Occupancy %) */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-destructive">High Flow</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Current Occupancy</div>
          <div className="text-4xl font-bold mt-1">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
              <span className="text-xs text-muted-foreground">Failed to load</span>
            ) : (
              `${(analytics?.occupancyRate || 0).toFixed(1)}%`
            )}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="text-xs text-muted-foreground">Tracking all active sessions</div>
          </div>
        </Card>

        {/* Total Sessions (Total Revenue) */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">Live</span>
          </div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Revenue</div>
          <div className="text-4xl font-bold mt-1">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
              <span className="text-xs text-muted-foreground">Failed to load</span>
            ) : (
              `$${(analytics?.totalRevenue || 0).toFixed(2)}`
            )}
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="text-xs text-muted-foreground">
              {analyticsLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : analytics ? (
                analytics.peakHour >= 0 ? `Peak hour: ${analytics.peakHour}:00` : "No traffic recorded yet"
              ) : (
                "Average 4.2h duration"
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button onClick={() => navigate({ to: "/app/verification" })} className="text-sm font-medium text-primary hover:underline">View All Logs</button>
          </div>
          <div className="overflow-x-auto">
            {entriesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : entriesError ? (
              <p className="text-sm text-destructive font-semibold">Failed to load activity logs.</p>
            ) : (
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
                  {sortedEntries.map((a) => (
                    <tr key={a.entryId} className="border-b last:border-0">
                      <td className="py-4 font-semibold">{a.vehicle?.plateNumber || "N/A"}</td>
                      <td className="py-4">Entry Verified</td>
                      <td className="py-4 text-muted-foreground">
                        {a.reservation?.parkingSpot?.spotId || "N/A"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {new Date(a.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className={statusStyle("Completed")}>Completed</Badge>
                      </td>
                    </tr>
                  ))}
                  {sortedEntries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">No recent entries recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">My Vehicles</h2>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 gap-2 mb-4">
              <input value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())} placeholder="Plate number" className="border rounded-md px-3 py-2 text-sm bg-background" />
              <div className="grid grid-cols-2 gap-2">
                <input value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Model" className="border rounded-md px-3 py-2 text-sm bg-background" />
                <input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Type" className="border rounded-md px-3 py-2 text-sm bg-background" />
              </div>
              <Button type="submit" size="sm"><Plus className="h-4 w-4 mr-2" /> Save Vehicle</Button>
            </form>
            <div className="space-y-2">
              {customerVehicles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vehicles saved yet.</p>
              ) : customerVehicles.map(vehicle => (
                <div key={vehicle.vehicleId} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <div className="font-semibold">{vehicle.plateNumber}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.model} · {vehicle.type}</div>
                  </div>
                  <Car className="h-4 w-4 text-primary" />
                </div>
              ))}
            </div>
          </Card>

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
              <button onClick={() => navigate({ to: "/app/analytics" })} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
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
