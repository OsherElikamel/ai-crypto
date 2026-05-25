import {
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import RefreshIcon from "@mui/icons-material/Refresh";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { Meme } from "../../types/index.ts";

interface MemeSectionProps {
  item: Meme | null;
  loading: boolean;
  onLike: (item: Meme) => void;
  onDislike: (item: Meme) => void;
  onClear: (item: Meme) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const MemeSection = ({ item, loading, onLike, onDislike, onClear, onRefresh, refreshing }: MemeSectionProps) => {
  return (
    <Card>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <SentimentVerySatisfiedIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>Meme of the Day</Typography>
        <Box sx={{ flex: 1 }} />
        {onRefresh && (
          <Tooltip title="Load new meme">
            <span>
              <IconButton aria-label="Load new meme" size="small" onClick={onRefresh} disabled={refreshing}>
                <RefreshIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
      <Divider />

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
        ) : !item ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <SentimentVerySatisfiedIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No meme available right now</Typography>
          </Stack>
        ) : (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }}>
            {item.imageUrl && (
              <Box
                sx={{
                  width: { xs: "100%", sm: 280 },
                  flexShrink: 0,
                  borderRadius: 1,
                  overflow: "hidden",
                  bgcolor: "action.hover",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || "meme"}
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
            )}
            <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
              {item.title && (
                <Typography variant="subtitle1" fontWeight={600}>
                  {item.title}
                </Typography>
              )}
              <Stack direction="row" gap={0.5} flexWrap="wrap">
                {(item.tags || []).map((t) => (
                  <Chip key={t} size="small" label={`#${t}`} />
                ))}
                {item.source && <Chip size="small" label={item.source} variant="outlined" />}
              </Stack>
              <VoteButtons item={item} onLike={onLike} onDislike={onDislike} onClear={onClear} />
            </Stack>
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default MemeSection;
