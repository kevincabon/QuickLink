<script setup lang="ts">
import { ref } from 'vue';
import { LinkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'submit', url: string): void;
}>();

const url = ref('');
const error = ref('');
const isLoading = ref(false);

async function handleSubmit() {
  if (!url.value) {
    error.value = 'Please enter a URL';
    return;
  }

  try {
    new URL(url.value);
    error.value = '';
    isLoading.value = true;
    await emit('submit', url.value);
    url.value = '';
  } catch {
    error.value = 'Please enter a valid URL';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full">
    <div class="flex flex-col gap-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <LinkIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="url"
          type="url"
          placeholder="Enter your URL here"
          class="w-full pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-200': error }"
        />
      </div>
      <button
        type="submit"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
      >
        <ArrowPathIcon v-if="isLoading" class="h-5 w-5 animate-spin" />
        <span>{{ isLoading ? 'Shortening...' : 'Shorten URL' }}</span>
      </button>
      <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
    </div>
  </form>
</template>