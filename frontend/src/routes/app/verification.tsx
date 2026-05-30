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
import { getAllEntries, verifyEntry, verifyExit, verifyReceiptNumber } from "@/lib/api";
import { Car, Check, Hourglass, LogIn, LogOut, QrCode, ReceiptText, X } from "lucide-react";

export const Route = createFileRoute("/app/verification")({
  component: Verification,
});

function Verification() {
  const queryClient = useQueryClient();
  const [plateNumber, setPlateNumber] = useState("");
  const [reservationID, setReservationID] = useState("");
  const [entryError, setEntryError] = useState<string | null>(null);
  const [lastEntryId, setLastEntryId] = useState("");
  const [entryId, setEntryId] = useState("");
  const [exitError, setExitError] = useState<string | null>(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptStatus, setReceiptStatus] = useState("");

  const { data: entries, isLoading: entriesLoading, isError: entriesError } = useQuery({
    queryKey: ["entries"],
    queryFn: getAllEntries,
  });

  const sortedEntries = entries
    ? [...entries].sort((a, b) => new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime()).slice(0, 5)
    : [];

  const entryMutation = useMutation({
    mutationFn: async () => {
      setEntryError(null);
      setLastEntryId("");
      if (!plateNumber.trim() || !reservationID.trim()) throw new Error("Plate number and reservation ID are required.");
      return await verifyEntry(plateNumber.trim().toUpperCase(), reservationID.trim());
    },
    onSuccess: (res) => {
      setLastEntryId(res.entryId);
      toast.success(`Entry approved. Entry ID: ${res.entryId}`);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      setPlateNumber("");
      setReservationID("");
    },
    onError: (err: any) => {
      const message = err.message || "Entry verification failed.";
      setEntryError(message);
      toast.error(message);
    },
  });

  const exitMutation = useMutation({
    mutationFn: async () => {
      setExitError(null);
      if (!entryId.trim()) throw new Error("Entry ID is required.");
      return await verifyExit(entryId.trim());
    },
    onSuccess: (res) => {
      toast.success(res.message || `Exit recorded. Duration: ${res.durationMinutes} minutes.`);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      setEntryId("");
    },
    onError: (err: any) => {
      const message = err.message || "Exit verification failed.";
      setExitError(message);
      toast.error(message);
    },
  });

  const receiptMutation = useMutation({
    mutationFn: async () => {
      if (!receiptNumber.trim()) throw new Error("Receipt number is required.");
      return await verifyReceiptNumber(receiptNumber.trim());
    },
    onSuccess: (res) => {
      setReceiptStatus(res.message || "Receipt is valid.");
      toast.success(res.message || "Receipt is valid.");
    },
    onError: (err: any) => {
      const message = err.message || "Receipt is not valid.";
      setReceiptStatus(message);
      toast.error(message);
    },
  });

  const formatRelativeTime = (timeStr: string) => {
    const diffMins = Math.floor((Date.now() - new Date(timeStr).getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} mins ago`;
  };

  return (
    <AppLayout searchPlaceholder="Search plates, reservations, receipts, or entry IDs...">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkpoint Verification</h1>
        <p className="text-muted-foreground mt-1">Entry creates an Entry ID. Exit consumes that Entry ID so it cannot be reused.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold flex items-center gap-2"><QrCode className="h-5 w-5" /> Entry Verification</h2>
              <Badge className="bg-primary/15 text-primary">Active</Badge>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); entryMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumberInput" className="text-xs font-semibold tracking-widest uppercase">Plate Number</Label>
                <Input id="plateNumberInput" placeholder="e.g. ABC-1234" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value.toUpperCase())} className="h-12 bg-secondary/60" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reservationIDInput" className="text-xs font-semibold tracking-widest uppercase">Reservation ID</Label>
                <Input id="reservationIDInput" placeholder="Reservation UUID from booking" value={reservationID} onChange={(e) => setReservationID(e.target.value)} className="h-12 bg-secondary/60" required />
              </div>
              {entryError && <p className="text-destructive text-sm font-semibold">{entryError}</p>}
              {lastEntryId && (
                <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">
                  <div className="font-semibold">Entry approved</div>
                  <div className="mt-1 break-all">Entry ID for exit: {lastEntryId}</div>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setEntryId(lastEntryId)}>Use for Exit</Button>
                </div>
              )}
              <Button type="submit" className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground" disabled={entryMutation.isPending}>
                {entryMutation.isPending ? "Verifying..." : "Verify Entry"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold flex items-center gap-2"><LogOut className="h-5 w-5" /> Exit Verification</h2>
              <Badge variant="outline">Consumes Entry ID</Badge>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); exitMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="entryIdInput" className="text-xs font-semibold tracking-widest uppercase">Entry ID</Label>
                <Input id="entryIdInput" placeholder="Entry UUID issued at entry" value={entryId} onChange={(e) => setEntryId(e.target.value)} className="h-12 bg-secondary/60" required />
              </div>
              {exitError && <p className="text-destructive text-sm font-semibold">{exitError}</p>}
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={exitMutation.isPending}>
                {exitMutation.isPending ? "Processing..." : "Process Exit"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold flex items-center gap-2"><ReceiptText className="h-5 w-5" /> Receipt Check</h2>
              <Badge variant="outline">Receipt Number</Badge>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); receiptMutation.mutate(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiptNumberInput" className="text-xs font-semibold tracking-widest uppercase">Receipt Number</Label>
                <Input id="receiptNumberInput" placeholder="REC-12345678" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())} className="h-12 bg-secondary/60" />
              </div>
              {receiptStatus && <p className="text-sm font-semibold">{receiptStatus}</p>}
              <Button type="submit" variant="outline" className="w-full h-12" disabled={receiptMutation.isPending}>
                {receiptMutation.isPending ? "Checking..." : "Check Receipt"}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="font-bold flex items-center gap-2 mb-5"><Car className="h-5 w-5" /> Gate Session</h2>
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-lg bg-primary/10 p-4">
                <div className="text-xs text-muted-foreground">Mode</div>
                <div className="text-2xl font-bold mt-1">Live</div>
                <div className="h-1.5 mt-3 bg-muted rounded overflow-hidden"><div className="h-full bg-primary" style={{ width: "92%" }} /></div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="text-xs text-muted-foreground">Decision</div>
                <div className="mt-2 flex gap-2">
                  <Button size="sm"><Check className="h-4 w-4 mr-1" /> Confirm</Button>
                  <Button size="sm" variant="destructive"><X className="h-4 w-4 mr-1" /> Deny</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Entry IDs</h3>
              <span className="text-xs text-muted-foreground">Click Exit to fill form</span>
            </div>
            <div className="space-y-3">
              {entriesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                ))
              ) : entriesError ? (
                <p className="text-sm text-destructive font-semibold">Failed to load activity log.</p>
              ) : sortedEntries.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No recent entry activity.</p>
              ) : (
                sortedEntries.map((entry) => (
                  <div key={entry.entryId} className="flex items-center gap-3 rounded-md border p-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center"><LogIn className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{entry.vehicle?.plateNumber || "N/A"} · {entry.reservation?.parkingSpot?.spotId || "N/A"}</div>
                      <div className="text-xs text-muted-foreground truncate">Entry ID: {entry.entryId} · {formatRelativeTime(entry.entryTime)}</div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEntryId(entry.entryId)}>Exit</Button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
