<script setup lang="ts">
import { ref, computed } from 'vue';
import { useColorMode } from '@vueuse/core';
import { SunIcon, MoonIcon, LinkIcon } from '@heroicons/vue/24/solid';
import URLInput from '../components/URLInput.vue';
import QRCodeGenerator from '../components/QRCodeGenerator.vue';
import ResultCard from '../components/ResultCard.vue';
import { shortenUrl } from '../utils/url';
import type { ShortLink } from '../types';

const colorMode = useColorMode();
const isDarkMode = computed(() => colorMode.value === 'dark');
const shortLink = ref<ShortLink | null>(null);
const error = ref('');

async function handleURLSubmit(url: string) {
  try {
    error.value = '';
    shortLink.value = await shortenUrl(url);
  } catch (e) {
    error.value = 'Failed to shorten URL. Please try again.';
    console.error(e);
  }
}

function toggleColorMode() {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 py-8">
      <header class="flex justify-between items-center mb-12">
        <div class="flex items-center gap-3">
          <LinkIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            QuickLink
          </h1>
        </div>
        <button
          @click="toggleColorMode"
          class="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <SunIcon v-if="isDarkMode" class="w-6 h-6 text-yellow-500" />
          <MoonIcon v-else class="w-6 h-6 text-gray-700" />
        </button>
      </header>

      <main class="max-w-2xl mx-auto">
        <URLInput @submit="handleURLSubmit" />
        <template v-if="shortLink">
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
          QuickLink <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">Beta 1.0</span>
        </div>
        <div class="flex items-center gap-4">
          <span>Made with ❤️</span>
          <a href="https://github.com/kevincabon" target="_blank" rel="noopener" class="hover:text-blue-500 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
