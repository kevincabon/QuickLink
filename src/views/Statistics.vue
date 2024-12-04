<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
    <div class="container mx-auto px-4 py-8">
      <!-- Header avec logo, titre et boutons -->
      <header class="flex justify-between items-center mb-12">
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <LinkIcon class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            LinkQR
          </h1>
        </router-link>
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

      <div v-if="linkData" class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">{{ $t('statistics.title') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Original URL Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.originalUrl') }}</h2>
            <a :href="linkData.original_url" class="text-blue-600 dark:text-blue-400 break-all hover:underline" target="_blank">
              {{ linkData.original_url }}
            </a>
          </div>

          <!-- Short URL Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.shortUrl') }}</h2>
            <div class="flex items-center space-x-2">
              <a :href="linkData.short_url" class="text-blue-600 dark:text-blue-400 break-all hover:underline" target="_blank">
                {{ linkData.short_url }}
              </a>
              <button @click="copyToClipboard(linkData.short_url)" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Usage Count Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.clicks') }}</h2>
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ linkData.usage_count }}
            </div>
          </div>

          <!-- Creation Date Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.createdAt') }}</h2>
            <div class="text-gray-600 dark:text-gray-300">
              {{ formatDate(linkData.created_at) }}
            </div>
          </div>

          <!-- Expiration Date Card -->
          <div v-if="linkData.expires_at" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.expiresAt') }}</h2>
            <div class="text-gray-600 dark:text-gray-300">
              {{ formatDate(linkData.expires_at) }}
            </div>
            <div class="mt-2">
              <div class="text-sm" :class="isExpired ? 'text-red-500' : 'text-green-500'">
                {{ isExpired ? $t('statistics.expired') : $t('statistics.active') }}
              </div>
            </div>
          </div>

          <!-- QR Code Card -->
          <div v-if="linkData.qr_code_url" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{{ $t('statistics.qrCode') }}</h2>
            <img :src="linkData.qr_code_url" alt="QR Code" class="w-32 h-32 mx-auto">
            <a 
              :href="linkData.qr_code_url" 
              download="qr-code.png"
              class="mt-4 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ $t('statistics.downloadQr') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { SunIcon, MoonIcon, LinkIcon, LanguageIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { supabase } from '../config/supabaseClient'

interface LinkData {
  id: string
  original_url: string
  short_url: string
  qr_code_url: string | null
  usage_count: number
  created_at: string
  expires_at: string | null
  custom_path: string | null
}

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const linkData = ref<LinkData | null>(null)
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === 'dark')
const availableLocales = ['en', 'fr']

const isExpired = computed(() => {
  if (!linkData.value?.expires_at) return false
  return new Date(linkData.value.expires_at) < new Date()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // You might want to add a toast notification here
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLanguage = () => {
  const currentIndex = availableLocales.indexOf(locale.value)
  const nextIndex = (currentIndex + 1) % availableLocales.length
  locale.value = availableLocales[nextIndex]
}

onMounted(async () => {
  const { data, error } = await supabase
    .from('short_links')
    .select('*')
    .eq('custom_path', route.params.path)
    .single()

  if (error) {
    console.error('Error fetching link data:', error)
    return
  }

  linkData.value = data
})
</script>