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

      <!-- 404 Content -->
      <div class="max-w-2xl mx-auto text-center mt-20">
        <div class="mb-8">
          <ExclamationTriangleIcon class="w-24 h-24 mx-auto text-yellow-500 dark:text-yellow-400" />
        </div>
        <h2 class="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
          404
        </h2>
        <h3 class="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          {{ $t('notFound.title') }}
        </h3>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {{ $t('notFound.description') }}
        </p>
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:opacity-90 transition-opacity"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-2" />
          {{ $t('notFound.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useColorMode } from '@vueuse/core'
import { SunIcon, MoonIcon, LinkIcon, LanguageIcon, ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === 'dark')
const availableLocales = ['en', 'fr']

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLanguage = () => {
  const currentIndex = availableLocales.indexOf(locale.value)
  const nextIndex = (currentIndex + 1) % availableLocales.length
  locale.value = availableLocales[nextIndex]
}
</script>
