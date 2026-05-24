import {
  Alert,
  Box,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import CoinsSection from "../components/dashboard/CoinsSection.tsx";
import InsightsSection from "../components/dashboard/InsightsSection.tsx";
import MemeSection from "../components/dashboard/MemeSection.tsx";
import NewsSection from "../components/dashboard/NewsSection.tsx";
import AddCoinDialog from "../components/dashboard/AddCoinDialog.tsx";
import SectionSettingsDialog from "../components/dashboard/SectionSettingsDialog.tsx";
import useDashboardData from "../hooks/useDashboardData.ts";

const Dashboard = () => {
  const {
    coins,
    allCoins,
    insights,
    news,
    meme,
    loading,
    refreshing,
    refreshingMeme,
    refreshingNews,
    refreshingInsights,
    snackbar,
    closeSnackbar,
    showPrices,
    showNews,
    showInsights,
    showMemes,
    contentTypes,
    selectedCoinSymbols,
    handleRefreshPrices,
    handleRefreshMeme,
    handleRefreshNews,
    handleRefreshInsights,
    handleToggleCoin,
    handleToggleSection,
    handleVote,
  } = useDashboardData();

  const [coinDialogOpen, setCoinDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Tooltip title="Dashboard settings">
          <IconButton onClick={() => setSettingsOpen(true)} size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2.5}>
        {showPrices && (
          <Grid size={12}>
            <CoinsSection
              items={coins}
              loading={loading.coins}
              onLike={(c) => handleVote(c, "like")}
              onDislike={(c) => handleVote(c, "dislike")}
              onClear={(c) => handleVote(c, "clear")}
              onRefresh={handleRefreshPrices}
              refreshing={refreshing}
              onAddCoin={() => setCoinDialogOpen(true)}
            />
          </Grid>
        )}

        {showNews && (
          <Grid size={{ xs: 12, lg: showInsights ? 7 : 12 }}>
            <NewsSection
              items={news}
              loading={loading.news}
              onLike={(n) => handleVote(n, "like")}
              onDislike={(n) => handleVote(n, "dislike")}
              onClear={(n) => handleVote(n, "clear")}
              onRefresh={handleRefreshNews}
              refreshing={refreshingNews}
            />
          </Grid>
        )}

        {showInsights && (
          <Grid size={{ xs: 12, lg: showNews ? 5 : 12 }}>
            <InsightsSection
              items={insights}
              loading={loading.insights}
              onLike={(i) => handleVote(i, "like")}
              onDislike={(i) => handleVote(i, "dislike")}
              onClear={(i) => handleVote(i, "clear")}
              onRefresh={handleRefreshInsights}
              refreshing={refreshingInsights}
            />
          </Grid>
        )}

        {showMemes && (
          <Grid size={12}>
            <MemeSection
              item={meme}
              loading={loading.meme}
              onLike={(m) => handleVote(m, "like")}
              onDislike={(m) => handleVote(m, "dislike")}
              onClear={(m) => handleVote(m, "clear")}
              onRefresh={handleRefreshMeme}
              refreshing={refreshingMeme}
            />
          </Grid>
        )}
      </Grid>

      <AddCoinDialog
        open={coinDialogOpen}
        onClose={() => setCoinDialogOpen(false)}
        allCoins={allCoins}
        selectedSymbols={selectedCoinSymbols}
        onToggle={handleToggleCoin}
      />

      <SectionSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTypes={contentTypes.length > 0 ? contentTypes : ["Prices", "News", "Insights", "Memes"]}
        onToggle={handleToggleSection}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
