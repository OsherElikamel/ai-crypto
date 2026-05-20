import {
  Box,
  Card,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { VoteStatus } from "../ui/VoteButtons.tsx";
import type { Insight } from "../../types/index.ts";

interface InsightsSectionProps {
  items: Insight[];
  loading: boolean;
  voteStatuses?: Record<string, VoteStatus>;
  onLike: (item: Insight) => void;
  onDislike: (item: Insight) => void;
  onClear: (item: Insight) => void;
}

const InsightsSection = ({ items, loading, voteStatuses = {}, onLike, onDislike, onClear }: InsightsSectionProps) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>AI Insights</Typography>
        <Typography variant="caption" color="text.secondary">{list.length} generated</Typography>
      </Stack>
      <Divider />

      <Box sx={{ flex: 1, p: 2 }}>
        {loading ? (
          <Stack spacing={1.5}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
            ))}
          </Stack>
        ) : list.length === 0 ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <AutoAwesomeIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No insights generated yet</Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {list.map((ins) => (
              <Box
                key={ins._id}
                sx={{
                  borderLeft: "3px solid",
                  borderLeftColor: "primary.main",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {ins.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {ins.text}
                </Typography>
                <Stack direction="row" alignItems="center" gap={0.5} flexWrap="wrap">
                  {(ins.tags || []).map((t) => (
                    <Chip key={t} size="small" label={`#${t}`} />
                  ))}
                  {(ins.tickers || []).map((tk) => (
                    <Chip key={tk} size="small" label={tk} />
                  ))}
                  <Box sx={{ flex: 1 }} />
                  <VoteButtons item={ins} status={voteStatuses[ins._id]} onLike={onLike} onDislike={onDislike} onClear={onClear} />
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default InsightsSection;
