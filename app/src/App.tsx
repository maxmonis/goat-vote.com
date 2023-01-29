import {useState} from "react"
import {useTranslation} from "react-i18next"
import {QueryClient, QueryClientProvider} from "react-query"
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

import Footer from "./components/Footer"
import GoogleButton from "./components/GoogleButton"
import NavBar from "./components/NavBar"
import Dashboard from "./pages/Dashboard"
import VoteApp from "./pages/VoteApp"
import VoteList from "./pages/VoteList"
import {localDark} from "./utils/storage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
})

export default function App() {
  const {t} = useTranslation()

  const localPrefersDark = localDark.get<boolean>()
  const browserPrefersDark = useMediaQuery("(prefers-color-scheme: dark)")
  const [dark, setDark] = useState(
    typeof localPrefersDark === "boolean"
      ? localPrefersDark
      : browserPrefersDark,
  )

  const theme = responsiveFontSizes(
    createTheme({
      palette: {
        mode: dark ? "dark" : "light",
      },
      spacing: (factor = 1) => `${0.25 * factor}rem`,
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Box>
          <Box minHeight="100vh" minWidth="100vw">
            <BrowserRouter>
              <NavBar {...{dark, toggleDark}} />
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap={6}
                mb={10}
              >
                <Typography variant="h1">{t("Who's the GOAT?")}</Typography>
                <Typography variant="h2">{t("Cast your vote!")}</Typography>
                <GoogleButton />
              </Box>
              <Routes>
                <Route path="/:creatorId?/votes/*" element={<VoteList />} />
                <Route
                  path="/:category/:subcategory/:timeframe"
                  element={<VoteApp />}
                />
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<Navigate replace to="/" />} />
              </Routes>
            </BrowserRouter>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  )

  function toggleDark() {
    localDark.set(!dark)
    setDark(!dark)
  }
}
