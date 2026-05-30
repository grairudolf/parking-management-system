import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { getAllSpots, createReservation, getAllReservations, processPayment } from "@/lib/api";
import { Map, Car, Plus, Clock, CreditCard, Check, Accessibility, Zap, ArrowRight, Info } from "lucide-react";

export const Route = createFileRoute("/app/reserve")({
  component: Reserve,
});

function Spot({ id, occupied, selected, onSelect }: { id: string; occupied: boolean; selected: boolean; onSelect: () => void }) {
  return (
    <button
      disabled={occupied}
      onClick={onSelect}
      type="button"
      className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center text-sm font-semibold transition ${
        selected
          ? "bg-primary/10 border-foreground ring-2 ring-foreground"
          : occupied
          ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
          : "bg-primary/10 border-primary/40 text-foreground hover:border-primary"
      }`}
    >
      {id}
      {selected && <span className="text-[10px] uppercase tracking-wider mt-1">Selected</span>}
      {occupied && <Car className="h-4 w-4 mt-1" />}
    </button>
  );
}

function Reserve() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  const { data: spots, isLoading: spotsLoading, isError: spotsError } = useQuery({
    queryKey: ["spots"],
    queryFn: getAllSpots,
  });

  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [duration, setDuration] = useState(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [time, setTime] = useState(() => {
    const hour = String(new Date().getHours()).padStart(2, "0");
    return `${hour}:00`;
  });

  // Select first available spot by default if none selected
  useEffect(() => {
    if (spots && spots.length > 0 && !selectedSpotId) {
      const firstAvailable = spots.find(s => !s.occupied);
      if (firstAvailable) {
        setSelectedSpotId(firstAvailable.spotId);
      } else {
        setSelectedSpotId(spots[0].spotId);
      }
    }
  }, [spots, selectedSpotId]);

  const rate = 4;
  const subtotal = rate * duration;
  const fee = 1.5;
  const totalAmount = subtotal + fee;

  const hoursList = Array.from({ length: 24 }).map((_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  const sectionA = spots ? spots.filter(s => s.spotId.startsWith("A") || s.spotId.startsWith("1")) : [];
  const sectionB = spots ? spots.filter(s => !s.spotId.startsWith("A") && !s.spotId.startsWith("1")) : [];

  const reservationMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated.");
      if (!selectedSpotId) throw new Error("Please select a spot.");

      // 1. Create reservation
      const res = await createReservation(user.customerId, selectedSpotId, date, time);
      if (res.message && res.message.startsWith("Error:")) {
        throw new Error(res.message);
      }

      // 2. Fetch reservations to find the most recent confirmed one
      const allRes = await getAllReservations();
      const userRes = allRes.filter(
        r =>
          r.customer?.customerId === user.customerId &&
          r.parkingSpot?.spotId === selectedSpotId &&
          r.status === "Confirmed"
      );

      if (userRes.length === 0) {
        throw new Error("Reservation created but could not retrieve confirmation details.");
      }

      // Sort by date/time descending to get the absolute newest
      const latestRes = userRes.sort((a, b) => {
        const dtA = new Date(`${a.reservationDate}T${a.reservationTime}`).getTime();
        const dtB = new Date(`${b.reservationDate}T${b.reservationTime}`).getTime();
        return dtB - dtA;
      })[0];

      // 3. Process payment
      await processPayment(latestRes.reservationId, "Card", totalAmount);
    },
    onSuccess: () => {
      toast.success("Reservation confirmed and payment processed!");
      queryClient.invalidateQueries({ queryKey: ["spots"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      setSelectedSpotId("");
    },
    onError: (error: any) => {
      toast.error(error.message || "Reservation failed.");
    },
  });

  return (
    <AppLayout searchPlaceholder="Search facilities, lot IDs...">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Reserve Spot</h1>
          <p className="text-muted-foreground mt-2">Real-time occupancy management for Level 2 - North Wing</p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="flex items-center gap-2 text-sm bg-card border rounded-full px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Available</span>
          <span className="flex items-center gap-2 text-sm bg-card border rounded-full px-3 py-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Occupied</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><Map className="h-5 w-5" /> Floor Map</h2>
              <div className="flex gap-1">
                {["L2", "L3", "L4"].map((l, i) => (
                  <button key={l} type="button" className={`px-4 py-1.5 rounded-md text-sm font-semibold ${i === 0 ? "bg-sidebar text-sidebar-foreground" : "text-muted-foreground hover:bg-muted"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-6 space-y-6">
              {spotsLoading ? (
                <div className="grid grid-cols-6 gap-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
                  ))}
                </div>
              ) : spotsError ? (
                <p className="text-sm text-destructive font-semibold">Failed to load parking spots.</p>
              ) : spots?.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No spots configured yet.</p>
              ) : (
                <>
                  {sectionA.length > 0 && (
                    <div>
                      <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-3">
                        <span>Section A</span><span>Driveway</span>
                      </div>
                      <div className="border-t border-dashed mb-3" />
                      <div className="grid grid-cols-6 gap-3">
                        {sectionA.map((s) => (
                          <Spot
                            key={s.spotId}
                            id={s.spotId}
                            occupied={s.occupied}
                            selected={selectedSpotId === s.spotId}
                            onSelect={() => setSelectedSpotId(s.spotId)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {sectionB.length > 0 && (
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Section B</div>
                      <div className="border-t border-dashed mb-3" />
                      <div className="grid grid-cols-6 gap-3">
                        {sectionB.map((s) => (
                          <Spot
                            key={s.spotId}
                            id={s.spotId}
                            occupied={s.occupied}
                            selected={selectedSpotId === s.spotId}
                            onSelect={() => setSelectedSpotId(s.spotId)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-5">
            <Card className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><Zap className="h-5 w-5 text-primary" /></div>
              <div>
                <div className="text-xs text-muted-foreground">EV Charging Available</div>
                <div className="text-lg font-bold">8 Spots</div>
              </div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center"><Accessibility className="h-5 w-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground">Handicap Accessible</div>
                <div className="text-lg font-bold">4 Spots</div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-0 overflow-hidden">
            <div className="bg-sidebar text-sidebar-foreground p-5">
              <h3 className="text-lg font-bold">Booking Details</h3>
              <p className="text-sm text-sidebar-foreground/70 mt-1">Selected Spot: {selectedSpotId || "None"}</p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                reservationMutation.mutate();
              }}
              className="p-5 space-y-5"
            >
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Parking Duration</div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 8, 24].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setDuration(h)}
                      className={`py-2 rounded-md text-sm font-semibold border-2 ${duration === h ? "border-foreground" : "border-border hover:border-foreground/40"}`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Reservation Date</div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full flex items-center gap-2 border rounded-md px-3 py-2.5 text-sm bg-background"
                  required
                />
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Reservation Time</div>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full flex items-center gap-2 border rounded-md px-3 py-2.5 text-sm bg-background"
                  required
                >
                  {hoursList.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Payment Method</div>
                <div className="border-2 border-foreground rounded-md p-3 flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Visa Ending in 8842</div>
                    <div className="text-xs text-muted-foreground">Expires 09/26</div>
                  </div>
                  <Check className="h-4 w-4" />
                </div>
                <button type="button" className="w-full mt-2 border-2 border-dashed rounded-md py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/40 flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add New Payment</button>
              </div>

              <div className="pt-3 border-t space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Rate ($4.00 / hour)</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service Fee</span><span>${fee.toFixed(2)}</span></div>
                <div className="flex justify-between text-xl font-bold pt-2"><span>Total Amount</span><span>${totalAmount.toFixed(2)}</span></div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"
                disabled={reservationMutation.isPending}
              >
                {reservationMutation.isPending ? "Processing..." : "Pay and Reserve"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">A confirmation and QR gate pass will be sent to your email.</p>
            </form>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 flex gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <div className="font-semibold text-sm">Cancellation Policy</div>
              <div className="text-xs text-muted-foreground mt-1">Cancel up to 1 hour before start time for a full refund.</div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
