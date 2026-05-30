import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllReceipts, verifyReceiptNumber, Receipt } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Car, RefreshCw, ReceiptText, Download, Eye, Calendar, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/app/receipts")({
  component: Receipts,
});

function Receipts() {
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [genError, setGenError] = useState<string | null>(null);

  const { data: receipts, isLoading, isError, refetch } = useQuery({
    queryKey: ["receipts"],
    queryFn: getAllReceipts,
  });

  useEffect(() => {
    if (receipts && receipts.length > 0 && !selectedReceipt) {
      setSelectedReceipt(receipts[0]);
    }
  }, [receipts, selectedReceipt]);

  const generateMutation = useMutation({
    mutationFn: async (number: string) => {
      setGenError(null);
      return await verifyReceiptNumber(number);
    },
    onSuccess: (result) => {
      toast.success(result.message || "Receipt is valid.");
      if (result.receipt) setSelectedReceipt(result.receipt);
      setReceiptNumber("");
      setDialogOpen(false);
    },
    onError: (err: any) => {
      setGenError(err.message || "Receipt was not found.");
    },
  });

  const totalRevenueSum = receipts ? receipts.reduce((sum, r) => sum + r.totalAmount, 0) : 0;
  const receiptsCount = receipts ? receipts.length : 0;

  return (
    <AppLayout searchPlaceholder="Search transactions or plate numbers...">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Receipt Generation</h1>
          <p className="text-muted-foreground mt-1">Process and manage parking transaction invoices.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" /> Sync Transactions</Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sidebar hover:bg-sidebar/90 text-sidebar-foreground">
                <ReceiptText className="h-4 w-4 mr-2" /> Check Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Check Receipt Number</DialogTitle>
                <DialogDescription>
                  Receipts are generated automatically when a reservation is paid. Enter a receipt number to verify it.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!receiptNumber.trim()) return;
                  generateMutation.mutate(receiptNumber);
                }}
                className="space-y-4 py-4"
              >
                <div className="space-y-2">
                  <label htmlFor="receiptNumberInput" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Receipt Number</label>
                  <Input
                    id="receiptNumberInput"
                    placeholder="REC-12345678"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                {genError && <p className="text-destructive text-sm font-semibold">{genError}</p>}
                <DialogFooter>
                  <Button type="submit" disabled={generateMutation.isPending}>
                    {generateMutation.isPending ? "Checking..." : "Check"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Side: Invoice Preview */}
        <Card className="p-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive font-semibold">Failed to load invoice preview.</p>
          ) : selectedReceipt ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  <div>
                    <div className="text-xs text-muted-foreground">RECEIPT ID: {selectedReceipt.receiptId}</div>
                    <div className="text-xl font-bold">Invoice Preview</div>
                  </div>
                </div>
                <Badge className="bg-primary/15 text-primary">PAID</Badge>
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/30">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Receipt Number</div>
                <div className="text-5xl font-bold mt-2">{selectedReceipt.receiptNumber}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Customer / Plate</div>
                  <div className="font-semibold mt-1">
                    {selectedReceipt.payment?.reservation?.customer?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase">Issue Date</div>
                  <div className="font-semibold mt-1">
                    {new Date(selectedReceipt.issueDate).toLocaleDateString()} {new Date(selectedReceipt.issueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground uppercase">Payment Method</div>
                  <div className="font-semibold mt-1">{selectedReceipt.payment?.paymentMethod || "N/A"}</div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground uppercase">Reservation ID</div>
                  <div className="font-semibold mt-1">
                    {selectedReceipt.payment?.reservation?.reservationId?.substring(0, 8) || "N/A"}
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-5 mt-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold">Amount Paid</div>
                  <div className="text-xs text-muted-foreground">Includes 5% city tax</div>
                </div>
                <div className="text-4xl font-bold">${selectedReceipt.totalAmount.toFixed(2)}</div>
              </div>

              <Button variant="outline" className="w-full mt-5 h-11"><Download className="h-4 w-4 mr-2" /> Download PDF Receipt</Button>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">No receipts generated yet.</p>
          )}
          <p className="text-xs italic text-center text-muted-foreground mt-3">Generated by ParkCar City Management Engine v4.2</p>
        </Card>

        {/* Right Side: Filters, Table, Stats */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-card border rounded-lg px-4 py-3 text-sm flex items-center justify-between"><span>All Parking Lots</span><ChevronDown className="h-4 w-4" /></button>
            <button className="bg-card border rounded-lg px-4 py-3 text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Last 24 Hours</button>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Transaction History</h2>
              <button className="text-sm font-medium text-primary hover:underline">View All Records</button>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : isError ? (
                <p className="text-sm text-destructive font-semibold">Failed to load transaction history.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                      <th className="pb-3 font-medium">Transaction ID</th>
                      <th className="pb-3 font-medium">Plate / Customer</th>
                      <th className="pb-3 font-medium">Duration</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts?.map((t) => (
                      <tr key={t.receiptId} className="border-b last:border-0 cursor-pointer hover:bg-muted/30" onClick={() => setSelectedReceipt(t)}>
                        <td className="py-4 font-semibold">{t.receiptNumber}</td>
                        <td className="py-4">
                          <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">
                            {t.payment?.reservation?.customer?.name || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 text-muted-foreground">—</td>
                        <td className="py-4 font-bold">${t.totalAmount.toFixed(2)}</td>
                        <td className="py-4">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(t);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {receiptsCount === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">No transactions available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5 bg-primary/10">
              <div className="text-xs text-muted-foreground">TOTAL REVENUE (TODAY)</div>
              <div className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-7 w-20" /> : `$${totalRevenueSum.toFixed(2)}`}
              </div>
              <div className="text-xs text-primary mt-1">↗ 12% vs yesterday</div>
            </Card>
            <Card className="p-5 bg-sidebar text-sidebar-foreground">
              <div className="text-xs text-sidebar-foreground/60">RECEIPTS ISSUED</div>
              <div className="text-2xl font-bold mt-1">
                {isLoading ? <Skeleton className="h-7 w-12" /> : receiptsCount}
              </div>
              <div className="text-xs text-sidebar-foreground/70 mt-1">✓ All verified today</div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
