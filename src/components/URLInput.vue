<script setup lang="ts">
import { ref, watch } from 'vue';
import { LinkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
    error.value = t('errors.missingUrl');
    return;
  }

  if (!isUrlValid.value) {
    error.value = t('errors.invalidUrl');
    return;
  }

  try {
    error.value = '';
    isLoading.value = true;
    const result = await emit('submit', url.value, customPath.value, expiresIn.value) || {};
    
    if (result.error) {
      error.value = result.error === 'This custom URL is already taken' 
        ? t('errors.customPathTaken')
        : t('errors.default');
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
    <!-- Description principale -->
    <div class="text-center mb-6">
      <p class="text-gray-600 dark:text-gray-300 mb-2">{{ t('welcome.title') }} 🚀</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('welcome.subtitle') }}</p>
    </div>
    <div class="flex flex-col gap-4">
      <div class="space-y-2">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LinkIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="url"
            type="url"
            :placeholder="t('form.url.placeholder')"
            @input="handleUrlInput"
            class="w-full pl-10 pr-4 py-3 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
            :class="{ 'border-red-500 focus:border-red-600 focus:ring-red-200 dark:border-red-500 dark:focus:border-red-400': !isUrlValid && hasInteracted }"
          />
        </div>
      </div>

      <div class="space-y-2">
        <p class="text-sm text-gray-500 dark:text-gray-400 ml-1">{{ t('form.customPath.label') }}</p>
        <div class="relative">
          <input
            v-model="customPath"
            type="text"
            :placeholder="t('form.customPath.placeholder')"
            class="w-full px-4 py-2 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
          />
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ t('form.customPath.help') }}</p>
      </div>

      <div class="space-y-2">
        <p class="text-sm text-gray-500 dark:text-gray-400 ml-1">{{ t('form.expiration.label') }}</p>
        <select
          v-model="expiresIn"
          class="w-full px-4 py-2 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-800 transition-all duration-200"
        >
          <option :value="undefined">{{ t('form.expiration.options.none') }}</option>
          <option :value="1">{{ t('form.expiration.options.1h') }}</option>
          <option :value="2">{{ t('form.expiration.options.2h') }}</option>
          <option :value="4">{{ t('form.expiration.options.4h') }}</option>
          <option :value="8">{{ t('form.expiration.options.8h') }}</option>
          <option :value="24">{{ t('form.expiration.options.24h') }}</option>
          <option :value="168">{{ t('form.expiration.options.1w') }}</option>
        </select>
        <p class="text-xs text-gray-500 dark:text-gray-400 ml-1">{{ t('form.expiration.help') }}</p>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
      >
        <div 
          v-if="isLoading"
          class="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              class="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
        <span :class="{ 'opacity-0': isLoading }">
          {{ isLoading ? t('form.button.shortening') : t('form.button.shorten') }}
        </span>
        <ArrowPathIcon 
          class="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" 
          :class="{ 'opacity-0': isLoading }"
        />
      </button>
      <p v-if="error" class="text-red-500 dark:text-red-400 text-sm mt-2 text-center">
        {{ error }}
      </p>
    </div>
  </form>
</template>