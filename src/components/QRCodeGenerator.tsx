import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QRCodeGenerator = () => {
  const [qrText, setQrText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!qrText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to generate QR code",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(qrText, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
      toast({
        title: "Success",
        description: "QR code generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Downloaded",
      description: "QR code saved to your device",
    });
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          text: qrText,
          files: [file]
        });
        toast({
          title: "Shared",
          description: "QR code shared successfully",
        });
      } else {
        // Fallback to clipboard if available
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(qrText);
          toast({
            title: "Copied",
            description: "QR code text copied to clipboard",
          });
        } else {
          toast({
            title: "Share not available",
            description: "Sharing is not supported on this device",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share QR code",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <QrCode className="h-8 w-8 text-primary" />
            QR Code Generator
          </h2>
          <p className="text-muted-foreground">
            Generate QR codes for gym access, membership, or any text
          </p>
        </div>

        <Card className="p-6">
          <CardHeader>
            <CardTitle>Create QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="qr-text">Enter text or URL</Label>
              <Input
                id="qr-text"
                type="text"
                placeholder="e.g., https://drop-in.ma/membership/123 or membership ID"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              onClick={generateQRCode}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </Button>

            {qrCodeUrl && (
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="Generated QR Code" 
                    className="mx-auto border rounded-lg shadow-md"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="flex items-center gap-2 flex-1"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={shareQRCode}
                    variant="outline"
                    className="flex items-center gap-2 flex-1"
                  >
                    <Share className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QRCodeGenerator;