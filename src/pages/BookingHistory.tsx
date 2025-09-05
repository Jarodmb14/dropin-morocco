import { useEffect, useMemo, useState } from 'react';
import { DropInAPI } from '@/lib/api';
import { useOrders, useQRCodes } from '@/lib/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, Clock, CreditCard, QrCode, Ticket, XCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: string }) => {
  const variant = status === 'PAID' ? 'default' : status === 'PENDING' ? 'secondary' : 'outline';
  const Icon = status === 'PAID' ? CheckCircle2 : status === 'PENDING' ? Clock : XCircle;
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3.5 w-3.5" /> {status}
    </Badge>
  );
};

const BookingHistory = () => {
  const { orders, loading, error, refetch } = useOrders();
  const { qrCodes } = useQRCodes();
  const [tab, setTab] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    DropInAPI.init();
  }, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return orders;
    return orders.filter((o: any) => o.status === (tab === 'pending' ? 'PENDING' : 'PAID'));
  }, [orders, tab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="space-y-4">
            {loading && (
              <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {error && (
              <Card>
                <CardContent className="p-4 text-sm text-red-600">{error}</CardContent>
              </Card>
            )}

            {!loading && filtered.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No bookings yet.
                </CardContent>
              </Card>
            )}

            {filtered.map((order: any) => {
              const items = order.order_items || [];
              const orderQRCodes = (qrCodes || []).filter((q: any) => q.order_id === order.id);
              return (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Ticket className="h-4 w-4" /> Order #{order.id.slice(-6)}
                    </CardTitle>
                    <StatusBadge status={order.status} />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(order.created_at).toLocaleString()}
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="font-medium mb-2">Items</div>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        {items.map((it: any) => (
                          <li key={it.id}>{it.product_name || it.product_id} × {it.quantity}</li>
                        ))}
                      </ul>
                    </div>
                    {order.status === 'PENDING' && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <CreditCard className="h-4 w-4" /> Awaiting payment
                        </div>
                        <Button size="sm" onClick={() => DropInAPI.payments.processCardPayment(order.id, 'pm_mock_visa').then(() => refetch())}>Pay Now</Button>
                      </div>
                    )}

                    {order.status === 'PAID' && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <QrCode className="h-4 w-4" /> QR Codes
                        </div>
                        {orderQRCodes.length === 0 ? (
                          <div className="text-sm text-muted-foreground">Generating QR codes...</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {orderQRCodes.map((qr: any) => (
                              <div key={qr.id} className="border rounded-md p-3 text-xs break-all">
                                {qr.code}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookingHistory;


