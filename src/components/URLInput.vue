<script setup lang="ts">
import { ref, watch } from 'vue';
import { LinkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits<{
  (e: 'submit', url: string, customPath?: string, expiresIn?: number): Promise<{ error?: string }>;
}>();

const url = ref('');
const customPath = ref('');
const expiresIn = ref<number>();
const error = ref('');
const isLoading = ref(false);
const isUrlValid = ref(true);
const hasInteracted = ref(false);

// Validation en temps réel de l'URL
watch(url, (newUrl) => {
  if (!newUrl && !hasInteracted.value) {
    return;
  }

  try {
    new URL(newUrl);
    isUrlValid.value = true;
    error.value = '';
  } catch {
    isUrlValid.value = false;
  }
});

const handleUrlInput = () => {
  hasInteracted.value = true;
};

async function handleSubmit() {
  if (!url.value) {
    error.value = '🔗 Oops! Looks like you forgot to enter a URL';
    return;
  }

  if (!isUrlValid.value) {
    error.value = 'Please enter a valid URL';
    return;
  }

  try {
    error.value = '';
    isLoading.value = true;
    const result = await emit('submit', url.value, customPath.value, expiresIn.value) || {};
    
    if (result.error) {
      error.value = result.error;
      // Ne pas réinitialiser le formulaire en cas d'erreur de custom URL
      if (result.error !== 'This custom URL is already taken') {
        url.value = '';
        customPath.value = '';
        expiresIn.value = undefined;
      }
    } else {
      // Réinitialiser le formulaire seulement si tout s'est bien passé
      url.value = '';
      customPath.value = '';
      expiresIn.value = undefined;
      error.value = '';
      hasInteracted.value = false; // Réinitialiser l'état d'interaction
    }
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
          @input="handleUrlInput"
          class="w-full pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
          :class="{ 'border-red-500 focus:border-red-600 focus:ring-red-200 dark:border-red-500 dark:focus:border-red-400': !isUrlValid && hasInteracted }"
        />
      </div>

      <!-- Custom Path Input -->
      <div class="relative">
        <input
          v-model="customPath"
          type="text"
          placeholder="Custom path (optional)"
          class="w-full px-4 py-2 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
        />
      </div>

      <!-- Expiration Time Input -->
      <div class="relative">
        <select
          v-model="expiresIn"
          class="w-full px-4 py-2 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
        >
          <option :value="undefined">No expiration</option>
          <option :value="1">1 hour</option>
          <option :value="2">2 hours</option>
          <option :value="4">4 hours</option>
          <option :value="8">8 hours</option>
          <option :value="24">24 hours</option>
          <option :value="168">1 week</option>
        </select>
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