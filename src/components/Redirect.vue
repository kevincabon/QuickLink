<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../config/supabase';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const shortCode = route.params.shortCode as string;
  const fullShortUrl = `${window.location.origin}/${shortCode}`;
  
  try {
    // Récupérer l'URL originale
    const { data, error } = await supabase
      .from('short_links')
      .select('id, original_url, usage_count')
      .eq('short_url', fullShortUrl)
      .single();

    if (error) throw error;
    
    if (data?.original_url) {
      // Incrémenter le compteur d'utilisation
      const newCount = (data.usage_count || 0) + 1;
      await supabase
        .from('short_links')
        .update({ usage_count: newCount })
        .eq('id', data.id);

      // Rediriger vers l'URL originale
      window.location.href = data.original_url;
    } else {
      router.push('/');
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    router.push('/');
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
    </div>
  </div>
</template>
