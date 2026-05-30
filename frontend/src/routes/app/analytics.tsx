import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary, getAllSpots, getAllEntries } from "@/lib/api";
import { Calendar, Download, CheckCircle2, Car, Percent, LogIn, LogOut, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
});

const trends = [25, 45, 65, 95, 75, 55, 35, 45, 65, 70, 55];
const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

function Analytics() {
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

  const sortedEntries = entries
    ? [...entries]
        .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
        .slice(0, 4)
    : [];

  const formatRelativeTime = (timeStr: string) => {
    const diffMs = Date.now() - new Date(timeStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} mins ago`;
  };

  const occupancyRate = analytics ? analytics.occupancyRate : 0;
  const totalRevenue = analytics ? analytics.totalRevenue : 0;
  const peakHour = analytics ? analytics.peakHour : 0;

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
        {/* Available Spots Card */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">
              {analyticsLoading ? <Skeleton className="h-3 w-16" /> : `+$${totalRevenue.toFixed(2)} Revenue`}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Available Spots</div>
          <div className="text-3xl font-bold mt-1">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
              <span className="text-sm text-muted-foreground">Error</span>
            ) : (
              `${(100 - occupancyRate).toFixed(1)}% free`
            )}
          </div>
        </Card>

        {/* Occupied Spots Card */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-sidebar flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {analyticsLoading ? <Skeleton className="h-3 w-16" /> : `Peak hour: ${peakHour}:00`}
            </span>
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Occupied Spots</div>
          <div className="text-3xl font-bold mt-1">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
              <span className="text-sm text-muted-foreground">Error</span>
            ) : (
              `${occupancyRate.toFixed(1)}%`
            )}
          </div>
        </Card>

        {/* Current Occupancy Card */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-6">
            <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center">
              <Percent className="h-5 w-5 text-foreground" />
            </div>
            <span className="text-xs font-medium text-destructive">-2% vs yesterday</span>
          </div>
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Current Occupancy</div>
          <div className="text-3xl font-bold mt-1">
            {analyticsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : analyticsError ? (
              <span className="text-sm text-muted-foreground">Error</span>
            ) : (
              `${occupancyRate.toFixed(1)}%`
            )}
          </div>
          {!analyticsLoading && !analyticsError && (
            <div className="mt-3 h-1.5 rounded bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${occupancyRate}%` }} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Live Parking Map Card */}
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
          
          {spotsLoading ? (
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : spotsError ? (
            <p className="text-sm text-destructive font-semibold">Failed to load parking map.</p>
          ) : spots?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No spots configured yet</p>
          ) : (
            <div className="grid grid-cols-10 gap-2">
              {spots?.map((s) => (
                <div
                  key={s.spotId}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold ${
                    !s.occupied ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.spotId}
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
            <span>⓵ Sensor status: All active</span>
            <span>Last updated: Just now</span>
          </div>
        </Card>

        {/* Live Activity Feed */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold">Live Activity</h2>
            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">LIVE</span>
          </div>
          <div className="space-y-4">
            {entriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : entriesError ? (
              <p className="text-sm text-destructive font-semibold">Failed to load live activity.</p>
            ) : (
              sortedEntries.map((e) => (
                <div key={e.entryId} className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <LogIn className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      Vehicle entered Spot <b>{e.reservation?.parkingSpot?.spotId || "unknown"}</b>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(e.entryTime)}</div>
                  </div>
                </div>
              ))
            )}
            {!entriesLoading && sortedEntries.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">No recent activity detected.</p>
            )}
          </div>
          <Button variant="outline" className="w-full mt-5">View Historical Logs</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Occupancy Trends</h2>
            <div className="flex gap-1 text-sm bg-muted rounded-md p-1">
              <button type="button" className="px-3 py-1 rounded bg-card font-semibold">Daily</button>
              <button type="button" className="px-3 py-1 text-muted-foreground">Weekly</button>
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

        {/* Smart Forecast Card */}
        <Card className="p-6 bg-sidebar text-sidebar-foreground">
          <h2 className="text-lg font-bold mb-3">Smart Forecast</h2>
          <p className="text-sm text-sidebar-foreground/60">
            Based on historical data and current occupancy of {occupancyRate.toFixed(1)}%, we predict the lot will reach 100% capacity in approximately 45 minutes.
          </p>
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
