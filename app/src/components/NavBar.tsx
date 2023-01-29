import {ReactElement, ReactNode, useEffect, useState} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"

import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Menu, {MenuProps} from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Slide from "@mui/material/Slide"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import useScrollTrigger from "@mui/material/useScrollTrigger"

import {auth, logOut} from "../firebase"
import useViewport from "../hooks/useViewport"
import {getRootRoute} from "../shared/helpers"
import {Category} from "../shared/models"

import GoogleButton from "./GoogleButton"

const homeLink = (
  <Link to="/">
    <Box
      component="img"
      src="/favicon-32x32.png"
      sx={{
        ml: 2,
        mr: 4,
        transition: "transform 0.2s",
        ":hover": {
          transform: "scale(1.1)",
        },
      }}
    />
  </Link>
)

interface NavBarProps {
  dark: boolean
  toggleDark: () => void
}

export default function NavBar(props: NavBarProps) {
  const {t} = useTranslation()

  const width = useViewport()
  const isMobile = width < 650

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  useEffect(onClose, [isMobile])

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "background.paper",
          pr: 2,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar>
            {isMobile ? (
              <>
                <Box flexGrow={1}>
                  <IconButton
                    color="default"
                    onClick={e => setAnchorEl(e.currentTarget)}
                    size="large"
                  >
                    <MenuIcon />
                  </IconButton>
                  <NavBarMenu horizontal="left" {...{anchorEl, onClose}}>
                    {Object.values(Category).map(category => (
                      <MenuItem
                        component={Link}
                        key={category}
                        onClick={onClose}
                        to={getRootRoute(category)}
                      >
                        <Typography
                          textAlign="center"
                          textTransform="capitalize"
                        >
                          {t(category)}
                        </Typography>
                      </MenuItem>
                    ))}
                  </NavBarMenu>
                </Box>
                <Box flexGrow={1}>{homeLink}</Box>
              </>
            ) : (
              <>
                {homeLink}
                <Box display="flex" flexGrow={1}>
                  {Object.values(Category).map(category => (
                    <Button
                      component={Link}
                      key={category}
                      onClick={onClose}
                      sx={{
                        color: "text.primary",
                        display: "block",
                      }}
                      to={getRootRoute(category)}
                    >
                      {t(category)}
                    </Button>
                  ))}
                </Box>
              </>
            )}
            <UserMenu {...props} />
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )
}

function HideOnScroll({
  children,
  window,
}: {
  children: ReactElement
  window?: () => Window
}) {
  const trigger = useScrollTrigger({
    target: window?.(),
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

function NavBarMenu({
  anchorEl,
  children,
  onClose,
  horizontal,
}: {
  anchorEl: MenuProps["anchorEl"]
  children: ReactNode
  onClose: () => void
  horizontal: "left" | "right"
}) {
  return (
    <Menu
      anchorOrigin={{
        horizontal,
        vertical: "bottom",
      }}
      id="menu-appbar"
      keepMounted
      open={Boolean(anchorEl)}
      transformOrigin={{
        horizontal,
        vertical: "top",
      }}
      {...{anchorEl, onClose}}
    >
      {children}
    </Menu>
  )
}

function UserMenu({dark, toggleDark}: NavBarProps) {
  const {t} = useTranslation()
  const [user] = useAuthState(auth)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const onClose = () => setAnchorEl(null)

  const tooltipTitle = t("Toggle dark mode")

  return (
    <>
      <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{p: 0}}>
        <Avatar
          alt={user?.displayName ?? undefined}
          src={user?.photoURL ?? undefined}
        />
      </IconButton>
      <NavBarMenu horizontal="right" {...{anchorEl, onClose}}>
        <Tooltip placement="left" title={tooltipTitle}>
          <Typography px={4} variant="h5">
            🌞
            <Switch checked={dark} onChange={toggleDark} />
            🌛
          </Typography>
        </Tooltip>
        {user ? (
          <MenuItem onClick={handleLogout}>
            {t(`Log out ${user.displayName}`)}
          </MenuItem>
        ) : (
          <Box
            alignItems="center"
            display="flex"
            justifyContent="center"
            mt={2}
          >
            <GoogleButton loginText="Login" onClick={onClose} />
          </Box>
        )}
      </NavBarMenu>
    </>
  )

  function handleLogout() {
    onClose()
    logOut()
  }
}
