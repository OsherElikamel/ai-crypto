import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

interface AddCoinDialogProps {
  open: boolean;
  onClose: () => void;
  allCoins: { symbol: string; name: string }[];
  selectedSymbols: string[];
  onToggle: (symbol: string) => void;
}

export default function AddCoinDialog({ open, onClose, allCoins, selectedSymbols, onToggle }: AddCoinDialogProps) {
  const selected = new Set(selectedSymbols);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Manage Tracked Coins</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ px: 3, pb: 1 }}>
          Select the coins you want to see on your dashboard
        </Typography>
        <List dense>
          {allCoins.map((c) => (
            <ListItemButton key={c.symbol} onClick={() => onToggle(c.symbol)}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox edge="start" checked={selected.has(c.symbol)} disableRipple tabIndex={-1} />
              </ListItemIcon>
              <ListItemText
                primary={c.symbol}
                secondary={c.name}
                primaryTypographyProps={{ fontWeight: 700, variant: "body2" }}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
