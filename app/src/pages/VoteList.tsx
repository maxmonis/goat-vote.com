import {useState} from "react"
import {useTranslation} from "react-i18next"
import {
  createSearchParams,
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

import CandidateAvatars from "../components/CandidateAvatars"
import {TextLink} from "../components/UI"
import useVotes from "../hooks/useVotes"
import {
  getSubcategoryText,
  getTimeframeText,
  isCategory,
  isSubcategory,
  isTimeframe,
} from "../shared/helpers"

export default function VoteList() {
  const {creatorId} = useParams()
  const [searchParams] = useSearchParams()
  const category = searchParams.get("category") ?? undefined
  const subcategory = searchParams.get("subcategory") ?? undefined
  const timeframe = searchParams.get("timeframe") ?? undefined

  const [pageCount, setPageCount] = useState(1)

  if (category) {
    const isValidCategory = isCategory(category)
    if (!isValidCategory) return <Navigate replace to="/votes" />

    if (subcategory) {
      const isValidSubcategory = isSubcategory(subcategory, category)
      const isValidTimeframe = isTimeframe(timeframe, category)
      const isValid = isValidSubcategory && isValidTimeframe
      if (!isValid) return <Navigate replace to="/votes" />
    }
  }

  return (
    <Box alignItems="center" display="flex" flexDirection="column" gap={6}>
      {Array.from(Array(pageCount)).map((_, i) => (
        <PaginatedVoteSection
          key={i}
          isLast={i + 1 === pageCount}
          page={i + 1}
          {...{category, creatorId, subcategory, timeframe, loadNextPage}}
        />
      ))}
    </Box>
  )

  function loadNextPage() {
    setPageCount(pageCount + 1)
  }
}

function PaginatedVoteSection({
  category,
  creatorId,
  isLast,
  loadNextPage,
  page,
  subcategory,
  timeframe,
}: {
  category?: string
  creatorId?: string
  isLast: boolean
  loadNextPage: () => void
  page: number
  subcategory?: string
  timeframe?: string
}) {
  const {t} = useTranslation()

  const {data: allVotes, isLoading: isLoadingVotes} = useVotes({
    category,
    creatorId,
    page,
    subcategory,
    timeframe,
  })
  const canLoadMore = allVotes?.length === 12
  const displayName = creatorId && allVotes?.at(0)?.creatorName
  const isSingleCategory = Boolean(category)

  return (
    <Box alignItems="center" display="flex" flexDirection="column" gap={6}>
      {page === 1 && (
        <>
          <Typography variant="h2">
            {displayName
              ? t("{{displayName}}'s Votes", {displayName})
              : t("Recent Votes")}
          </Typography>
          {category && (
            <Typography textTransform="capitalize" variant="h3">
              {t(category)}
            </Typography>
          )}
        </>
      )}
      {isLoadingVotes ? (
        <CircularProgress />
      ) : allVotes?.length ? (
        <Box
          display="flex"
          flexDirection="column"
          gap="4rem"
          maxWidth="lg"
          mt={10}
          textAlign="center"
        >
          <Box
            display="flex"
            flexWrap="wrap"
            gap="4rem clamp(1.5rem, 5%, 4rem)"
            justifyContent="center"
          >
            {allVotes.map(
              ({
                ballot,
                category,
                creatorId,
                creatorName,
                subcategory,
                timeframe,
              }) => (
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                  gap={6}
                  key={category + subcategory + timeframe + creatorId}
                  maxWidth="min(20rem, 100%)"
                >
                  <Box display="flex" flexDirection="column" gap={2}>
                    <TextLink
                      variant="h6"
                      to={{
                        pathname: "/votes",
                        search: `?${createSearchParams({
                          category,
                          subcategory,
                          timeframe,
                        })}`,
                      }}
                    >
                      {!isSingleCategory && (
                        <Box component="span" textTransform="capitalize">{`${t(
                          category,
                        )}: `}</Box>
                      )}
                      {`${getSubcategoryText(subcategory)} ${getTimeframeText(
                        timeframe,
                      )}`}
                    </TextLink>
                    {!displayName && (
                      <TextLink to={`/${creatorId}/votes`} variant="body1">
                        {t("by {{creatorName}}", {creatorName})}
                      </TextLink>
                    )}
                  </Box>
                  <CandidateAvatars candidates={ballot} />
                </Box>
              ),
            )}
          </Box>
          {isLast && canLoadMore && (
            <Button
              onClick={loadNextPage}
              sx={{maxWidth: "fit-content", mx: "auto"}}
              variant="contained"
            >
              {t("Load More")}...
            </Button>
          )}
        </Box>
      ) : null}
    </Box>
  )
}
