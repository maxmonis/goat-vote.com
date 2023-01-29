import {initReactI18next} from "react-i18next"

import i18n from "i18next"
import detector from "i18next-browser-languagedetector"

import {localLanguage} from "../utils/storage"

import en from "./en.json"
import es from "./es.json"

const resources = {
  en: {translation: en},
  es: {translation: es},
} as const
const languages = Object.keys(resources)
const fallbackLng = languages[0]
const storedLanguage = localLanguage.get<string>()
const lng =
  storedLanguage && languages.includes(storedLanguage)
    ? storedLanguage
    : fallbackLng

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
    lng,
    resources,
  })

i18n.languages = languages

export default i18n
