import {
  Alert,
  Card,
  CardContent,
  CardActions,
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

const MemeSection = ({ item, loading, onLike, onDislike, onClear }) => {
  return (
    <Card>
      <CardHeader title="Fun Crypto Meme" />
      <Divider />
      <CardContent>
        {loading ? (
          <Skeleton variant="rectangular" height={240} />
        ) : !item ? (
          <Alert severity="info">No meme available</Alert>
        ) : (
          <Stack spacing={1}>
            {item.title && (
              <Typography variant="subtitle1">{item.title}</Typography>
            )}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.title || "meme"}
                style={{
                  width: "100%",
                  height: 240,
                  objectFit: "cover",
                  display: "block",
                  borderRadius: 8,
                }}
              />
            )}
            <Stack direction="row" gap={1} flexWrap="wrap">
              {(item.tags || []).map((t) => (
                <Chip key={t} size="small" label={`#${t}`} />
              ))}
              {item.source && <Chip size="small" label={item.source} />}
            </Stack>
          </Stack>
        )}
      </CardContent>
      <CardActions>
        <IconButton aria-label="like" onClick={() => item && onLike(item)}>
          <ThumbUpOffAltIcon />
        </IconButton>
        <Typography variant="caption">
          {(item?.likedBy?.length ?? 0).toString()}
        </Typography>
        <IconButton aria-label="dislike" onClick={() => item && onDislike(item)}>
          <ThumbDownOffAltIcon />
        </IconButton>
        <Typography variant="caption">
          {(item?.dislikedBy?.length ?? 0).toString()}
        </Typography>
        <IconButton aria-label="clear vote" onClick={() => item && onClear(item)}>
          <ClearIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MemeSection;
