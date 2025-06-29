import React, { useRef, useState } from "react";
import { Button, TextField, Box, Typography, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";

const MessageInput = ({ onSend, disabled, value, setValue }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue("");
    }
  };

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      setValue(event.results[0][0].transcript); // Use setValue from props!
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Enter your message</Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          label="Type your message..."
          multiline
          rows={3}
          variant="outlined"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          fullWidth
        />
        <IconButton onClick={handleVoiceInput} disabled={disabled || listening}>
          <MicIcon color={listening ? "primary" : "inherit"} />
        </IconButton>
      </Box>
      <Button
        variant="contained"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
      >
        Send
      </Button>
    </Box>
  );
};

export default MessageInput;
