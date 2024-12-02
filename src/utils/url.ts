import { supabase } from '../config/supabase';
import { environment } from '../config/environment';
import type { ShortLink } from '../types';

export async function shortenUrl(
  originalUrl: string,
  customPath?: string,
  expiresInHours?: number
): Promise<ShortLink> {
  try {
    if (customPath) {
      const shortId = customPath;
      const shortUrl = `${environment.baseUrl}/${shortId}`;

      const { data: existingUrl } = await supabase
        .from('short_links')
        .select('id, expires_at')
        .eq('short_url', shortUrl)
        .single();

      if (existingUrl) {
        throw new Error('This custom URL is already taken');
      }
    } else {
      // Pour les URLs non-custom, chercher d'abord un lien existant sans expiration
      const { data: existingLinks } = await supabase
        .from('short_links')
        .select('*')
        .eq('original_url', originalUrl)
        .eq('custom_path', '') // Cherche les liens avec custom_path vide
        .is('expires_at', null);

      // S'il existe un lien sans expiration, on le réutilise
      if (existingLinks && existingLinks.length > 0) {
        return existingLinks[0];
      }
    }

    const shortId = customPath || generateShortId();
    const shortUrl = `${environment.baseUrl}/${shortId}`;

    // Calculer la date d'expiration si nécessaire
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      : null;

    const { data, error } = await supabase
      .from('short_links')
      .insert([
        {
          original_url: originalUrl,
          short_url: shortUrl,
          custom_path: customPath || '', // S'assurer que custom_path est une chaîne vide si non défini
          expires_at: expiresAt,
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