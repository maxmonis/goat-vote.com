import {useState} from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import {useTranslation} from "react-i18next"

import LoadingButton, {LoadingButtonProps} from "@mui/lab/LoadingButton"
import Box from "@mui/material/Box"

import {auth, logInWithGoogle, logOut} from "../firebase"

export default function GoogleButton({
  loginText = "Sign in with Google",
  onClick,
  showLogoutButton = false,
  sx,
  ...props
}: Omit<LoadingButtonProps, "loading" | "onClick"> & {
  loginText?: string
  onClick?: () => void
  showLogoutButton?: boolean
}) {
  const {t} = useTranslation()
  const [user, loading] = useAuthState(auth)

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loading || (user && !showLogoutButton)) return <></>

  return (
    <LoadingButton
      loading={isSubmitting}
      onClick={handleClick}
      sx={{
        fontSize: "1rem",
        maxWidth: "20rem",
        minHeight: "2.75rem",
        textTransform: "none",
        width: "clamp(min-content, 100%, 18rem)",
        ":not(:disabled)": {
          background: "white",
          color: "rgb(68, 68, 68)",
          ":hover": {
            boxShadow: "0 0 3px 3px rgb(66 133 244 / 30%)",
          },
        },
        ...sx,
      }}
      variant="outlined"
      {...props}
    >
      {!isSubmitting && (
        <Box
          alt="google logo"
          component="img"
          src={
            "https://user-images.githubusercontent.com/51540371/" +
            "209448811-2b88004b-4abd-4b68-9944-9d47b350a735.png"
          }
          sx={{mr: 3, width: "1.5rem"}}
        />
      )}
      {t(user ? "Logout" : loginText)}
    </LoadingButton>
  )

  async function handleClick() {
    if (loading || isSubmitting) return
    onClick?.()
    setIsSubmitting(true)
    try {
      user ? await logOut() : await logInWithGoogle()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
}
