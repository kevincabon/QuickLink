import { createI18n } from 'vue-i18n'
import en from './en'
import fr from './fr'

export default createI18n({
  legacy: false,
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    fr
  }
})
