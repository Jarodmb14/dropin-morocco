import { useEffect } from 'react';
import { DropInAPI } from '@/lib/api';
import { useQRCodes } from '@/lib/hooks/useApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { QrCode, Hourglass, CheckCircle2 } from 'lucide-react';

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    ACTIVE: 'default',
    USED: 'secondary',
    EXPIRED: 'outline',
    CANCELLED: 'outline',
  };
  const Icon = status === 'ACTIVE' ? QrCode : status === 'USED' ? CheckCircle2 : Hourglass;
  return (
    <Badge variant={(map[status] as any) || 'secondary'} className="flex items-center gap-1">
      <Icon className="h-3.5 w-3.5" /> {status}
    </Badge>
  );
};

const MyQRCodes = () => {
  const { qrCodes, loading, error, refetch } = useQRCodes();

  useEffect(() => {
    DropInAPI.init();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2"><QrCode className="h-6 w-6" /> My QR Codes</h1>
          <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
        </div>

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

        {!loading && qrCodes.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No active QR codes. Complete a booking to get one.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {qrCodes.map((qr: any) => (
            <Card key={qr.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">{qr.product?.name || 'Pass'}</CardTitle>
                <StatusPill status={qr.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs text-muted-foreground break-all">
                  {qr.code}
                </div>
                {qr.expires_at && (
                  <div className="text-xs text-muted-foreground">
                    Expires: {new Date(qr.expires_at).toLocaleString()}
                  </div>
                )}
                {/* Placeholder for QR image; in production use a proper QR lib */}
                <div className="bg-white rounded-md border p-6 text-center text-xs text-muted-foreground">
                  Present this code at check-in.
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyQRCodes;


