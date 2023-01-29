import {Link, LinkProps} from "react-router-dom"

import Button, {ButtonProps} from "@mui/material/Button"
import Typography, {TypographyProps} from "@mui/material/Typography"

export function ButtonLink({
  children,
  to,
  ...props
}: ButtonProps & {
  to: LinkProps["to"]
}) {
  return (
    <Link style={{color: "unset", textDecoration: "none"}} {...{to}}>
      <Button {...props}>{children}</Button>
    </Link>
  )
}

export function TextLink({
  children,
  sx,
  to,
  ...props
}: TypographyProps & {
  to: LinkProps["to"]
}) {
  return (
    <Typography
      sx={{
        a: {
          color: "text.primary",
          textDecoration: "none",
        },
        ...sx,
      }}
      {...props}
    >
      <Link {...{to}}>{children}</Link>
    </Typography>
  )
}
