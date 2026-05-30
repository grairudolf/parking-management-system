import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { verifyEntry, verifyExit, getAllEntries } from "@/lib/api";
import { QrCode, Car, Hourglass, Check, X, Camera, LogIn, LogOut, Pencil } from "lucide-react";

export const Route = createFileRoute("/app/verification")({
  component: Verification,
});

function Verification() {
  const queryClient = useQueryClient();

  // Entry verification states
  const [plateNumber, setPlateNumber] = useState("");
  const [reservationID, setReservationID] = useState("");
  const [entryError, setEntryError] = useState<string | null>(null);

  // Exit verification states
  const [entryId, setEntryId] = useState("");
  const [exitError, setExitError] = useState<string | null>(null);

  // Live activity log query
  const { data: entries, isLoading: entriesLoading, isError: entriesError } = useQuery({
    queryKey: ["entries"],
    queryFn: getAllEntries,
  });

  const sortedEntries = entries
    ? [...entries]
        .sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime())
        .slice(0, 4)
    : [];

  const entryMutation = useMutation({
    mutationFn: async () => {
      setEntryError(null);
      if (!plateNumber.trim() || !reservationID.trim()) {
        throw new Error("Both fields are required.");
      }
      return await verifyEntry(plateNumber, reservationID);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Entry verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      setPlateNumber("");
      setReservationID("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Entry verification failed.");
      setEntryError(err.message || "Verification failed.");
    },
  });

  const exitMutation = useMutation({
    mutationFn: async () => {
      setExitError(null);
      if (!entryId.trim()) {
        throw new Error("Entry ID is required.");
      }
      return await verifyExit(entryId);
    },
    onSuccess: (res) => {
      toast.success(`Exit recorded. Duration: ${res.durationMinutes} minutes.`);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      setEntryId("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Exit verification failed.");
      setExitError(err.message || "Exit failed.");
    },
  });

  const formatRelativeTime = (timeStr: string) => {
    const diffMs = Date.now() - new Date(timeStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} mins ago`;
  };

  return (
    <AppLayout searchPlaceholder="Search plates or bookings...">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkpoint Verification</h1>
        <p className="text-muted-foreground mt-1">Process vehicle entry and exit with smart license plate recognition and QR validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Entry and Exit forms */}
        <div className="space-y-5">
          {/* Entry Verification form */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold flex items-center gap-2"><QrCode className="h-5 w-5" /> Entry Verification</h2>
              <Badge className="bg-primary/15 text-primary">● ACTIVE</Badge>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                entryMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="plateNumberInput" className="text-xs font-semibold tracking-widest uppercase">
                  Plate Number
                </Label>
                <Input
                  id="plateNumberInput"
                  placeholder="e.g. ABC-1234"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="h-12 bg-secondary/60"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reservationIDInput" className="text-xs font-semibold tracking-widest uppercase">
                  Reservation ID
                </Label>
                <Input
                  id="reservationIDInput"
                  placeholder="Enter reservation UUID"
                  value={reservationID}
                  onChange={(e) => setReservationID(e.target.value)}
                  className="h-12 bg-secondary/60"
                  required
                />
              </div>

              {entryError && <p className="text-destructive text-sm font-semibold">{entryError}</p>}

              <Button
                type="submit"
                className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground mt-4"
                disabled={entryMutation.isPending}
              >
                {entryMutation.isPending ? "Verifying..." : "Verify Entry"}
              </Button>
            </form>
          </Card>

          {/* Exit Verification card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold flex items-center gap-2"><LogOut className="h-5 w-5" /> Exit Verification</h2>
              <Badge variant="outline">Checkpoint</Badge>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                exitMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="entryIdInput" className="text-xs font-semibold tracking-widest uppercase">
                  Entry ID
                </Label>
                <Input
                  id="entryIdInput"
                  placeholder="Enter entry UUID"
                  value={entryId}
                  onChange={(e) => setEntryId(e.target.value)}
                  className="h-12 bg-secondary/60"
                  required
                />
              </div>

              {exitError && <p className="text-destructive text-sm font-semibold">{exitError}</p>}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 mt-4"
                disabled={exitMutation.isPending}
              >
                {exitMutation.isPending ? "Processing..." : "Process Exit"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Vehicle Identification, Session details, and Live log */}
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="font-bold flex items-center gap-2 mb-5"><Car className="h-5 w-5" /> Vehicle Identification</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Detected Plate</div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="border-2 border-foreground rounded px-3 py-2 text-center font-bold text-lg">ABC-9842</div>
                  <div className="flex items-start justify-between mt-3 text-xs">
                    <div>
                      <div className="font-semibold">Tesla Model 3</div>
                      <div className="text-muted-foreground mt-1">Color: Pearl White</div>
                    </div>
                    <button type="button" className="text-muted-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">Trust Score</div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">98%</div>
                    <Badge className="bg-primary/20 text-primary">Verified</Badge>
                  </div>
                  <div className="h-1.5 mt-3 bg-muted rounded overflow-hidden"><div className="h-full bg-primary" style={{ width: "98%" }} /></div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="font-semibold flex items-center gap-2 mb-4"><Hourglass className="h-4 w-4" /> Session Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Entry Time</span><span className="font-bold">09:12 AM</span></div>
                <div className="flex justify-between pt-3 border-t"><span className="text-muted-foreground">Duration</span><span className="font-bold">03h 42m</span></div>
                <div className="flex justify-between pt-3 border-t"><span className="text-muted-foreground">Estimated Fee</span><span className="font-bold text-primary">$14.50</span></div>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Decision</h3>
              <div className="bg-muted rounded-md p-3 flex items-center gap-2 text-sm text-muted-foreground mb-3"><Hourglass className="h-4 w-4" /> Awaiting action...</div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-primary hover:bg-primary/90"><Check className="h-4 w-4 mr-1" /> Confirm</Button>
                <Button variant="destructive"><X className="h-4 w-4 mr-1" /> Deny</Button>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Live Activity Log</h3>
              <button type="button" className="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {entriesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : entriesError ? (
                <p className="text-sm text-destructive font-semibold">Failed to load activity log.</p>
              ) : (
                sortedEntries.map((e) => (
                  <div key={e.entryId} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <LogIn className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{e.vehicle?.plateNumber || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        Entry Approved · {formatRelativeTime(e.entryTime)}
                      </div>
                    </div>
                    <Badge className="bg-primary/15 text-primary">SUCCESS</Badge>
                  </div>
                ))
              )}
              {!entriesLoading && sortedEntries.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">No recent entry activity.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
