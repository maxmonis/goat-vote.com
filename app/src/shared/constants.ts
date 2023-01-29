import {Categories, Category} from "./models"

const defaultTimeframes = [
  "all-time",
  "21st-century",
  "20th-century",
  // "2020s",
  // "2010s",
  // "2000s",
  // "1990s",
  // "1980s",
  // "1970s",
  // "1960s",
  // "pre-1960",
]

// const baseballTimeframes = [
//   ...defaultTimeframes.slice(0, -1),
//   ...["1950s", "1940s", "1930s", "1920s", "pre-1920"],
// ]

const defaultCategories = ["player", "offensive-player", "defensive-player"]

const baseballCategories = [
  ...defaultCategories,
  "pitcher",
  // "catcher",
  // "corner-infielder",
  // "middle-infielder",
  // "outfielder",
]
const basketballCategories = [
  ...defaultCategories,
  // "point-guard",
  // "shooting-guard",
  // "small-forward",
  // "power-forward",
  // "center",
]
const footballCategories = [
  ...defaultCategories,
  "quarterback",
  // "skill-position-player",
  // "offensive-lineman",
  // "defensive-lineman",
  // "linebacker",
  // "defensive-back",
]
const hockeyCategories = [...defaultCategories, "goalie"]
const soccerCategories = [...defaultCategories, "goalkeeper"]

export const categories: Categories = {
  [Category.baseball]: {
    timeframes: defaultTimeframes, //  baseballTimeframes,
    subcategories: baseballCategories,
  },
  [Category.basketball]: {
    timeframes: defaultTimeframes,
    subcategories: basketballCategories,
  },
  [Category.football]: {
    timeframes: defaultTimeframes,
    subcategories: footballCategories,
  },
  [Category.hockey]: {
    timeframes: defaultTimeframes,
    subcategories: hockeyCategories,
  },
  [Category.soccer]: {
    timeframes: defaultTimeframes,
    subcategories: soccerCategories,
  },
} as const
