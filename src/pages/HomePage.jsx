import React, { useState, useEffect } from "react";
import MessageInput from "../components/MessageInput";
import ContextSelector from "../components/ContextSelector";
import EmpathyScore from "../components/EmpathyScore";
import EmotionalAnalysis from "../components/EmotionalAnalysis";
import GPTRewriteSuggestions from "../components/GPTRewriteSuggestions";
import ConversationTemplates from "../components/ConversationTemplates";
import MessageHistory from "../components/MessageHistory";
import LanguageSelector from "../components/LanguageSelector";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { auth, provider, db } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { analyzeMessageHuggingFace, getCohereRewrite } from "../aiUtils";
import "../App.css";
import TextField from "@mui/material/TextField";
import jsPDF from "jspdf";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { Divider } from "@mui/material";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function HomePage() {
  const [user, setUser] = useState(null);
  const [context, setContext] = useState("Friend");
  const [language, setLanguage] = useState("en");
  const [score, setScore] = useState(null);
  const [emotions, setEmotions] = useState([]);
  const [tone, setTone] = useState("");
  const [analysisReady, setAnalysisReady] = useState(false);
  const [messages, setMessages] = useState([]);
  const [gptRewrites, setGptRewrites] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showError, setShowError] = useState(false);
  const [style, setStyle] = useState("softer");
  const [lastMessage, setLastMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportFormat, setExportFormat] = useState("json");
  const [filterContext, setFilterContext] = useState("all");

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
        // Sort by createdAt descending (most recent first)
        const sorted = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate
              ? a.createdAt.toDate().getTime()
              : a.createdAt?.seconds
                ? a.createdAt.seconds * 1000
                : 0;
            const bTime = b.createdAt?.toDate
              ? b.createdAt.toDate().getTime()
              : b.createdAt?.seconds
                ? b.createdAt.seconds * 1000
                : 0;
            return bTime - aTime;
          });
        setMessages(sorted);
      };
      fetchMessages();
    } else {
      setMessages([]);
      setAnalysisReady(false);
      setScore(null);
      setEmotions([]);
      setTone("");
    }
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, provider);
  const handleLogout = () => signOut(auth);

  const handleSendMessage = async (text) => {
    if (!user) return;
    setLoadingAI(true);
    setApiError("");
    try {
      const hfApiKey = import.meta.env.VITE_HF_API_KEY;
      const { result: hfResult, usedFallback } =
        await analyzeMessageHuggingFace(text, hfApiKey, language);
      if (!hfResult || !Array.isArray(hfResult) || hfResult.length === 0) {
        setApiError("Could not analyze emotion. Please try again.");
        setShowError(true);
        setEmotions([]);
        setTone("");
        setScore(null);
        setAnalysisReady(false);
        setLoadingAI(false);
        return;
      }

      if (usedFallback && language !== "en") {
        setApiError(
          "Multilingual emotion analysis is currently unavailable. Results may be inaccurate for non-English messages.",
        );
        setShowError(true);
      }

      let emotions = [];
      let tone = "";
      let empathyScore = 7;

      let parsed =
        Array.isArray(hfResult) && Array.isArray(hfResult[0])
          ? hfResult[0]
          : hfResult;

      if (Array.isArray(parsed) && parsed.length > 0) {
        const sorted = [...parsed].sort(
          (a, b) => (b.score ?? 0) - (a.score ?? 0),
        );
        emotions = sorted.map((e) => e.label);
        tone = sorted[0].label;
        empathyScore = Math.round((sorted[0].score ?? 0.7) * 10);
      }
      setEmotions(emotions);
      setTone(tone);
      setScore(empathyScore);
      setAnalysisReady(true);

      const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;
      const rewrites = await getCohereRewrite(
        text,
        context,
        style,
        cohereApiKey,
      );
      setGptRewrites(rewrites);
      setLastMessage(text);

      const message = {
        uid: user.uid,
        text,
        context,
        language,
        createdAt: serverTimestamp(),
        empathyScore,
        emotions,
        tone,
        rewrites,
        style,
      };
      await addDoc(collection(db, "messages"), message);
      setMessages((prev) => [{ ...message, createdAt: new Date() }, ...prev]);
      setInputValue("");
    } catch (err) {
      let msg = "";
      if (err.message.includes("429")) {
        msg =
          "You have reached the Cohere free tier rate limit. Please wait a few minutes and try again. If this happens often, consider upgrading your Cohere account or try again later.";
      } else if (err.message.includes("401")) {
        msg =
          "Cohere API authentication failed. Please check your API key in the .env file.";
      } else if (err.message.includes("quota")) {
        msg =
          "You have reached your Cohere usage quota. Please wait for your quota to reset or upgrade your plan.";
      } else {
        msg =
          "The AI rewrite service is temporarily unavailable. Please try again later.";
      }
      setApiError(msg);
      setShowError(true);
    }
    setLoadingAI(false);
  };

  const handleRewriteStyle = async (newStyle) => {
    if (!lastMessage) return;
    setLoadingAI(true);
    setApiError("");
    try {
      const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;
      const rewrites = await getCohereRewrite(
        lastMessage,
        context,
        newStyle,
        cohereApiKey,
      );
      setGptRewrites(rewrites);
      setStyle(newStyle);
    } catch (err) {
      setApiError("Failed to generate rewrite. Please try again.");
      setShowError(true);
    }
    setLoadingAI(false);
  };

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
        <Stack spacing={4}>
          {/* Header */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              Kindly AI
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Your AI-powered communication assistant
            </Typography>
          </Box>

          {/* Auth */}
          <Box sx={{ textAlign: "center" }}>
            {!user ? (
              <Button
                variant="contained"
                size="large"
                onClick={handleLogin}
                sx={{ mb: 2, minWidth: 220, minHeight: 48 }}
              >
                Sign in with Google
              </Button>
            ) : (
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="subtitle1">
                  Welcome, {user.displayName}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  size="large"
                  sx={{
                    minWidth: 140,
                    minHeight: 48,
                    fontWeight: 600,
                    fontSize: 16,
                    borderWidth: 2,
                    borderColor: "error.main",
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                      borderColor: "error.dark",
                    },
                  }}
                >
                  Logout
                </Button>
              </Stack>
            )}
          </Box>

          <Divider />

          {/* Controls - visually separated */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              mb: 3,
              maxWidth: 500,
              width: "100%",
              mx: "auto",
              bgcolor: (theme) =>
                theme.palette.mode === "dark" ? "#23272f" : "#f5f7fa",
              border: (theme) => `1.5px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.primary" }}
                >
                  Language
                </Typography>
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                  fullWidth
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.primary" }}
                >
                  Relationship Context
                </Typography>
                <ContextSelector
                  value={context}
                  onChange={(_, v) => v && setContext(v)}
                  fullWidth
                />
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.primary" }}
                >
                  Rewrite Style
                </Typography>
                <TextField
                  select
                  size="small"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <option value="softer">Softer</option>
                  <option value="confident">Confident</option>
                  <option value="clear">Clear</option>
                </TextField>
              </Box>
            </Stack>
          </Paper>

          {/* Message Input & Suggestions */}
          <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, bgcolor: "#fff" }}>
            <Stack spacing={2}>
              <MessageInput
                onSend={handleSendMessage}
                disabled={!user || loadingAI}
                value={inputValue}
                setValue={setInputValue}
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <GPTRewriteSuggestions
                  onSelect={handleRewriteStyle}
                  rewrites={gptRewrites}
                  currentStyle={style}
                  loading={loadingAI}
                />
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setAnalysisReady(false);
                      setScore(null);
                      setEmotions([]);
                      setTone("");
                      setGptRewrites([]);
                      setLastMessage("");
                      setInputValue("");
                    }}
                    size="large"
                    sx={{
                      minWidth: 160,
                      minHeight: 50,
                      fontWeight: 600,
                      fontSize: 16,
                      borderWidth: 2,
                      borderColor: "error.main",
                      "&:hover": {
                        backgroundColor: "error.main",
                        color: "white",
                        borderColor: "error.dark",
                      },
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Paper>

          {/* Analysis Results */}
          {analysisReady && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Paper
                elevation={2}
                sx={{ flex: 1, p: 3, bgcolor: "#e3f2fd", minWidth: 220 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="primary"
                  gutterBottom
                  align="center"
                >
                  Empathy Score
                </Typography>
                <EmpathyScore score={score} />
              </Paper>
              <Paper
                elevation={2}
                sx={{ flex: 2, p: 3, bgcolor: "#e3f2fd", minWidth: 220 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="dark"
                  gutterBottom
                  align="center"
                >
                  Emotional Analysis
                </Typography>
                <EmotionalAnalysis emotions={emotions} tone={tone} />
              </Paper>
            </Stack>
          )}

          {/* Conversation Templates */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fbe7" }}>
            <ConversationTemplates onSelect={setInputValue} />
          </Paper>

          <Divider />

          {/* Snackbar for errors */}
          <Snackbar
            open={showError}
            autoHideDuration={6000}
            onClose={() => setShowError(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setShowError(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {apiError}
            </Alert>
          </Snackbar>
        </Stack>
      </Paper>
    </Box>
  );
}

export default HomePage;
