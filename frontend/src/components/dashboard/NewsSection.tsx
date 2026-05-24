import {
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import RefreshIcon from "@mui/icons-material/Refresh";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { NewsItem } from "../../types/index.ts";

interface NewsSectionProps {
  items: NewsItem[];
  loading: boolean;
  onLike: (item: NewsItem) => void;
  onDislike: (item: NewsItem) => void;
  onClear: (item: NewsItem) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const NewsSection = ({ items, loading, onLike, onDislike, onClear, onRefresh, refreshing }: NewsSectionProps) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <NewspaperIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>Market News</Typography>
        <Typography variant="caption" color="text.secondary">{list.length} stories</Typography>
        <Box sx={{ flex: 1 }} />
        {onRefresh && (
          <Tooltip title="Refresh news">
            <span>
              <IconButton size="small" onClick={onRefresh} disabled={refreshing}>
                <RefreshIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none", "@keyframes spin": { "100%": { transform: "rotate(360deg)" } } }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
      <Divider />

      <Box sx={{ flex: 1 }}>
        {loading ? (
          <Stack spacing={1.5} sx={{ p: 2 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} sx={{ borderRadius: 0.5 }} />
            ))}
          </Stack>
        ) : list.length === 0 ? (
          <Stack alignItems="center" sx={{ py: 4, px: 2 }}>
            <NewspaperIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No news stories yet</Typography>
          </Stack>
        ) : (
          <Stack spacing={0}>
            {list.map((n, i) => (
              <Box key={n._id}>
                <Stack spacing={0.5} sx={{ px: 2, py: 1.5 }}>
                  <Link href={n.url} target="_blank" rel="noopener noreferrer" underline="hover">
                    <Typography variant="body2">{n.title}</Typography>
                  </Link>
                  <Stack direction="row" alignItems="center" gap={0.75} flexWrap="wrap">
                    {n.source && <Chip size="small" label={n.source} variant="outlined" />}
                    {(n.tickers || []).map((tk) => (
                      <Chip key={tk} size="small" label={tk} />
                    ))}
                    {n.createdAt && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </Typography>
                    )}
                    <Box sx={{ flex: 1 }} />
                    <VoteButtons item={n} onLike={onLike} onDislike={onDislike} onClear={onClear} />
                  </Stack>
                </Stack>
                {i < list.length - 1 && <Divider />}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default NewsSection;
