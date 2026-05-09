import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography
} from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ClearIcon from "@mui/icons-material/Clear";

const InsightsSection = ({ items, loading, onLike, onDislike, onClear }) => {
  const list = Array.isArray(items) ? items : [];
  return (
    <Card>
      <CardHeader title="AI Insight of the Day" subheader="Fresh market viewpoints" />
      <Divider />
      <CardContent>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="text" height={32} />
            <Skeleton variant="rectangular" height={90} />
          </Stack>
        ) : list.length === 0 ? (
          <Alert severity="info">No insights yet.</Alert>
        ) : (
          <Stack spacing={2}>
            {list.map((ins) => (
              <Card key={ins._id} variant="outlined">
                <CardHeader title={ins.title} />
                <CardContent>
                  <Typography variant="body2" paragraph>{ins.text}</Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {(ins.tags || []).map((t) => (<Chip key={t} size="small" label={`#${t}`} />))}
                    {(ins.tickers || []).map((tk) => (<Chip key={tk} size="small" label={tk} />))}
                  </Stack>
                </CardContent>
                <CardActions>
                  <IconButton aria-label="like" onClick={() => onLike(ins)}><ThumbUpOffAltIcon /></IconButton>
                  <Typography variant="caption">{(ins.likedBy?.length ?? 0).toString()}</Typography>
                  <IconButton aria-label="dislike" onClick={() => onDislike(ins)}><ThumbDownOffAltIcon /></IconButton>
                  <Typography variant="caption">{(ins.dislikedBy?.length ?? 0).toString()}</Typography>
                  <IconButton aria-label="clear vote" onClick={() => onClear(ins)}><ClearIcon /></IconButton>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsSection;
