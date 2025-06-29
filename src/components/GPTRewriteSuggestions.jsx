import React from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const styleLabels = {
  softer: "Softer",
  confident: "Confident",
  clear: "Clear",
};

const GPTRewriteSuggestions = ({
  rewrites = [],
  onSelect,
  currentStyle,
  loading,
}) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1" gutterBottom>
      Rewrite Suggestions
    </Typography>
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <Button
        variant={currentStyle === "softer" ? "contained" : "outlined"}
        onClick={() => onSelect("softer")}
        disabled={loading}
        size="large"
        sx={{ minHeight: 50, minWidth: 140 }}
      >
        Make it Softer
      </Button>
      <Button
        variant={currentStyle === "confident" ? "contained" : "outlined"}
        onClick={() => onSelect("confident")}
        disabled={loading}
        size="large"
        sx={{ minHeight: 50, minWidth: 140 }}
      >
        Make it Confident
      </Button>
      <Button
        variant={currentStyle === "clear" ? "contained" : "outlined"}
        onClick={() => onSelect("clear")}
        disabled={loading}
        size="large"
        sx={{ minHeight: 50, minWidth: 140 }}
      >
        Make it Clear
      </Button>
    </Box>
    {loading ? (
      <CircularProgress size={28} />
    ) : (
      rewrites &&
      rewrites.length > 0 && (
        <Paper sx={{ p: 2, mt: 1 }}>
          <Typography variant="body1">{rewrites[0]}</Typography>
        </Paper>
      )
    )}
  </Box>
);

export default GPTRewriteSuggestions;
