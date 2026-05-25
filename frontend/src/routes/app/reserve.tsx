import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Car, Plus, Clock, CreditCard, Check, Accessibility, Zap, ArrowRight, Info } from "lucide-react";

export const Route = createFileRoute("/app/reserve")({
  component: Reserve,
});

const sectionA = ["A-101", "A-102", "A-103", "A-104", "A-105", "A-106"];
const sectionB = ["B-201", "B-202", "B-203", "B-204", "B-205", "B-206"];
const occupied = new Set(["A-102", "A-105", "B-201", "B-204", "B-206"]);

function Spot({ id, selected, onSelect }: { id: string; selected: boolean; onSelect: () => void }) {
  const isOcc = occupied.has(id);
  return (
    <button
      disabled={isOcc}
      onClick={onSelect}
      className={`aspect-[3/4] rounded-xl border-2 flex flex-col items-center justify-center text-sm font-semibold transition ${
        selected
          ? "bg-primary/10 border-foreground ring-2 ring-foreground"
          : isOcc
          ? "bg-muted border-muted text-muted-foreground cursor-not-allowed"
          : "bg-primary/10 border-primary/40 text-foreground hover:border-primary"
      }`}
    >
      {id}
      {selected && <span className="text-[10px] uppercase tracking-wider mt-1">Selected</span>}
      {isOcc && <Car className="h-4 w-4 mt-1" />}
    </button>
  );
}

function Reserve() {
  const [selected, setSelected] = useState("A-104");
  const [duration, setDuration] = useState(4);
  const rate = 4;
  const subtotal = rate * duration;
  const fee = 1.5;

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
                  <button key={l} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${i === 0 ? "bg-sidebar text-sidebar-foreground" : "text-muted-foreground hover:bg-muted"}`}>{l}</button>
                ))}
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  <span>Section A</span><span>Driveway</span>
                </div>
                <div className="border-t border-dashed mb-3" />
                <div className="grid grid-cols-6 gap-3">
                  {sectionA.map((id) => <Spot key={id} id={id} selected={selected === id} onSelect={() => setSelected(id)} />)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Section B</div>
                <div className="border-t border-dashed mb-3" />
                <div className="grid grid-cols-6 gap-3">
                  {sectionB.map((id) => <Spot key={id} id={id} selected={selected === id} onSelect={() => setSelected(id)} />)}
                </div>
              </div>
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
              <p className="text-sm text-sidebar-foreground/70 mt-1">Selected Spot: {selected}</p>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Parking Duration</div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 8, 24].map((h) => (
                    <button key={h} onClick={() => setDuration(h)} className={`py-2 rounded-md text-sm font-semibold border-2 ${duration === h ? "border-foreground" : "border-border hover:border-foreground/40"}`}>{h}h</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Reservation Start</div>
                <div className="flex items-center gap-2 border rounded-md px-3 py-2.5 text-sm"><Clock className="h-4 w-4 text-muted-foreground" /> Today, 02:30 PM</div>
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
                <button className="w-full mt-2 border-2 border-dashed rounded-md py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/40 flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add New Payment</button>
              </div>

              <div className="pt-3 border-t space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Rate ($4.00 / hour)</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Service Fee</span><span>${fee.toFixed(2)}</span></div>
                <div className="flex justify-between text-xl font-bold pt-2"><span>Total Amount</span><span>${(subtotal + fee).toFixed(2)}</span></div>
              </div>

              <Button className="w-full h-12 bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground">Pay and Reserve <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <p className="text-xs text-center text-muted-foreground">A confirmation and QR gate pass will be sent to your email.</p>
            </div>
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
