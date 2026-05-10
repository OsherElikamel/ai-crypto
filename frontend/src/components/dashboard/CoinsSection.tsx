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
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import VoteButtons from "../ui/VoteButtons.tsx";
import type { Coin } from "../../types/index.ts";

interface CoinsSectionProps {
  items: Coin[];
  loading: boolean;
  onLike: (item: Coin) => void;
  onDislike: (item: Coin) => void;
  onClear: (item: Coin) => void;
}

const CoinsSection = ({ items, loading, onLike, onDislike, onClear }: CoinsSectionProps) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card>
      <Stack direction="row" alignItems="center" gap={1} sx={{ px: 2, py: 1.5 }}>
        <MonetizationOnIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight={700}>Coin Prices</Typography>
        <Typography variant="caption" color="text.secondary">{list.length} tracked</Typography>
      </Stack>
      <Divider />

      {loading ? (
        <Stack spacing={1} sx={{ p: 2 }}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={36} />
          ))}
        </Stack>
      ) : list.length === 0 ? (
        <Alert severity="info" sx={{ m: 2 }}>No coins yet.</Alert>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              "& th": {
                textAlign: "left",
                px: 2,
                py: 1,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                borderBottom: 1,
                borderColor: "divider",
              },
              "& td": {
                px: 2,
                py: 1.25,
                fontSize: "0.875rem",
                borderBottom: 1,
                borderColor: "divider",
              },
              "& tr:last-child td": { borderBottom: 0 },
              "& tbody tr:hover": { bgcolor: "action.hover" },
            }}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Symbol</th>
                <th>Name</th>
                <th>ID</th>
                <th style={{ textAlign: "right" }}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => (
                <tr key={c._id}>
                  <td>
                    <Typography variant="caption" color="text.secondary">{i + 1}</Typography>
                  </td>
                  <td>
                    <Typography variant="body2" fontWeight={700}>{c.symbol}</Typography>
                  </td>
                  <td>
                    <Typography variant="body2" color="text.secondary">{c.name}</Typography>
                  </td>
                  <td>
                    <Chip size="small" label={c.coingeckoId} />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <VoteButtons item={c} onLike={onLike} onDislike={onDislike} onClear={onClear} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default CoinsSection;
