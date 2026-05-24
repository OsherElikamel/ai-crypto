import {
  Box,
  Card,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { Coin } from "../../types/index.ts";

interface CoinsSectionProps {
  items: Coin[];
  loading: boolean;
  onLike: (item: Coin) => void;
  onDislike: (item: Coin) => void;
  onClear: (item: Coin) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onAddCoin?: () => void;
}

function formatPrice(val: number | null | undefined): string {
  if (val == null) return "—";
  return val.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: val < 1 ? 4 : 2 });
}

function formatLargeNumber(val: number | null | undefined): string {
  if (val == null) return "—";
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
}

function formatChange(val: number | null | undefined) {
  if (val == null) return { text: "—", color: "text.secondary" };
  const sign = val >= 0 ? "+" : "";
  return {
    text: `${sign}${val.toFixed(2)}%`,
    color: val >= 0 ? "success.main" : "error.main",
  };
}

const CoinsSection = ({ items, loading, onLike, onDislike, onClear, onRefresh, refreshing, onAddCoin }: CoinsSectionProps) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <MonetizationOnIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>Coin Prices</Typography>
        <Typography variant="caption" color="text.secondary">{list.length} tracked</Typography>
        <Box sx={{ flex: 1 }} />
        {onAddCoin && (
          <Tooltip title="Add / remove coins">
            <IconButton size="small" onClick={onAddCoin}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onRefresh && (
          <Tooltip title="Refresh prices">
            <span>
              <IconButton size="small" onClick={onRefresh} disabled={refreshing}>
                <RefreshIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
      </Stack>
      <Divider />

      {loading ? (
        <Stack spacing={1} sx={{ p: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={36} />
          ))}
        </Stack>
      ) : list.length === 0 ? (
        <Stack alignItems="center" sx={{ py: 4, px: 2 }}>
          <MonetizationOnIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">No coins tracked yet</Typography>
        </Stack>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              direction: "ltr",
              "& th, & td": {
                textAlign: "left",
                px: 2,
                py: 1.25,
                fontSize: "0.875rem",
                borderBottom: 1,
                borderColor: "divider",
              },
              "& th": {
                py: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
              },
              "& tr:last-child td": { borderBottom: 0 },
              "& tbody tr:hover": { bgcolor: "action.hover" },
            }}
          >
            <thead>
              <tr>
                <th>Rank</th>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
                <th>24h Volume</th>
                <th>Votes</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const change = formatChange(c.change24h);
                return (
                  <tr key={c._id}>
                    <td>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {c.rank != null ? `#${c.rank}` : "—"}
                      </Typography>
                    </td>
                    <td>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight={700}>{c.symbol}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>{c.name}</Typography>
                      </Stack>
                    </td>
                    <td>
                      <Typography variant="body2" fontWeight={600}>{formatPrice(c.price)}</Typography>
                    </td>
                    <td>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        {c.change24h != null && (
                          c.change24h >= 0
                            ? <TrendingUpIcon sx={{ fontSize: 16, color: "success.main" }} />
                            : <TrendingDownIcon sx={{ fontSize: 16, color: "error.main" }} />
                        )}
                        <Typography variant="body2" fontWeight={600} sx={{ color: change.color }}>
                          {change.text}
                        </Typography>
                      </Stack>
                    </td>
                    <td>
                      <Typography variant="body2" color="text.secondary">{formatLargeNumber(c.marketCap)}</Typography>
                    </td>
                    <td>
                      <Typography variant="body2" color="text.secondary">{formatLargeNumber(c.volume24h)}</Typography>
                    </td>
                    <td>
                      <VoteButtons item={c} onLike={onLike} onDislike={onDislike} onClear={onClear} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default CoinsSection;
