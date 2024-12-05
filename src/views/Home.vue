<script setup lang="ts">
import { ref, computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import { SunIcon, MoonIcon, LinkIcon, LanguageIcon, DocumentTextIcon } from '@heroicons/vue/24/solid';
import URLInput from '../components/URLInput.vue';
import QRCodeGenerator from '../components/QRCodeGenerator.vue';
import ResultCard from '../components/ResultCard.vue';
import { shortenUrl } from '../utils/url';
import type { ShortLink } from '../types';
import { useI18n } from 'vue-i18n';
import { appConfig } from '../config/app';

const colorMode = useColorMode();
const isDarkMode = computed(() => colorMode.value === 'dark');
const shortLink = ref<ShortLink | null>(null);
const error = ref('');
const { locale, t } = useI18n();
const availableLocales = ['en', 'fr'];
const isLoading = ref(false);

// Formater la date de mise à jour
const formattedUpdateDate = computed(() => {
  const date = new Date(appConfig.lastUpdate);
  const formattedDate = date.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return t('app.lastUpdate', { date: formattedDate });
});

async function handleURLSubmit(url: string, customPath?: string, expiresIn?: number) {
  try {
    error.value = '';
    isLoading.value = true;
    shortLink.value = null; // Reset shortLink before loading
    // Simuler un délai minimal pour une meilleure UX
    await new Promise(resolve => setTimeout(resolve, 800));
    shortLink.value = await shortenUrl(url, customPath, expiresIn);
    return { error: undefined }; // Retourne explicitement un objet avec error undefined en cas de succès
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to shorten URL. Please try again.';
    error.value = errorMessage;
    console.error(e);
    return { error: errorMessage }; // Retourne l'erreur au composant URLInput
  } finally {
    isLoading.value = false;
  }
}

function toggleColorMode() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
}

function toggleLanguage() {
  const currentIndex = availableLocales.indexOf(locale.value);
  const nextIndex = (currentIndex + 1) % availableLocales.length;
  locale.value = availableLocales[nextIndex];
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header class="flex justify-between items-center mb-12">
        <div class="flex items-center gap-3">
          <LinkIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            LinkQR
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="toggleLanguage"
            class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <LanguageIcon class="w-6 h-6 text-blue-500" />
          </button>
          <button
            @click="toggleColorMode"
            class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <SunIcon v-if="isDarkMode" class="w-6 h-6 text-yellow-500" />
            <MoonIcon v-else class="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <main class="max-w-2xl mx-auto">
        <URLInput @submit="handleURLSubmit" />
        
        <!-- Loading State -->
        <div v-if="isLoading" class="mt-8 flex flex-col items-center justify-center space-y-4">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0">
              <div class="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900"></div>
            </div>
            <div class="absolute inset-0">
              <div class="w-16 h-16 rounded-full border-4 border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
            </div>
          </div>
          <p class="text-gray-600 dark:text-gray-300 animate-pulse">{{ t('form.button.shortening') }}</p>
        </div>

        <!-- Result State -->
        <template v-if="!isLoading && shortLink">
          <ResultCard :short-link="shortLink" class="mt-8" />
          <QRCodeGenerator :url="shortLink.short_url" class="mt-8" />
        </template>
      </main>

      <div v-if="error" class="text-red-500 text-center mt-4">
        {{ error }}
      </div>
    </div>

    <footer class="fixed bottom-0 w-full py-3 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div class="container mx-auto flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div>
          LinkQR <span 
            class="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs cursor-help" 
            :title="formattedUpdateDate"
          >Beta {{ appConfig.version }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span>Made with ❤️</span>
          <a href="https://notebloomapp.com" target="_blank" rel="noopener" class="hover:text-blue-500 transition-colors flex items-center gap-1">
            <DocumentTextIcon class="w-4 h-4" />
            NoteBloom
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
