const axios = require("axios")
const express = require("express")

const router = express.Router()

/**
 * Gets search results which match a user's query term and chosen category
 */
router.get("/", [], async ({query: {category, term}}, res) => {
  try {
    const pageTitles = await fetchPageTitles(term)
    const validTitles = await getValidTitles(category, pageTitles)
    const results = await fetchResults(validTitles)

    res.json({
      results,
      term,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error (ノಠ益ಠ)ノ彡┻━┻")
  }
})

module.exports = router

const BASE_PARAMS = {action: "query", format: "json", origin: "*"}
const WIKI_URL = "https://en.wikipedia.org/w/api.php"

/**
 * Gets page titles which match a user's query term (if any)
 * @param {string} search
 * @return {Promise<string[]>}
 */
async function fetchPageTitles(search) {
  const params = {
    ...BASE_PARAMS,
    action: "opensearch",
    search,
  }

  const {
    data: [, pageTitles],
  } = await axios.get(WIKI_URL, {
    params,
  })

  return pageTitles
}

const categoryKeywords = {
  baseball: "MLB",
  basketball: "NBA",
  football: "NFL",
  hockey: "NHL",
  soccer: "football",
}

/**
 * Gets the corresponding pages for a list of titles, returning the
 * titles of those which match the user's selected category (if any)
 * @param {string} category
 * @param {string[]} pageTitles
 * @return {Promise<string[]>}
 */
async function getValidTitles(category, pageTitles) {
  if (pageTitles.length === 0) return []

  const params = {
    ...BASE_PARAMS,
    prop: "revisions",
    rvprop: "content",
    titles: pageTitles.join("|"),
  }

  const {data} = await axios.get(WIKI_URL, {params})

  return Object.values(data.query?.pages ?? {}).flatMap(
    ({revisions, title}) => {
      const pageLines = revisions[0]["*"].split("\n")
      const description = pageLines.find(line =>
        /short description/i.test(line),
      )

      if (
        !description ||
        (!RegExp(category, "i").test(description) &&
          !RegExp(categoryKeywords[category], "i").test(description))
      ) {
        return []
      }

      const props = pageLines.filter(line => line.trimStart().startsWith("|"))
      const debutYear = getDebutYear()

      return debutYear ? [title] : []

      /**
       * Returns the year of an athlete's professional debut
       * @return {number}
       */
      function getDebutYear() {
        switch (category) {
          case "baseball":
            return getYear("debutyear")
          case "basketball":
            return getYear("career_start") ?? getYear("draftyear")
          case "football":
            return (
              getYear("draftyear") ??
              getYear("undraftedyear") ??
              getYear("suppdraftyear")
            )
          case "hockey":
            return getYear("career_start")
          case "soccer":
            return getYear("years1")
        }
      }

      /**
       * Finds a prop (if it exists) and returns its value
       * @param {string} propName
       * @return {string}
       */
      function getPropValue(propName) {
        const regex = RegExp(propName, "i")
        return (
          props
            .find(prop => regex.test(prop))
            ?.split("=")[1]
            ?.trim() ?? ""
        )
      }

      /**
       * Finds a prop and returns the first year it contains (if any)
       * @param {string} propName
       * @return {number}
       */
      function getYear(propName) {
        const yearString = getPropValue(propName)
        return Number(yearString.replace(/[^0-9]/g, "").substring(0, 4))
      }
    },
  )
}

/**
 * Gets the corresponding results for a list of titles
 * @param {string[]} pageTitles
 * @return {Promise<object[]>}
 */
async function fetchResults(pageTitles) {
  if (pageTitles.length === 0) return []

  const params = {
    ...BASE_PARAMS,
    pithumbsize: 200,
    prop: "pageimages",
    titles: pageTitles.join("|"),
  }

  const {data} = await axios.get(WIKI_URL, {params})

  return Object.values(data.query?.pages ?? {}).map(({thumbnail, title}) => ({
    image: thumbnail?.source,
    text: title,
  }))
}
