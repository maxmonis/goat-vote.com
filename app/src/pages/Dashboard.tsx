import {useAuthState} from "react-firebase-hooks/auth"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"

import SportsBaseballIcon from "@mui/icons-material/SportsBaseball"
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball"
import SportsFootballIcon from "@mui/icons-material/SportsFootball"
import SportsHockeyIcon from "@mui/icons-material/SportsHockey"
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import CandidateAvatars from "../components/CandidateAvatars"
import GoogleButton from "../components/GoogleButton"
import {ButtonLink, TextLink} from "../components/UI"
import {auth} from "../firebase"
import useVotes from "../hooks/useVotes"
import {
  getRootRoute,
  getSubcategoryText,
  getTimeframeText,
} from "../shared/helpers"
import {Category} from "../shared/models"

export default function Dashboard() {
  const {t} = useTranslation()
  const [user] = useAuthState(auth)
  const {data: userVotes} = useVotes({creatorId: user?.uid, limit: 6, page: 1})
  const {data: allVotes} = useVotes({limit: 6, page: 1})

  return (
    <Box
      alignItems="center"
      component="main"
      display="flex"
      flexDirection="column"
      gap="max(1.5rem, 5vh)"
      minHeight="90vh"
      justifyContent="center"
      p="1rem 1.5rem"
    >
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        m="1rem auto 2rem"
        gap={8}
      >
        {Object.values(Category).map(category => (
          <Box
            alignItems="center"
            border={1}
            borderRadius={6}
            color="inherit"
            component={Link}
            display="flex"
            flexDirection="column"
            flexGrow={1}
            gap={1}
            justifyContent="center"
            key={category}
            maxWidth="20rem"
            p={4}
            sx={{
              textDecoration: "none",
              transition: "transform 0.2s",
              ":hover": {
                transform: "scale(1.05)",
              },
            }}
            to={getRootRoute(category)}
            width="100%"
          >
            <Typography variant="h3" textTransform="capitalize" color="inherit">
              {t(category)}
            </Typography>
            <Icon {...{category}} />
          </Box>
        ))}
      </Box>
      {allVotes && (
        <Box
          display="flex"
          flexDirection="column"
          gap="4rem"
          maxWidth="lg"
          textAlign="center"
        >
          <Typography variant="h3">{t("Recent Votes")}</Typography>
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
                      to={`/${category}/${subcategory}/${timeframe}`}
                      variant="h6"
                    >
                      <Box component="span" textTransform="capitalize">{`${t(
                        category,
                      )}: `}</Box>
                      {`${getSubcategoryText(subcategory)} ${getTimeframeText(
                        timeframe,
                      )}`}
                    </TextLink>
                    <TextLink to={`/${creatorId}/votes`} variant="body1">
                      {t("by {{creatorName}}", {creatorName})}
                    </TextLink>
                  </Box>
                  <CandidateAvatars candidates={ballot} />
                </Box>
              ),
            )}
          </Box>
          <ButtonLink
            sx={{maxWidth: "fit-content", mx: "auto"}}
            to="/votes"
            variant="contained"
          >
            {t("See all Votes")}
          </ButtonLink>
        </Box>
      )}
      {user && userVotes && (
        <Box maxWidth="lg" mt={20} textAlign="center">
          <Typography variant="h3">
            {t("{{displayName}}'s Votes", {displayName: user?.displayName})}
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            gap="4rem clamp(1.5rem, 5%, 4rem)"
            justifyContent="center"
            mt="4rem"
          >
            {userVotes.map(({ballot, category, subcategory, timeframe}) => (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={4}
                key={category + subcategory + timeframe}
                maxWidth="min(20rem, 100%)"
              >
                <TextLink
                  to={`/${category}/${subcategory}/${timeframe}`}
                  variant="h6"
                >
                  <Box component="span" textTransform="capitalize">{`${t(
                    category,
                  )}: `}</Box>
                  {`${getSubcategoryText(subcategory)} ${getTimeframeText(
                    timeframe,
                  )}`}
                </TextLink>
                <CandidateAvatars candidates={ballot} />
              </Box>
            ))}
          </Box>
          <ButtonLink
            to={`/${user.uid}/votes`}
            sx={{m: "4rem auto"}}
            variant="contained"
          >
            {t("See More")}
          </ButtonLink>
        </Box>
      )}
    </Box>
  )
}

function Icon({category}: {category: Category}) {
  const fontSize = "clamp(2rem, 7.5vmin, 3rem)"

  const icons: Record<Category, JSX.Element> = {
    [Category.baseball]: <SportsBaseballIcon sx={{fontSize}} />,
    [Category.basketball]: <SportsBasketballIcon sx={{fontSize}} />,
    [Category.football]: <SportsFootballIcon sx={{fontSize}} />,
    [Category.hockey]: <SportsHockeyIcon sx={{fontSize}} />,
    [Category.soccer]: <SportsSoccerIcon sx={{fontSize}} />,
  } as const

  return icons[category]
}
