import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  qrData: {
    id: string;
    code: string;
    product_name: string;
    club_name: string;
    status: string;
    expires_at: string;
    uses_count: number;
    max_uses: number;
  };
  size?: number;
}

const QRCodeGenerator = ({ qrData, size = 200 }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current && qrData.code) {
      generateQRCode();
    }
  }, [qrData.code]);

  const generateQRCode = async () => {
    try {
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, qrData.code, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF"
          },
          errorCorrectionLevel: 'M'
        });
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = async () => {
    try {
      if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `qr-code-${qrData.id}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const copyQRCodeData = async () => {
    try {
      await navigator.clipboard.writeText(qrData.code);
      toast({
        title: "Copied!",
        description: "QR code data copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code data",
        variant: "destructive",
      });
    }
  };

  const shareQRCode = async () => {
    try {
      if (navigator.share && canvasRef.current) {
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => {
            resolve(blob!);
          });
        });
        
        const file = new File([blob], `qr-code-${qrData.id}.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `QR Code - ${qrData.product_name}`,
          text: `Access code for ${qrData.club_name}`,
          files: [file]
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        copyQRCodeData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share QR code",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'USED':
        return 'secondary';
      case 'EXPIRED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">QR Code</CardTitle>
        <CardDescription>
          {qrData.product_name} - {qrData.club_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-200 rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">DI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Info */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <Badge variant={getStatusColor(qrData.status)}>
              {qrData.status}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Uses:</span>
            <span className="font-medium">
              {qrData.uses_count}/{qrData.max_uses}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Expires:</span>
            <span className="font-medium text-xs">
              {formatDate(qrData.expires_at)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={downloadQRCode}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={shareQRCode}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button
            onClick={copyQRCodeData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>

        {/* QR Code Data (Hidden by default, can be shown for debugging) */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
            Show QR Code Data
          </summary>
          <div className="mt-2 p-2 bg-gray-50 rounded font-mono text-xs break-all">
            {qrData.code}
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
