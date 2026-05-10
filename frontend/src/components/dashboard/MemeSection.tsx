import {
  Alert,
  Box,
  Card,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { Meme } from "../../types/index.ts";

interface MemeSectionProps {
  item: Meme | null;
  loading: boolean;
  onLike: (item: Meme) => void;
  onDislike: (item: Meme) => void;
  onClear: (item: Meme) => void;
}

const MemeSection = ({ item, loading, onLike, onDislike, onClear }: MemeSectionProps) => {
  return (
    <Card>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <SentimentVerySatisfiedIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>Meme of the Day</Typography>
      </Stack>
      <Divider />

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
        ) : !item ? (
          <Alert severity="info">No meme available</Alert>
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
                    height: 180,
                    objectFit: "cover",
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
