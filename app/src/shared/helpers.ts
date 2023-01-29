import {t} from "i18next"

import {categories} from "./constants"
import {Category} from "./models"

export function getDisplayText(text: string) {
  return text.split(" (")[0]
}

export function getInitials(text: string) {
  return getDisplayText(text)
    .split(" ")
    .map(t => t[0].toUpperCase())
    .join("")
}

export function getRootRoute(category: Category) {
  const {subcategories, timeframes} = categories[category]
  return `/${category}/${subcategories[0]}/${timeframes[0]}`
}

export function getSubcategoryText(subcategory: string) {
  return t("The best {{subcategory}}", {
    subcategory: t(subcategory),
  })
}

export function getTimeframeText(timeframe: string) {
  switch (timeframe) {
    case "all-time":
      return t("of all time")
    case "20th-century":
      return t("of the 20th century")
    case "21st-century":
      return t("of the 21st century")
    case "pre-1960":
    case "pre-1920":
      return t("prior to {{year}}", {year: timeframe.replace(/\D/g, "")})
    default:
      return t("of the {{decade}}s", {decade: timeframe.replace(/\D/g, "")})
  }
}

export function isCategory(category: unknown): category is Category {
  return typeof category === "string" && category in categories
}

export function isSubcategory(
  subcategory: unknown,
  category: Category,
): subcategory is string {
  return (
    typeof subcategory === "string" &&
    categories[category].subcategories.includes(subcategory)
  )
}

export function isTimeframe(
  timeframe: unknown,
  category: Category,
): timeframe is string {
  return (
    typeof timeframe === "string" &&
    categories[category].timeframes.includes(timeframe)
  )
}
