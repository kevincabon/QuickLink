export interface ShortLink {
  id: string;
  original_url: string;
  short_url: string;
  qr_code_url: string;
  usage_count: number;
  created_at: string;
  custom_path?: string;
  expires_at?: string;
}

export interface QRCodeOptions {
  color: string;
  backgroundColor: string;
  width: number;
  height: number;
}