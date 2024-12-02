import { supabase } from '../config/supabase';
import { environment } from '../config/environment';
import type { ShortLink } from '../types';

export async function shortenUrl(originalUrl: string): Promise<ShortLink> {
  try {
    const shortId = generateShortId();
    const shortUrl = `${environment.baseUrl}/${shortId}`;

    const { data, error } = await supabase
      .from('short_links')
      .insert([
        {
          original_url: originalUrl,
          short_url: shortUrl,
          usage_count: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    throw error;
  }
}

function generateShortId(length = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}