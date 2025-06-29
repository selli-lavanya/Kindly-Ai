import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

const EmpathyScore = ({ score }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Empathy Score: {score}/10</Typography>
    <LinearProgress
      variant="determinate"
      value={score * 10}
      sx={{ height: 10, borderRadius: 5 }}
    />
  </Box>
);

export default EmpathyScore;
