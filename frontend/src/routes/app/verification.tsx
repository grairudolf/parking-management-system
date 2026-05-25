import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Car, Hourglass, Check, X, Camera, LogIn, LogOut, Pencil } from "lucide-react";

export const Route = createFileRoute("/app/verification")({
  component: Verification,
});

function Verification() {
  return (
    <AppLayout searchPlaceholder="Search plates or bookings...">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Checkpoint Verification</h1>
        <p className="text-muted-foreground mt-1">Process vehicle entry and exit with smart license plate recognition and QR validation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold flex items-center gap-2"><QrCode className="h-5 w-5" /> QR Code Scanner</h2>
            <Badge className="bg-primary/15 text-primary">● ACTIVE</Badge>
          </div>
          <div className="bg-black rounded-lg aspect-[4/5] relative overflow-hidden flex items-center justify-center">
            <div className="h-1/2 w-2/3 border-2 border-primary rounded-lg relative">
              <span className="absolute -top-1 -left-1 h-4 w-4 border-t-4 border-l-4 border-primary" />
              <span className="absolute -top-1 -right-1 h-4 w-4 border-t-4 border-r-4 border-primary" />
              <span className="absolute -bottom-1 -left-1 h-4 w-4 border-b-4 border-l-4 border-primary" />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 border-b-4 border-r-4 border-primary" />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">Align digital pass or printed QR code within the frame</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground"><Camera className="h-4 w-4 mr-2" /> Retake</Button>
            <Button variant="outline">Manual Entry</Button>
          </div>
        </Card>

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
                    <button className="text-muted-foreground"><Pencil className="h-3.5 w-3.5" /></button>
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
              <button className="text-sm font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center"><LogIn className="h-4 w-4" /></div>
                <div className="flex-1"><div className="font-semibold text-sm">XYZ-1234</div><div className="text-xs text-muted-foreground">Entry Approved · 2 mins ago</div></div>
                <Badge className="bg-primary/15 text-primary">SUCCESS</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"><LogOut className="h-4 w-4" /></div>
                <div className="flex-1"><div className="font-semibold text-sm">KLT-5590</div><div className="text-xs text-muted-foreground">Exit Denied: Unpaid Balance · 15 mins ago</div></div>
                <Badge variant="destructive">FAILED</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
