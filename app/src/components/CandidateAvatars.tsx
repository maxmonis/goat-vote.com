import Avatar from "@mui/material/Avatar"
import AvatarGroup from "@mui/material/AvatarGroup"
import Tooltip from "@mui/material/Tooltip"

import {getDisplayText, getInitials} from "../shared/helpers"
import {Candidate} from "../shared/models"

export default function CandidateAvatars({
  candidates,
}: {
  candidates: Candidate[]
}) {
  return (
    <AvatarGroup
      spacing="small"
      sx={{
        "> *": {
          height: "min(20vw, 4rem) !important",
          width: "min(20vw, 4rem) !important",
        },
      }}
    >
      {candidates.map(({text, image}) => (
        <Tooltip
          arrow
          key={text}
          placement="bottom"
          title={getDisplayText(text)}
        >
          {image ? (
            <Avatar alt={text} src={image} />
          ) : (
            <Avatar>{getInitials(text)}</Avatar>
          )}
        </Tooltip>
      ))}
    </AvatarGroup>
  )
}
