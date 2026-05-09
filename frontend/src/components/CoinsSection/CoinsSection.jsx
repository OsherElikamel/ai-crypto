import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ClearIcon from "@mui/icons-material/Clear";

const CoinsSection = ({ items, loading, onLike, onDislike, onClear }) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card>
      <CardHeader title="Coin Prices" subheader="Tracked assets" />
      <Divider />
      <CardContent>
        {loading ? (
          <Stack spacing={2}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} height={32} />
            ))}
          </Stack>
        ) : list.length === 0 ? (
          <Alert severity="info">No coins yet.</Alert>
        ) : (
          <Stack spacing={1}>
            {list.map((c) => (
              <Stack key={c._id} direction="row" alignItems="center" gap={1}>
                <Typography variant="body1" sx={{ minWidth: 64 }}>
                  {c.symbol}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1 }}
                >
                  {c.name}
                </Typography>
                <Chip size="small" label={c.coingeckoId} />
                <IconButton aria-label="like" onClick={() => onLike(c)}>
                  <ThumbUpOffAltIcon />
                </IconButton>
                <Typography variant="caption">
                  {(c.likedBy?.length ?? 0).toString()}
                </Typography>
                <IconButton aria-label="dislike" onClick={() => onDislike(c)}>
                  <ThumbDownOffAltIcon />
                </IconButton>
                <Typography variant="caption">
                  {(c.dislikedBy?.length ?? 0).toString()}
                </Typography>
                <IconButton aria-label="clear vote" onClick={() => onClear(c)}>
                  <ClearIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CoinsSection;
