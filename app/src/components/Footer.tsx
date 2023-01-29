import {useState} from "react"
import {useTranslation} from "react-i18next"

import LanguageIcon from "@mui/icons-material/Language"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import {localLanguage} from "../utils/storage"

export default function Footer() {
  const {t} = useTranslation()

  return (
    <Box
      alignItems="center"
      component="footer"
      display="flex"
      flexDirection="column"
      gap={2}
      justifyContent="flex-end"
      p="20rem 1rem 0.5rem"
      textAlign="center"
    >
      <LocaleApp />
      <Typography variant="body1">
        {t("Search powered by")}&nbsp;
        <Link
          href="https://www.mediawiki.org/wiki/API:Main_page"
          rel="noopener noreferrer"
          target="_blank"
        >
          Wikipedia
        </Link>
      </Typography>
      <Typography variant="body2">
        <Link
          href="https://github.com/maxmonis/goat-vote.com"
          mb={6}
          rel="noopener noreferrer"
          target="_blank"
        >
          © Max Monis 2022-{new Date().getFullYear()}
        </Link>
      </Typography>
    </Box>
  )
}

function LocaleApp() {
  const {
    i18n: {changeLanguage, language},
    t,
  } = useTranslation()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  const tooltipTitle = t("Change language")

  return (
    <Box>
      <Tooltip placement="top" title={tooltipTitle}>
        <IconButton onClick={e => setAnchorEl(e.currentTarget)} size="small">
          <LanguageIcon />
          &nbsp;{language}
        </IconButton>
      </Tooltip>
      <Menu
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        transformOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        {...{anchorEl, onClose}}
      >
        {[
          {key: "en", name: "English"},
          {key: "es", name: "Spanish"},
        ].map(({key, name}) => (
          <MenuItem
            onClick={() => {
              onClose()
              changeLanguage(key)
              localLanguage.set(key)
            }}
            {...{key}}
          >
            {t(name)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
