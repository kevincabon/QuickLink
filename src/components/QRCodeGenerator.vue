<script setup lang="ts">
import { ref, watch } from 'vue';
import { QrCodeIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
import { generateQRCode } from '../utils/qrcode';
import type { QRCodeOptions } from '../types';

const props = defineProps<{
  url: string;
}>();

const qrCodeDataUrl = ref<string>('');
const options = ref<QRCodeOptions>({
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 400,
});

async function updateQRCode() {
  try {
    qrCodeDataUrl.value = await generateQRCode(props.url, options.value);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

function downloadQRCode() {
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = qrCodeDataUrl.value;
  link.click();
}

watch(() => props.url, updateQRCode, { immediate: true });
watch(() => options.value, updateQRCode, { deep: true });
</script>

<template>
  <div class="w-full backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl">
    <div class="flex flex-col items-center gap-8">
      <div class="flex items-center gap-2">
        <QrCodeIcon class="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h2 class="text-xl font-semibold">Générateur de QR Code</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Couleur du QR</label>
          <input
            v-model="options.color"
            type="color"
            class="h-10 rounded-lg cursor-pointer w-full"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Couleur de fond</label>
          <input
            v-model="options.backgroundColor"
            type="color"
            class="h-10 rounded-lg cursor-pointer w-full"
          />
        </div>
        <div class="flex flex-col gap-2 md:col-span-2">
          <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Taille</label>
          <input
            v-model="options.width"
            type="range"
            min="300"
            max="800"
            step="50"
            class="w-full"
          />
          <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
            {{ options.width }}px
          </div>
        </div>
      </div>
      
      <div 
        v-if="qrCodeDataUrl" 
        class="bg-white dark:bg-gray-700 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
      >
        <img 
          :src="qrCodeDataUrl" 
          alt="QR Code" 
          class="transition-all duration-300 hover:scale-105"
          :style="{ width: `${options.width}px`, height: `${options.width}px` }" 
        />
      </div>
      
      <button
        @click="downloadQRCode"
        class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <ArrowDownTrayIcon class="w-5 h-5" />
        Télécharger le QR Code
      </button>
    </div>
  </div>
</template>