<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { supabase } from '../config/supabase';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const error = ref<string | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  const shortCode = route.params.shortCode as string;
  const fullShortUrl = `${window.location.origin}/${shortCode}`;
  
  try {
    // Récupérer l'URL originale
    const { data, error: dbError } = await supabase
      .from('short_links')
      .select('id, original_url, usage_count, expires_at')
      .eq('short_url', fullShortUrl)
      .single();

    if (dbError) throw dbError;
    
    if (data?.original_url) {
      // Vérifier si l'URL n'est pas expirée
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        error.value = t('redirect.error.expired');
        isLoading.value = false;
        return;
      }

      // Incrémenter le compteur d'utilisation
      const newCount = (data.usage_count || 0) + 1;
      await supabase
        .from('short_links')
        .update({ usage_count: newCount })
        .eq('id', data.id);

      // Rediriger vers l'URL originale
      window.location.href = data.original_url;
    } else {
      error.value = t('redirect.error.notFound');
      isLoading.value = false;
    }
  } catch (err) {
    console.error('Error fetching URL:', err);
    error.value = t('redirect.error.default');
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div v-if="error" class="text-center px-6">
      <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl max-w-md mx-auto">
        <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('redirect.error.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
        <button
          @click="router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          {{ t('redirect.error.backHome') }}
        </button>
      </div>
    </div>
    <div v-else-if="isLoading" class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">{{ t('redirect.loading') }}</p>
    </div>
  </div>
</template>
