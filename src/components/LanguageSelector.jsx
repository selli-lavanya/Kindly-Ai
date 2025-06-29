import React from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
];

const LanguageSelector = ({ value, onChange }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Select Language</Typography>
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, v) => v && onChange(v)}
      aria-label="language selector"
      sx={{ mt: 1 }}
    >
      {languages.map((lang) => (
        <ToggleButton key={lang.code} value={lang.code} aria-label={lang.label}>
          {lang.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  </Box>
);

export default LanguageSelector;
