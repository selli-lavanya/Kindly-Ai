import React from "react";
import { Box, Typography, Chip } from "@mui/material";

const EmotionalAnalysis = ({ emotions = [], tone = "" }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Emotional Analysis</Typography>
    <div>
      {emotions.length === 0 && !tone && (
        <Typography variant="body2" color="text.secondary">
          No emotional analysis available.
        </Typography>
      )}
      {emotions.map((emotion, idx) => (
        <Chip key={emotion + idx} label={emotion} sx={{ mr: 1, mb: 1 }} />
      ))}
      {tone && (
        <Typography variant="body2" sx={{ display: "inline", ml: 2 }}>
          Tone: {tone}
        </Typography>
      )}
    </div>
  </Box>
);

export default EmotionalAnalysis;
