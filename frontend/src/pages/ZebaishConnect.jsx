import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { WhatsApp, Send, ContentCopy } from "@mui/icons-material";

export default function ZebaishConnect() {
  const [clientData, setClientData] = useState({
    name: "",
    phone: "",
    religion: "Muslim",
    isIicc: "No",
  });

  const [generatedMessage, setGeneratedMessage] = useState("");

  const handleInputChange = (field, value) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateMessage = () => {
    const { name, phone, religion, isIicc } = clientData;
    const customerName = name.trim() || "[Customer Name]";
    const bookingLink = "https://free-flies-say.loca.lt/book-event?category=Normal%20Booking";

    let msg = "";

    if (religion === "Muslim" && isIicc === "Yes") {
      // Option C: Muslim + IICC
      msg = `Assalamu Alaikum,\n\nCongratulations on your booking at India Islamic Cultural Centre 🎉\n\nThis is Zebaish Caterers — Empanelled Caterer at IICC. We specialize in Indian, Mughlai & Veg cuisine with a focus on taste, quality & presentation.\n\nTo personalize your event, ${customerName}, please select your preferred menu options using our convenient online link:\n${bookingLink}\n\nYou can also view our work here: https://www.instagram.com/zebaish.caterers\n\nContact: +91 99999 50056 | +91 98999 54606\n\nZebaish Caterers - IICC Empanelled`;
    } else if (religion === "Muslim") {
      // Option A: Muslim + Non-IICC
      msg = `Assalamu Alaikum,\n\nZebaish Caterers extends warm congratulations on your upcoming event!\n\nWe are honored to introduce our exceptional catering services. Specializing in authentic Indian, Mughlai, and vegetarian cuisine, we partner with Delhi's finest chefs to deliver:\n* Exceptional taste\n* Unparalleled quality\n* Immaculate presentation\n\nExplore our Instagram page for culinary inspiration:\nhttps://www.instagram.com/zebaish.caterers?igsh=NnFrZGQ0mTj2NEel\n\nTo personalize your event, ${customerName}, please select your preferred menu options using our convenient online link:\n${bookingLink}\n\nContact Us:\n+91 99999 50056 | +91 98999 54606\n\nZebaish Caterers — A Unit of Allied Trading Corporation`;
    } else {
      // Non-Muslim Profile (Warm Greetings)
      msg = `Warm Greetings,\n\nZebaish Caterers extends warm congratulations on your upcoming event!\n\nWe are honored to introduce our exceptional catering services. Specializing in authentic Indian, Mughlai, and vegetarian cuisine, we partner with Delhi's finest chefs to deliver:\n* Exceptional taste\n* Unparalleled quality\n* Immaculate presentation\n\nExplore our Instagram page for culinary inspiration:\nhttps://www.instagram.com/zebaish.caterers?igsh=NnFrZGQ0mTj2NEel\n\nTo personalize your event, ${customerName}, please select your preferred menu options using our convenient online link:\n${bookingLink}\n\nContact Us:\n+91 99999 50056 | +91 98999 54606\n\nZebaish Caterers — A Unit of Allied Trading Corporation`;
    }

    setGeneratedMessage(msg);
  };

  const handleSendWhatsApp = () => {
    const rawPhone = clientData.phone.replace(/\D/g, "");
    const cleanPhone = rawPhone ? (rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone) : '';
    const encodedMessage = encodeURIComponent(generatedMessage);
    const whatsappUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    window.location.href = whatsappUrl;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedMessage);
    alert("Message copied to clipboard!");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Zebaish Connect
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Channel Partner Inquiry & WhatsApp Message Generator
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Customer Full Name"
              value={clientData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Customer Phone Number (with Country Code)"
              placeholder="+919999950056"
              value={clientData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Client Profile / Religion</InputLabel>
              <Select
                value={clientData.religion}
                label="Client Profile / Religion"
                onChange={(e) => handleInputChange("religion", e.target.value)}
              >
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Non-Muslim">Non-Muslim / Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Booking at IICC Venue?</InputLabel>
              <Select
                value={clientData.isIicc}
                label="Booking at IICC Venue?"
                onChange={(e) => handleInputChange("isIicc", e.target.value)}
              >
                <MenuItem value="No">No (General Venue)</MenuItem>
                <MenuItem value="Yes">Yes (India Islamic Cultural Centre)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGenerateMessage}
            sx={{ py: 1.5, px: 4, fontWeight: "bold" }}
          >
            Generate Custom WhatsApp Message
          </Button>
        </Box>

        {generatedMessage && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Preview & Send Message
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: "#f9fafb", p: 2, mb: 2, whiteSpace: "pre-line" }}>
              <CardContent>{generatedMessage}</CardContent>
            </Card>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyText}
                >
                  Copy Message
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<WhatsApp />}
                  onClick={handleSendWhatsApp}
                  sx={{ fontWeight: "bold" }}
                >
                  Send via WhatsApp
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
}