import React from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const MessageHistory = ({ messages = [] }) => (
  <Box sx={{ my: 2 }}>
    <Typography variant="subtitle1">Message History</Typography>
    <List>
      {messages.length === 0 ? (
        <ListItem>
          <ListItemText primary="No messages yet." />
        </ListItem>
      ) : (
        messages.map((msg, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={msg.text} secondary={msg.date} />
          </ListItem>
        ))
      )}
    </List>
  </Box>
);

export default MessageHistory;
