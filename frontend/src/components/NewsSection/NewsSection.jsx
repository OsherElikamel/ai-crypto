import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ClearIcon from "@mui/icons-material/Clear";
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
  Link
} from "@mui/material";

const NewsSection = ({ items, loading, onLike, onDislike, onClear }) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card>
      <CardHeader title="Market News" subheader="From your sources" />
      <Divider />
      <CardContent>
        {loading ? (
          <Stack spacing={2}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={48} />
            ))}
          </Stack>
        ) : list.length === 0 ? (
          <Alert severity="info">No news yet.</Alert>
        ) : (
          <Stack spacing={1.5}>
            {list.map((n) => (
              <div key={n._id}>
                <Stack direction="row" alignItems="flex-start" gap={1}>
                  <Stack sx={{ flex: 1 }}>
                    <Link href={n.url} target="_blank" rel="noopener noreferrer" underline="hover">
                      <Typography variant="body1">{n.title}</Typography>
                    </Link>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {(n.tickers || []).map((tk) => (
                        <Chip key={tk} size="small" label={tk} />
                      ))}
                    </Stack>
                    {n.source && (
                      <Typography variant="caption" color="text.secondary">
                        {n.source}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <IconButton aria-label="like" onClick={() => onLike(n)}><ThumbUpOffAltIcon /></IconButton>
                    <Typography variant="caption">{(n.likedBy?.length ?? 0).toString()}</Typography>

                    <IconButton aria-label="dislike" onClick={() => onDislike(n)}><ThumbDownOffAltIcon /></IconButton>
                    <Typography variant="caption">{(n.dislikedBy?.length ?? 0).toString()}</Typography>

                    <IconButton aria-label="clear vote" onClick={() => onClear(n)}><ClearIcon /></IconButton>
                  </Stack>
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
