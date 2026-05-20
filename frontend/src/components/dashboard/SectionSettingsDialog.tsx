import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const SECTIONS = [
  { key: "Prices", label: "Coin Prices", icon: <MonetizationOnIcon /> },
  { key: "News", label: "Market News", icon: <NewspaperIcon /> },
  { key: "Insights", label: "AI Insights", icon: <AutoAwesomeIcon /> },
  { key: "Memes", label: "Meme of the Day", icon: <SentimentVerySatisfiedIcon /> },
] as const;

interface SectionSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  activeTypes: string[];
  onToggle: (type: string) => void;
}

export default function SectionSettingsDialog({ open, onClose, activeTypes, onToggle }: SectionSettingsDialogProps) {
  const active = new Set(activeTypes);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Dashboard Sections</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List>
          {SECTIONS.map((s) => (
            <ListItem key={s.key}>
              <ListItemIcon sx={{ minWidth: 40 }}>{s.icon}</ListItemIcon>
              <ListItemText primary={s.label} />
              <Switch
                edge="end"
                checked={active.has(s.key)}
                onChange={() => onToggle(s.key)}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
