import { IconButton, Stack, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ClearIcon from "@mui/icons-material/Clear";
import type { VotableItem } from "../../types/index.ts";

export type VoteStatus = "like" | "dislike" | "none";

interface VoteButtonsProps<T extends VotableItem> {
  item: T;
  status?: VoteStatus;
  onLike: (item: T) => void;
  onDislike: (item: T) => void;
  onClear: (item: T) => void;
}

export default function VoteButtons<T extends VotableItem>({
  item,
  status = "none",
  onLike,
  onDislike,
  onClear,
}: VoteButtonsProps<T>) {
  const liked = status === "like";
  const disliked = status === "dislike";
  const active = liked || disliked;

  return (
    <Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 120 }}>
      <IconButton
        aria-label="like"
        size="small"
        onClick={() => (liked ? onClear(item) : onLike(item))}
        sx={liked ? { color: "primary.main" } : undefined}
      >
        {liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOffAltIcon fontSize="small" />}
      </IconButton>
      <Typography variant="caption" sx={{ minWidth: 12, ...(liked ? { color: "primary.main", fontWeight: 600 } : {}) }}>
        {item.likeCount ?? item.likedBy?.length ?? 0}
      </Typography>
      <IconButton
        aria-label="dislike"
        size="small"
        onClick={() => (disliked ? onClear(item) : onDislike(item))}
        sx={disliked ? { color: "error.main" } : undefined}
      >
        {disliked ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOffAltIcon fontSize="small" />}
      </IconButton>
      <Typography variant="caption" sx={{ minWidth: 12, ...(disliked ? { color: "error.main", fontWeight: 600 } : {}) }}>
        {item.dislikeCount ?? item.dislikedBy?.length ?? 0}
      </Typography>
      <IconButton
        aria-label="clear vote"
        size="small"
        onClick={() => onClear(item)}
        sx={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none", transition: "opacity 0.15s" }}
      >
        <ClearIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
