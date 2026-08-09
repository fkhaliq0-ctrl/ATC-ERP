import React, { useState, useEffect } from "react";
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  Grid,
  Container,
} from "@mui/material";
import {
  CalendarToday as Calendar,
  Person,
  Phone,
  LocationOn,
  Group,
  RestaurantMenu,
  CheckCircle,
} from "@mui/icons-material";
import { MASTER_MENU_SECTIONS } from "../data/masterMenu";

export default function CustomerBookingForm() {
  // Master Menu Categories integrated

  const [submitted, setSubmitted] = useState(false);

  const functionTypes = [
    "Wedding",
    "Reception",
    "Corporate Event",
    "Engagement",
    "Birthday Party",
    "Anniversary",
    "Other",
  ];

  const gatheringTypes = [
    "Mixed Gathering",
    "Segregated (Ladies & Gents)",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (category, item) => {
    setFormData((prev) => {
      const currentList = prev[category] || [];
      const updatedList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return { ...prev, [category]: updatedList };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const existingSubmissions = JSON.parse(
        localStorage.getItem("menuSubmissions") || "[]"
      );
      const newSubmission = {
        ...formData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "menuSubmissions",
        JSON.stringify([...existingSubmissions, newSubmission])
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Error saving booking form submission:", err);
      alert("Error submitting form. Please try again.");
    }
  };

  if (submitted) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Thank You!
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Your event details and menu selections have been submitted successfully.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Our team at <strong>Zebaish Caterers</strong> will review your selections and contact you shortly with a personalized quote.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => {
              setSubmitted(false);
              setFormData({
                clientName: "",
                clientPhone: "",
                eventDate: "",
                functionType: "",
                gatheringArrangement: "",
                venueName: "",
                guestCount: "",
                welcomeDrinks: [],
                starters: [],
                mainCourse: [],
                desserts: [],
                specialNotes: "",
              });
            }}
          >
            Submit Another Booking
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Zebaish Caterers
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Event Booking & Menu Selection Form
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Section 1: Event Details */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Person color="primary" /> Client & Event Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                required
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                required
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Event Date"
                required
                InputLabelProps={{ shrink: true }}
                value={formData.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Function Type</InputLabel>
                <Select
                  value={formData.functionType}
                  label="Function Type"
                  onChange={(e) => handleInputChange("functionType", e.target.value)}
                >
                  {functionTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gathering Arrangement</InputLabel>
                <Select
                  value={formData.gatheringArrangement}
                  label="Gathering Arrangement"
                  onChange={(e) => handleInputChange("gatheringArrangement", e.target.value)}
                >
                  {gatheringTypes.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Venue Name / Location"
                required
                value={formData.venueName}
                onChange={(e) => handleInputChange("venueName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Expected Guest Count (Pax)"
                required
                value={formData.guestCount}
                onChange={(e) => handleInputChange("guestCount", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Menu Preferences */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantMenu color="primary" /> Menu Selection
          </Typography>

          <Box sx={{ mb: 3 }}>
            {Object.entries(MASTER_MENU_SECTIONS).map(([categoryName, subCategories]) => (
              <Box key={categoryName} sx={{ mb: 4, p: 2, border: "1px solid #e5e7eb", borderRadius: 2, bgcolor: "white" }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, borderBottom: "1px solid #e5e7eb", pb: 1 }}>
                  {categoryName}
                </Typography>
                {Array.isArray(subCategories) ? (
                  <FormGroup row>
                    {subCategories.map((item) => (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox
                            checked={formData.welcomeDrinks.includes(item) || formData.starters.includes(item) || formData.mainCourse.includes(item) || formData.desserts.includes(item)}
                            onChange={() => {
                              const categoryKey = ["welcomeDrinks", "starters", "mainCourse", "desserts"].find((key) =>
                                formData[key].includes(item)
                              );
                              if (categoryKey) {
                                handleCheckboxChange(categoryKey, item);
                              } else {
                                handleCheckboxChange("welcomeDrinks", item);
                              }
                            }}
                          />
                        }
                        label={item}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  Object.entries(subCategories).map(([subCatName, subItems]) => (
                    <Box key={subCatName} sx={{ ml: 1, mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1, color: "text.secondary" }}>
                        {subCatName}
                      </Typography>
                      {Array.isArray(subItems) ? (
                        <FormGroup row>
                          {subItems.map((item) => (
                            <FormControlLabel
                              key={item}
                              control={
                                <Checkbox
                                  checked={formData.welcomeDrinks.includes(item) || formData.starters.includes(item) || formData.mainCourse.includes(item) || formData.desserts.includes(item)}
                                  onChange={() => {
                                    const categoryKey = ["welcomeDrinks", "starters", "mainCourse", "desserts"].find((key) =>
                                      formData[key].includes(item)
                                    );
                                    if (categoryKey) {
                                      handleCheckboxChange(categoryKey, item);
                                    } else {
                                      handleCheckboxChange("welcomeDrinks", item);
                                    }
                                  }}
                                />
                              }
                              label={item}
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        Object.entries(subItems).map(([deepCatName, deepItems]) => (
                          <Box key={deepCatName} sx={{ ml: 1, mt: 1.5 }}>
                            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: "text.secondary" }}>
                              {deepCatName}
                            </Typography>
                            <FormGroup row>
                              {deepItems.map((item) => (
                                <FormControlLabel
                                  key={item}
                                  control={
                                    <Checkbox
                                      checked={formData.welcomeDrinks.includes(item) || formData.starters.includes(item) || formData.mainCourse.includes(item) || formData.desserts.includes(item)}
                                      onChange={() => {
                                        const categoryKey = ["welcomeDrinks", "starters", "mainCourse", "desserts"].find((key) =>
                                          formData[key].includes(item)
                                        );
                                        if (categoryKey) {
                                          handleCheckboxChange(categoryKey, item);
                                        } else {
                                          handleCheckboxChange("welcomeDrinks", item);
                                        }
                                      }}
                                    />
                                  }
                                  label={item}
                                />
                              ))}
                            </FormGroup>
                          </Box>
                        ))
                      )}
                    </Box>
                  ))
                )}
              </Box>
            ))}
          </Box>

          {/* Special Notes */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Requests / Dietary Requirements"
            value={formData.specialNotes}
            onChange={(e) => handleInputChange("specialNotes", e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Submit Selection
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}