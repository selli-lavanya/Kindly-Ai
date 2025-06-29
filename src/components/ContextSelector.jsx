import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const contexts = ["Boss", "Friend", "Partner", "Parent", "Coworker"];

const ContextSelector = ({ value, onChange }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Select Relationship Context</Typography>
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="context selector"
      sx={{ mt: 1 }}
    >
      {contexts.map((ctx) => (
        <ToggleButton key={ctx} value={ctx} aria-label={ctx}>
          {ctx}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>
);

export default ContextSelector;
