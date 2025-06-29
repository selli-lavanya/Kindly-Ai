import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";
import themeOptions from "../themeOptions";

// Add these fonts to your index.html for handwriting support:
// <link href="https://fonts.googleapis.com/css?family=Indie+Flower|Caveat|Pacifico|Shadows+Into+Light|Dancing+Script|Satisfy|Architects+Daughter&display=swap" rel="stylesheet">

const handwritingFonts = [
  { label: "Default", value: "Inter, Roboto, Arial, sans-serif" },
  { label: "Indie Flower", value: '"Indie Flower", cursive' },
  { label: "Caveat", value: '"Caveat", cursive' },
  { label: "Pacifico", value: '"Pacifico", cursive' },
  { label: "Shadows Into Light", value: '"Shadows Into Light", cursive' },
  { label: "Dancing Script", value: '"Dancing Script", cursive' },
  { label: "Satisfy", value: '"Satisfy", cursive' },
  { label: "Architects Daughter", value: '"Architects Daughter", cursive' },
];

function SettingsPage({ mode, setMode, fontFamily, setFontFamily }) {
  const selectedTheme =
    themeOptions.find((t) => t.value === mode) || themeOptions[0];
  const [background, surface, uiText, inputText] = selectedTheme.colors;

  return (
    <Box sx={{ bgcolor: background, minHeight: "100vh", p: { xs: 1, sm: 3 } }}>
      {/* Theme Section */}
      <Paper
        elevation={4}
        sx={{ p: { xs: 2, sm: 4 }, bgcolor: surface, mb: 4, mx: "auto" }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: uiText }}
        >
          Theme
        </Typography>
        <Typography variant="subtitle1" sx={{ color: uiText, mb: 2 }}>
          Choose a theme for your app interface
        </Typography>
        <Grid container spacing={2}>
          {themeOptions.map((theme) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={theme.value}>
              <Box
                onClick={() => setMode(theme.value)}
                sx={{
                  cursor: "pointer",
                  border:
                    mode === theme.value
                      ? `2px solid ${theme.colors[2]}`
                      : "2px solid #e0e0e0",
                  borderRadius: 1,
                  p: 1,
                  mb: 1,
                  boxShadow: mode === theme.value ? 4 : 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 140,
                  minHeight: 44,
                  bgcolor: theme.colors[0],
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
              >
                {theme.colors.map((color, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: color,
                      borderRadius: 1,
                      border: "1px solid #ccc",
                      mx: 0.3,
                      display: "inline-block",
                    }}
                  />
                ))}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: 13,
                  textAlign: "center",
                  color: theme.colors[2],
                }}
              >
                {theme.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Font Style Section */}
      <Paper
        elevation={4}
        sx={{ p: { xs: 2, sm: 4 }, bgcolor: surface, mb: 4 }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: uiText }}>
          Font Style
        </Typography>
        <Typography variant="subtitle1" sx={{ color: uiText, mb: 2 }}>
          Choose a font for your app interface
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {handwritingFonts.map((font) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={font.value}>
              <Box
                onClick={() => setFontFamily(font.value)}
                sx={{
                  cursor: "pointer",
                  border:
                    fontFamily === font.value
                      ? `2px solid ${uiText}`
                      : "2px solid #e0e0e0",
                  borderRadius: 2,
                  p: 1.5,
                  mb: 1,
                  boxShadow: fontFamily === font.value ? 4 : 1,
                  bgcolor: background,
                  transition: "border 0.2s, box-shadow 0.2s",
                  textAlign: "center",
                  fontFamily: font.value,
                  fontSize: 20,
                  color: uiText,
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {font.label}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Preview Section */}
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: surface,
          border: `2px solid ${uiText}`,
          borderRadius: 2,
          mb: 2,
          fontFamily: fontFamily,
          boxShadow: 3,
          transition: "border 0.2s",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: uiText }}>
          Preview
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: uiText,
              borderRadius: "50%",
              mr: 2,
            }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: uiText, fontFamily }}
            >
              Dear Friend
            </Typography>
            <Typography variant="caption" sx={{ color: inputText, fontFamily }}>
              Online
            </Typography>
          </Box>
        </Box>
        <Paper
          elevation={1}
          sx={{ p: 1.5, bgcolor: background, maxWidth: 300, fontFamily }}
        >
          <Typography variant="body1" sx={{ color: uiText, fontFamily }}>
            Hey! How's it going?
          </Typography>
          <Typography variant="caption" sx={{ color: inputText, fontFamily }}>
            1:08 PM
          </Typography>
        </Paper>
      </Paper>
    </Box>
  );
}

export default SettingsPage;
