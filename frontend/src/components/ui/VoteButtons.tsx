import { IconButton, Stack, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ClearIcon from "@mui/icons-material/Clear";
import type { VotableItem } from "../../types/index.ts";

interface VoteButtonsProps<T extends VotableItem> {
  item: T;
  onLike: (item: T) => void;
  onDislike: (item: T) => void;
  onClear: (item: T) => void;
}

export default function VoteButtons<T extends VotableItem>({
  item,
  onLike,
  onDislike,
  onClear,
}: VoteButtonsProps<T>) {
  return (
    <Stack direction="row" alignItems="center" gap={0.5}>
      <IconButton aria-label="like" size="small" onClick={() => onLike(item)}>
        <ThumbUpOffAltIcon fontSize="small" />
      </IconButton>
      <Typography variant="caption">
        {item.likeCount ?? item.likedBy?.length ?? 0}
      </Typography>
      <IconButton aria-label="dislike" size="small" onClick={() => onDislike(item)}>
        <ThumbDownOffAltIcon fontSize="small" />
      </IconButton>
      <Typography variant="caption">
        {item.dislikeCount ?? item.dislikedBy?.length ?? 0}
      </Typography>
      <IconButton aria-label="clear vote" size="small" onClick={() => onClear(item)}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
