import React from "react";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import {
  Paper,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  useTheme,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Avatar,
} from "@mui/material";
import Slider from "react-slick";
import CountUp from "react-countup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import ReactIcon from "/react.png";
import FirebaseIcon from "/firebase.png";
import HuggingFaceIcon from "/huggingface.png";
import OpenAIIcon from "/openai.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";

const photos = [
  "/about1.jpg",
  "/about2.jpg",
  "/about3.jpg",
  "/about4.jpg",
  "/about5.jpg",
  "/about6.jpg",
  "/about7.jpg",
  "/about8.jpg",
  "/about9.jpg",
];

const inspirations = [
  "OpenAI GPT-4",
  "Hugging Face Transformers",
  "Material-UI",
  "Firebase",
  "React",
];

const testimonials = [
  {
    name: "Priya S.",
    avatar: "/user1.jpg",
    quote:
      "AI Talk Helper made my work emails so much more empathetic and clear. Love the tone suggestions!",
  },
  {
    name: "Rahul D.",
    avatar: "/user2.jpg",
    quote:
      "The multilingual support is a game changer for my international team.",
  },
  {
    name: "Sara M.",
    avatar: "/user3.jpg",
    quote: "I use the voice input every day. The AI rewrites are spot on!",
  },
];

const techStack = [
  { name: "React", icon: ReactIcon },
  { name: "Firebase", icon: FirebaseIcon },
  { name: "Hugging Face", icon: HuggingFaceIcon },
  { name: "OpenAI", icon: OpenAIIcon },
  { name: "Material-UI", icon: "https://mui.com/static/logo.png" },
];

const faqs = [
  {
    q: "Is my data safe?",
    a: "Yes! We never store your messages without your consent. All processing is secure.",
  },
  {
    q: "Which languages are supported?",
    a: "We support 50+ languages for tone analysis and rewriting.",
  },
  {
    q: "Can I use voice input?",
    a: "Yes, just click the microphone icon in the message input.",
  },
  {
    q: "How do I give feedback?",
    a: "Use the contact form below or email us directly.",
  },
];

