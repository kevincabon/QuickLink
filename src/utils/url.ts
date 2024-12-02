import { supabase } from '../config/supabase';
import { environment } from '../config/environment';
import type { ShortLink } from '../types';

export async function shortenUrl(
  originalUrl: string,
  customPath?: string,
  expiresInHours?: number
): Promise<ShortLink> {
  try {
    const shortId = customPath || generateShortId();
    const shortUrl = `${environment.baseUrl}/${shortId}`;

    // Vérifier si le custom path est déjà utilisé et n'est pas expiré
    if (customPath) {
      const { data: existingUrl } = await supabase
        .from('short_links')
        .select('id, expires_at')
        .eq('short_url', shortUrl)
        .single();

      if (existingUrl) {
        // Vérifier si l'URL existante n'est pas expirée
        const isExpired = existingUrl.expires_at && new Date(existingUrl.expires_at) < new Date();
        
        if (!isExpired) {
          throw new Error('This custom URL is already taken');
        } else {
          // Si l'URL est expirée, on la supprime pour pouvoir la réutiliser
          await supabase
            .from('short_links')
            .delete()
            .eq('id', existingUrl.id);
        }
      }
    }

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
          custom_path: customPath,
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