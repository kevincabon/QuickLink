<script setup lang="ts">
import { ref, watch } from 'vue';
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';
import { generateQRCode } from '../utils/qrcode';
import type { QRCodeOptions } from '../types';

const { t } = useI18n();

const props = defineProps<{
  url: string;
}>();

const qrCodeDataUrl = ref<string>('');
const options = ref<QRCodeOptions>({
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 260,
  height: 260
});

async function updateQRCode() {
  try {
    qrCodeDataUrl.value = await generateQRCode(props.url, options.value);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

async function downloadQRCode() {
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = qrCodeDataUrl.value;
  link.click();
}

// Observer les changements de l'URL et des options
watch(() => props.url, updateQRCode, { immediate: true });
watch(() => options.value, updateQRCode, { deep: true, immediate: true });
</script>

<template>
  <div class="w-full backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl">
    <div class="flex flex-col items-center gap-8">
      <div class="flex items-center gap-2">
        <QrCodeIcon class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h2 class="text-xl font-semibold">{{ t('qrCode.title') }}</h2>
      </div>

      <div class="grid grid-cols-2 gap-8 w-full max-w-xl">
        <div class="flex flex-col items-center gap-3">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('qrCode.color.label') }}</label>
          <div class="relative group">
            <div class="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <input
                v-model="options.color"
                type="color"
                class="w-8 h-8 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 absolute opacity-0 z-10"
              />
              <div 
                class="w-8 h-8 rounded-lg shadow-inner"
                :style="{ backgroundColor: options.color }"
              ></div>
              <span class="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {{ options.color.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-3">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('qrCode.color.background') }}</label>
          <div class="relative group">
            <div class="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <input
                v-model="options.backgroundColor"
                type="color"
                class="w-8 h-8 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 absolute opacity-0 z-10"
              />
              <div 
                class="w-8 h-8 rounded-lg shadow-inner relative overflow-hidden"
                :style="{ backgroundColor: options.backgroundColor }"
              >
                <!-- Grille de fond pour visualiser la couleur blanche -->
                <div v-if="options.backgroundColor.toLowerCase() === '#ffffff'" class="absolute inset-0 bg-gray-100 dark:bg-gray-700 opacity-50 grid grid-cols-2">
                  <div class="bg-white"></div>
                  <div class="bg-gray-100 dark:bg-gray-700"></div>
                  <div class="bg-gray-100 dark:bg-gray-700"></div>
                  <div class="bg-white"></div>
                </div>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {{ options.backgroundColor.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        v-if="qrCodeDataUrl" 
        class="mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
      >
        <img 
          :src="qrCodeDataUrl" 
          alt="QR Code" 
          class="transition-all duration-300 hover:scale-105 rounded-lg p-4"
          :style="{ width: `${options.width}px`, height: `${options.height}px` }" 
        />
      </div>
      
      <button
        @click="downloadQRCode"
        class="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:hover:bg-blue-700/40 rounded-lg transition-all duration-200"
      >
        <ArrowDownTrayIcon class="w-5 h-5" />
        {{ t('qrCode.download') }}
      </button>
    </div>
  </div>
</template>