function AnimatedCounter({ end, label, color }) {
  return (
    <Box sx={{ textAlign: "center", mx: 2 }}>
      <Typography variant="h4" fontWeight={700} color={color || "primary"}>
        <CountUp end={end} duration={2} />
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

function AboutPage() {
  const theme = useTheme();
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    pauseOnHover: true,
  };
  const testimonialSettings = {
    ...sliderSettings,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh",
        py: 2,
      }}
    >
      {/* Carousel */}
      <Box sx={{ width: "100%", maxWidth: 852, mb: 4 }}>
        <Slider {...sliderSettings}>
          {photos.map((src, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 240,
              }}
            >
              <img
                src={src}
                alt={`about-${idx}`}
                style={{
                  maxHeight: 220,
                  maxWidth: "100%",
                  borderRadius: 16,
                  boxShadow: theme.shadows[3],
                  objectFit: "cover",
                  margin: "auto",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>
      {/* Main Content Cards */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 852,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Heading */}
        <Typography
          variant="h3"
          align="center"
          fontWeight={700}
          color="primary"
          gutterBottom
        >
          About Us
        </Typography>
        {/* Our Vision */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmojiObjectsIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={600}>
                Our Vision
              </Typography>
            </Box>
            <Typography align="left" sx={{ color: "text.secondary" }}>
              To empower everyone to communicate with empathy, clarity, and
              confidence—across any language or context.
            </Typography>
          </CardContent>
        </Card>

        {/* Animated Fun Facts */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 852, width: "100%" }}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <AnimatedCounter
                end={12000}
                label="Messages Rewritten"
                color="primary"
              />
            </Grid>
            <Grid item>
              <AnimatedCounter
                end={52}
                label="Languages Supported"
                color="secondary"
              />
            </Grid>
            <Grid item>
              <AnimatedCounter
                end={5000}
                label="Users Helped"
                color="success"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Testimonials */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 852, width: "100%" }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            sx={{ mb: 2 }}
          >
            What Our Users Say
          </Typography>
          <Slider {...testimonialSettings}>
            {testimonials.map((t, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // ensures center alignment
                  justifyContent: "center",
                  minHeight: 180,
                  py: 2,
                }}
              >
                <FormatQuoteIcon
                  sx={{ color: "grey.400", fontSize: 40, mb: 1 }}
                />
                <Avatar
                  src={t.avatar}
                  sx={{ width: 64, height: 64, mb: 1, mx: "auto" }}
                />
                <Typography variant="subtitle1" fontWeight={600}>
                  {t.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    mt: 1,
                    color: "text.secondary",
                    textAlign: "center",
                    maxWidth: 1400,
                  }}
                >
                  "{t.quote}"
                </Typography>
              </Box>
            ))}
          </Slider>
        </Paper>

        {/* Tech Stack */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 852, width: "100%" }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Our Tech Stack
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {techStack.map((tech, idx) => (
              <Grid item key={idx}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={tech.icon}
                    alt={tech.name}
                    sx={{ width: 48, height: 48, mb: 1, bgcolor: "white" }}
                  />
                  <Typography variant="caption" fontWeight={500}>
                    {tech.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Why We Made It */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <FavoriteIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Why We Made It
              </Typography>
            </Box>
            <Typography>
              We believe that effective communication is the key to better
              relationships, productivity, and well-being. AI Talk Helper was
              created to help you craft messages that are not just correct, but
              also kind, clear, and impactful—whether you’re talking to a boss,
              friend, or loved one.
            </Typography>
          </CardContent>
        </Card>

        {/* Inspirations */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <StarIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Inspirations
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {inspirations.map((item, idx) => (
                <Grid item key={idx}>
                  <Chip label={item} color="primary" variant="outlined" />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Important Things */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <InfoIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Important Things
              </Typography>
            </Box>
            <ul
              style={{
                marginLeft: 24,
                marginBottom: 0,
                color: theme.palette.text.secondary,
              }}
            >
              <li>We never store your messages without your consent.</li>
              <li>All AI processing is done securely using trusted APIs.</li>
              <li>We support multilingual tone analysis and rewriting.</li>
              <li>We’re always improving—your feedback is welcome!</li>
            </ul>
          </CardContent>
        </Card>
      </Box>

      {/* FAQ Section */}
      <Paper
        elevation={2}
        sx={{ p: 3, mt: 4, mb: 3, maxWidth: 700, width: "100%" }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        {faqs.map((faq, idx) => (
          <Accordion key={idx} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{faq.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Video Introduction */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 700, width: "100%" }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Meet AI Talk Helper (Video)
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="AI Talk Helper Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 12, maxWidth: 560 }}
          />
        </Box>
      </Paper>

      {/* Contact/Feedback Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: 700, width: "100%" }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Contact & Feedback
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Your Name" variant="outlined" size="small" />
          <TextField label="Your Email" variant="outlined" size="small" />
          <TextField
            label="Message or Feedback"
            variant="outlined"
            multiline
            minRows={3}
          />
          <Button variant="contained" color="primary" startIcon={<EmailIcon />}>
            Send
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            href="mailto:info@aitalkhelper.com"
            startIcon={<EmailIcon />}
            color="info"
          >
            Email
          </Button>
          <Button
            href="https://facebook.com"
            target="_blank"
            startIcon={<FacebookIcon />}
            color="primary"
          >
            Facebook
          </Button>
          <Button
            href="https://twitter.com"
            target="_blank"
            startIcon={<TwitterIcon />}
            color="primary"
          >
            Twitter
          </Button>
          <Button
            href="https://github.com"
            target="_blank"
            startIcon={<GitHubIcon />}
            color="inherit"
          >
            GitHub
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 4, width: "100%", maxWidth: 700 }} />

      <Typography
        align="center"
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Built with ❤️ by the AI Talk Helper Team.
      </Typography>
    </Box>
  );
}

export default AboutPage;
