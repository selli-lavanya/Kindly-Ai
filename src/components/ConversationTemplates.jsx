import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const templates = [
  {
    label: "Apology",
    text: "I'm sorry for not responding sooner. I hope you understand.",
  },
  {
    label: "Asking for a favor",
    text: "Could you please help me with something when you have a moment?",
  },
  {
    label: "Giving feedback",
    text: "I appreciate your effort. May I offer some feedback?",
  },
  {
    label: "Ending a friendship",
    text: "I think it's best for both of us if we go our separate ways. I wish you well.",
  },
];

const ConversationTemplates = ({ onSelect }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Conversation Templates</Typography>
    <List>
      {templates.map((template) => (
        <ListItemButton
          key={template.label}
          onClick={() => onSelect(template.text)}
        >
          <ListItemText primary={template.label} />
        </ListItemButton>
      ))}
    </List>
  </Box>
);

export default ConversationTemplates;
