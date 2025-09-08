import QRCode from 'qrcode';

export interface QRCodeData {
  bookingId: string;
  userId: string;
  clubId: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
  timestamp: string;
}

export class QRCodeGenerator {
  /**
   * Generate QR code data for a booking
   */
  static generateBookingQRData(booking: any): QRCodeData {
    return {
      bookingId: booking.id || booking.booking_id,
      userId: booking.user_id,
      clubId: booking.club_id,
      scheduledStart: booking.scheduled_start,
      scheduledEnd: booking.scheduled_end,
      status: booking.status || 'CONFIRMED',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate QR code as data URL (for display in img tag)
   */
  static async generateQRCodeDataURL(data: QRCodeData): Promise<string> {
    try {
      const qrData = JSON.stringify(data);
      const dataURL = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      return dataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG string
   */
  static async generateQRCodeSVG(data: QRCodeData): Promise<string> {
    try {
      const qrData = JSON.stringify(data);
      const svg = await QRCode.toString(qrData, {
        type: 'svg',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      return svg;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  /**
   * Generate QR code for a booking and return data URL
   */
  static async generateBookingQRCode(booking: any): Promise<string> {
    const qrData = this.generateBookingQRData(booking);
    return await this.generateQRCodeDataURL(qrData);
  }

  /**
   * Validate QR code data
   */
  static validateQRCodeData(data: any): boolean {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      return !!(
        parsed.bookingId &&
        parsed.userId &&
        parsed.clubId &&
        parsed.scheduledStart &&
        parsed.scheduledEnd &&
        parsed.status &&
        parsed.timestamp
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse QR code data from string
   */
  static parseQRCodeData(qrString: string): QRCodeData | null {
    try {
      // Check if the string is empty or invalid
      if (!qrString || typeof qrString !== 'string') {
        console.error('Invalid QR string:', qrString);
        return null;
      }

      // Try to parse as JSON
      const data = JSON.parse(qrString);
      
      // Validate the parsed data
      if (this.validateQRCodeData(data)) {
        return data as QRCodeData;
      }
      
      console.error('QR data validation failed:', data);
      return null;
    } catch (error) {
      console.error('QR code parsing error:', error, 'QR string:', qrString);
      return null;
    }
  }

  /**
   * Check if QR code is still valid (not expired)
   */
  static isQRCodeValid(qrData: QRCodeData): boolean {
    const now = new Date();
    const scheduledStart = new Date(qrData.scheduledStart);
    const scheduledEnd = new Date(qrData.scheduledEnd);
    
    // QR code is valid if current time is within the booking window
    return now >= scheduledStart && now <= scheduledEnd;
  }

  /**
   * Download QR code as PNG file
   */
  static async downloadQRCodePNG(booking: any, filename?: string): Promise<void> {
    try {
      const qrData = this.generateBookingQRData(booking);
      const dataURL = await this.generateQRCodeDataURL(qrData);
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename || `booking-${qrData.bookingId.slice(0, 8)}-qr.png`;
      link.href = dataURL;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      throw new Error('Failed to download QR code');
    }
  }

  /**
   * Download QR code as SVG file
   */
  static async downloadQRCodeSVG(booking: any, filename?: string): Promise<void> {
    try {
      const qrData = this.generateBookingQRData(booking);
      const svg = await this.generateQRCodeSVG(qrData);
      
      // Create download link
      const link = document.createElement('a');
      link.download = filename || `booking-${qrData.bookingId.slice(0, 8)}-qr.svg`;
      link.href = 'data:image/svg+xml;base64,' + btoa(svg);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code SVG:', error);
      throw new Error('Failed to download QR code SVG');
    }
  }

  /**
   * Generate QR code with custom styling
   */
  static async generateStyledQRCode(booking: any, options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
    logo?: string;
  }): Promise<string> {
    try {
      const qrData = this.generateBookingQRData(booking);
      const qrString = JSON.stringify(qrData);
      
      const defaultOptions = {
        width: 300,
        margin: 3,
        darkColor: '#000000',
        lightColor: '#FFFFFF',
        errorCorrectionLevel: 'M' as const
      };
      
      const finalOptions = { ...defaultOptions, ...options };
      
      const dataURL = await QRCode.toDataURL(qrString, finalOptions);
      return dataURL;
    } catch (error) {
      console.error('Error generating styled QR code:', error);
      throw new Error('Failed to generate styled QR code');
    }
  }

  /**
   * Generate a unique QR code string for a booking
   */
  static generateQRCodeString(booking: any): string {
    const qrData = this.generateBookingQRData(booking);
    return JSON.stringify(qrData);
  }
}
