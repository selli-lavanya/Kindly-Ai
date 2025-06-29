import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import MessageHistory from "../components/MessageHistory";
import jsPDF from "jspdf";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

function HistoryPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterContext, setFilterContext] = useState("all");
  const [exportFormat, setExportFormat] = useState("json");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchMessages = async () => {
        const q = query(
          collection(db, "messages"),
          where("uid", "==", user.uid),
        );
        const querySnapshot = await getDocs(q);
        setMessages(querySnapshot.docs.map((doc) => doc.data()));
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [user]);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.rewrites &&
        msg.rewrites.some((rw) =>
          rw.toLowerCase().includes(searchTerm.toLowerCase()),
        ));
    const matchesContext =
      filterContext === "all" ||
      (msg.context &&
        msg.context.toLowerCase() === filterContext.toLowerCase());
    return matchesSearch && matchesContext;
  });

  const handleExport = (format) => {
    if (format === "json") {
      const data = JSON.stringify(filteredMessages, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "message_history.json";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv") {
      const header = [
        "Context",
        "Text",
        "Emotions",
        "Tone",
        "EmpathyScore",
        "Language",
      ];
      const rows = filteredMessages.map((msg) =>
        [
          msg.context,
          `"${msg.text.replace(/"/g, '""')}"`,
          (msg.emotions || []).join(";"),
          msg.tone,
          msg.empathyScore,
          msg.language,
        ].join(","),
      );
      const csv = "\uFEFF" + [header.join(","), ...rows].join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "message_history.csv";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Message History", 10, 10);
      let y = 20;
      const maxWidth = 180;
      filteredMessages.forEach((msg, idx) => {
        const lines = doc.splitTextToSize(
          `${idx + 1}. [${msg.context}] (${msg.language}) ${msg.text}`,
          maxWidth,
        );
        doc.text(lines, 10, y);
        y += lines.length * 8;
        if (msg.rewrites && msg.rewrites.length > 0) {
          msg.rewrites.forEach((rw, i) => {
            const rwLines = doc.splitTextToSize(
              `   Rewrite ${i + 1}: ${rw}`,
              maxWidth - 10,
            );
            doc.text(rwLines, 12, y);
            y += rwLines.length * 8;
          });
        }
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });
      doc.save("message_history.pdf");
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, width: 852, mx: "auto" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Message History
        </Typography>
        <Box sx={{ width: "100%", mb: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
            sx={{ width: "100%" }}
          >
            <TextField
              label="Search history"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 2 }}
            />
            <TextField
              label="Context"
              variant="outlined"
              size="small"
              select
              value={filterContext}
              onChange={(e) => setFilterContext(e.target.value)}
              sx={{ flex: 1 }}
              SelectProps={{ native: true }}
            >
              <option value="all">All</option>
              <option value="boss">Boss</option>
              <option value="friend">Friend</option>
              <option value="partner">Partner</option>
              <option value="parent">Parent</option>
              <option value="coworker">Coworker</option>
            </TextField>
            <TextField
              select
              label="Export Format"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              size="small"
              sx={{ width: 150 }}
              SelectProps={{ native: true }}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </TextField>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleExport(exportFormat)}
            >
              Export
            </Button>
          </Stack>
        </Box>
        <Box sx={{ mt: 2 }}>
          <MessageHistory messages={filteredMessages} />
        </Box>
      </Paper>
    </Box>
  );
}

export default HistoryPage;
