import React, { useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
} from "@mui/material";
import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";
import themeOptions from "./themeOptions";
import ForumIcon from "@mui/icons-material/Forum";
const defaultFont = "Inter, Roboto, Arial, sans-serif";

function getThemeSettings(mode, fontFamily) {
  const theme = themeOptions.find((t) => t.value === mode) || themeOptions[0];
  return {
    palette: {
      mode: mode === "dark" ? "dark" : "light",
      background: { default: theme.colors[0], paper: theme.colors[1] },
      primary: { main: theme.colors[2] },
      text: { primary: theme.colors[2], secondary: theme.colors[3] },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: fontFamily || defaultFont },
  };
}

function AppNav() {
  const location = useLocation();
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 1,
        mt: 2,
        mb: 4,
        overflow: "hidden",
        position: "relative",
        width: "100%", // Ensure it fills the container
      }}
    >
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{
          borderRadius: 1,
          background: (theme) => theme.palette.primary.main,
          boxShadow: 2,
        }}
      >
        <Toolbar
          sx={{
            minHeight: 64,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ForumIcon sx={{ fontSize: 28, color: "white" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "white", letterSpacing: 1 }}
            >
              Kindly AI
            </Typography>
          </Box>
          <Box>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={{
                fontWeight: location.pathname === "/" ? 700 : 500,
                borderBottom:
                  location.pathname === "/" ? "2px solid #fff" : "none",
                borderRadius: 0,
                mx: 1,
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/history"
              sx={{
                fontWeight: location.pathname === "/history" ? 700 : 500,
                borderBottom:
                  location.pathname === "/history" ? "2px solid #fff" : "none",
                borderRadius: 0,
                mx: 1,
              }}
            >
              History
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/settings"
              sx={{
                fontWeight: location.pathname === "/settings" ? 700 : 500,
                borderBottom:
                  location.pathname === "/settings" ? "2px solid #fff" : "none",
                borderRadius: 0,
                mx: 1,
              }}
            >
              Settings
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              sx={{
                fontWeight: location.pathname === "/about" ? 700 : 500,
                borderBottom:
                  location.pathname === "/about" ? "2px solid #fff" : "none",
                borderRadius: 0,
                mx: 1,
              }}
            >
              About
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}

function App() {
  const [themeMode, setThemeMode] = useState("light");
  const [fontFamily, setFontFamily] = useState(defaultFont);

  const theme = useMemo(
    () => createTheme(getThemeSettings(themeMode, fontFamily)),
    [themeMode, fontFamily],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppNav />
        <Container maxWidth="md" sx={{ py: 3 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route
              path="/settings"
              element={
                <SettingsPage
                  mode={themeMode}
                  setMode={setThemeMode}
                  fontFamily={fontFamily}
                  setFontFamily={setFontFamily}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
