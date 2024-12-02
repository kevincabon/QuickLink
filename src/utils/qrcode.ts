import QRCode from 'qrcode';
import type { QRCodeOptions } from '../types';

export async function generateQRCode(url: string, options: QRCodeOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: options.width,
      margin: 1, // Réduction significative des marges
      color: {
        dark: options.color,
        light: options.backgroundColor,
      },
      errorCorrectionLevel: 'H',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}