<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardDocumentIcon, CheckIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import type { ShortLink } from '../types';

const props = defineProps<{
  shortLink: ShortLink;
}>();

const copied = ref(false);

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.shortLink.short_url);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
}
</script>

<template>
  <div class="w-full backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-xl">
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Shortened URL</span>
        <div class="flex gap-2">
          <a
            :href="shortLink.short_url"
            target="_blank"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowTopRightOnSquareIcon class="w-5 h-5" />
          </a>
          <button
            @click="copyToClipboard"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="copied ? 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:hover:bg-blue-700/40'"
          >
            <ClipboardDocumentIcon v-if="!copied" class="w-4 h-4" />
            <CheckIcon v-else class="w-4 h-4" />
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
      <p class="text-lg font-medium break-all">
        {{ shortLink.short_url }}
      </p>
    </div>
  </div>
</template>