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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { Insight } from "../../types/index.ts";

interface InsightsSectionProps {
  items: Insight[];
  loading: boolean;
  onLike: (item: Insight) => void;
  onDislike: (item: Insight) => void;
  onClear: (item: Insight) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const InsightsSection = ({ items, loading, onLike, onDislike, onClear, onRefresh, refreshing }: InsightsSectionProps) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <AutoAwesomeIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>AI Insights</Typography>
        <Typography variant="caption" color="text.secondary">{list.length} generated</Typography>
        <Box sx={{ flex: 1 }} />
        {onRefresh && (
          <Tooltip title="Generate new insights">
            <span>
              <IconButton size="small" onClick={onRefresh} disabled={refreshing}>
                <RefreshIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
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
                  <VoteButtons item={ins} onLike={onLike} onDislike={onDislike} onClear={onClear} />
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
