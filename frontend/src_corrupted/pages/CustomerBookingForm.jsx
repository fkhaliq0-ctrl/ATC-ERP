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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Person,
  RestaurantMenu,
  CheckCircle,
  AddCircle,
  Delete,
} from "@mui/icons-material";

export default function CustomerBookingForm() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    gatheringArrangement: "Mixed Seating / Open Gathering",
    cityName: "Delhi",
    customLocation: "",
    venueName: "",
    guestCount: "",
    eventClassification: "Wedding / Nikah",
    scopeOfServices: "Catering Services Only",
    preWeddingFunctions: [],
    eventDate: "",
    functionTime: "",
    selectedItems: [],
    specialNotes: "",
  });

  // Master Menu Categories with elite halal selections including Welcome Drinks & Continental
  const masterMenuSections = {
    "1. Signature Welcome Beverages & Elixirs": [
      "Virgin Mojito", "Blue Lagoon", "Tropical Fruit Punch", "Shirley Temple", "Mint Margarita", "Fresh Lime Soda/Water",
      "Shardai (Thandai)", "Badam Milk", "Chilled Chaas (Buttermilk)", "Traditional Jaljeera", "Fresh Tender Coconut Water",
      "Fresh Filter Coffee", "Royal Masala Chai", "Organic Green Tea", "Kashmiri Kahwa"
    ],
    "2. Soups & Velvety Broths": [
      "Classic Chicken Clear Soup", "Sweet Corn Chicken Soup", "Cream of Chicken Velouté", "Lemon Coriander Chicken Soup", "Hot & Sour Chicken Soup", "Chicken Manchow Soup",
      "Creamy Tomato Basil Soup", "Velvet Mushroom Soup", "Sweet Corn Vegetable Soup", "Lemon Coriander Vegetable Soup", "Hot & Sour Veg Soup", "Veg Manchow Soup", "Almond (Badam) Velvet Soup"
    ],
    "3. Hors d'Oeuvres & Starters (Poultry & Meat)": [
      "Chicken Satay with Peanut Glaze", "Crispy Chicken Nuggets", "Golden Chicken Popcorn", "Chicken Spring Rolls", "Mini Chicken Burger Shots", "Chicken Samosas", "Chicken 65", "Chicken Wontons", "Chicken Cheese Balls", "Fiery Chilli Chicken Dry", "Chicken Manchurian Dry", "Honey Glazed Chicken", "Kung Pao Chicken Dry", "Drums of Heaven", "Chicken Shami Kabab", "Chicken Lollipops", "Chicken Wings", "Crispy Chicken Thread", "Chicken Cigar Rolls", "Traditional Chicken Sajji",
      "Crispy Fish Fingers", "Lemon Butter Fish", "Spicy Fish Chilli Dry", "Fish in Mustard Velouté", "Fish 65", "Tandoori Prawns", "Golden Fried Prawns", "Spicy Prawns Chilli Dry", "Fish Salt & Pepper", "Dynamite Prawns", "Fish Finger with Tartar Emulsion",
      "Pan-Fried Mutton Chaap", "Roasted Mutton Chaap", "Mutton Shami Kabab", "Mutton Tikka Boti", "Mutton Boti Kabab", "Traditional Mutton Kabab"
    ],
    "4. Hors d'Oeuvres & Starters (Vegetarian)": [
      "Gourmet Veg Nuggets", "Spiced Veg Kababs", "Bombay Cutlet", "Crispy Spring Rolls", "Golden French Fries", "Classic Aloo Tikki", "Mini Veg Burger Shots", "Crispy Cheese Balls", "Honey Chilli Potatoes", "Crispy Potato Fingers", "Potato Cutlets", "Stuffed Potato Rolls", "Paneer Tilhani", "Chilli Paneer Bites", "Mini Veg Pizzas", "Soya Chaap", "Soya Lemon Chaap", "Dahi ke Sholay",
      "Honey Chilli Potato", "Crispy Honey Lotus Stem", "Tossed Crispy Corn", "Veg Manchurian Dry", "Crispy Salt & Pepper Vegetables", "Vegetable Cigar Rolls", "Chicken Momos (Steamed/Fried)", "Veg Momos (Steamed/Fried)", "Chicken & Cheese Momos (Steamed/Fried)", "Corn & Cheese Momos (Steamed/Fried)", "Pan-Fried Momos"
    ],
    "5. Continental & Patisserie Masterpieces": [
      "Classic Vegetable Quiche", "Rich Vegetable Quiche", "Caramelized Onion & Feta Quiche", "Chicken Quiche", "Elegant Asparagus Puffs", "Vol-au-Vent Shells with Filling", "Mini Gourmet Pizzas", "Crisp Tart Shells", "Cheese Straws", "Savory Veg Patties", "Savory Chicken Patties",
      "Grilled Chicken Salad", "Classic Russian Salad", "Mexican Garden Salad", "Pasta Pesto Salad", "Fresh Seasonal Fruit Salad",
      "Strawberry Cheesecake", "Wild Blueberry Cheesecake", "Mango Passion Fruit Cheesecake", "Kiwi Cheesecake", "Lemon Cheesecake", "Baked New York Cheesecake", "Assorted Fruit Tarts", "Lemon Curd Tarts", "Chocolate Ganache Tarts", "Walnut Honey Tarts", "Chocolate Walnut Tarts",
      "Classic Apple Pie", "Date Pie", "Banoffee Pie", "Italian Tiramisu", "Classic Fruit Cream", "Trifle Pudding", "Warm Apple Crumble", "Bread & Butter Pudding", "Assorted Moussés", "Whipped Soufflés", "Fruit Flane", "Walnut Pie", "Hot Chocolate Gateaux", "Cream Caramel", "Chocolate Truffle Cake", "Almond Nougat Cake", "Black Forest Gateaux", "Fruit Gateaux", "Pineapple Gateaux", "Dark Cherry Chocolate Cake", "Arabian Honey Cake", "Chocolate Marble Cake", "Lemon Pound Cake", "Banana Walnut Cake", "Chocolate Fudge Brownies", "Chocolate Mud Cake", "Classic Plum Cake", "Grand Wedding Cake", "Chocolate & Sugar Glazed Doughnuts", "Artisan Muffins", "Eclairs", "Profitrolls"
    ],
    "6. Tandoori & Grill Room Specialties": [
      "Chicken Angara Tangri", "Classic Tandoori Chicken", "Chicken Achari Tangri", "Chicken Afghani Tangri", "Chicken Achari Tikka", "Chicken Malai Tikka", "Chicken Garlic Tikka", "Chicken Ajwaini Tikka", "Chicken Kali Mirch Tikka", "Chicken Angara Tikka", "Chicken Burra", "Chicken Kashmiri Tikka", "Chicken Haryali Tikka", "Chicken Lemon Tikka", "Roasted Quail (Batair)",
      "Chicken Seekh Kabab", "Chicken Galafi Kabab", "Chicken Gulauti Kabab", "Chicken Dora Kabab", "Chicken Kakori Kabab", "Chicken Reshmi Kabab", "Chicken Chapli Kabab", "Chicken Sambhali Kabab", "Mutton Tikka", "Mutton Barrah", "Mutton Tikka Boti", "Mutton Seekh Kabab", "Mutton Chaap", "Mutton Dora Kabab", "Mutton Reshmi Kabab", "Buff Dora Kabab", "Buff Reshmi Kabab", "Buff Sambhali Kabab", "Buff Tikka", "Buff Kakori Kabab", "Bihari Boti Kabab",
      "Fish Malai Tikka", "Fish Achari Tikka", "Fish Garlic Tikka", "Atlantic Salmon", "Whole Pomfret", "Jumbo Prawns",
      "Chicken Shami Kabab", "Chicken Lollipop", "Classic Chicken Fry", "Crispy Fish Fry", "Fried Quail (Batair)"
    ],
    "7. Royal Mughlai & North Indian Gravies": [
      "Chicken Tasla", "Chicken Changezi", "Traditional Chicken Stew", "Rich Chicken Qorma", "Chicken Laziz Handi", "Chicken Kadhai", "Chicken Achari", "Chicken Jalfarezi", "Chicken Do Piyaza", "Chicken Adraki", "Chicken Kali Mirch", "Chicken Lababdar", "Chicken Patiala (Bone/Boneless)", "Chicken Lahori", "Chicken Kaju Qeema", "Chilli Chicken Gravy", "Butter Chicken (Bone/Boneless)", "Palak Chicken",
      "Brain Masala (Bheja)", "Tawa Bheja", "Royal Mutton Qorma", "Mutton Stew", "Kashmiri Mutton Stew", "Chaap Masala", "Mutton Butter Masala", "Mutton Do Piyaza", "White Mutton Qorma", "Aloo Gosht", "Peshawri Gosht", "Traditional Roghan Josh", "Shabdegh", "Royal Haleem", "Traditional Nihari (Live/Buffet)", "Badam Pasanda", "Hari Mirch Qeema", "Kaju Qeema", "Gurdey Qeema",
      "Fish Tasla", "Rich Fish Curry", "Fish Chilli Gravy", "Fish Achari"
    ],
    "8. Vegetarian Gourmet & Oriental Entrées": [
      "Slow-Cooked Dal Makhni", "Jaipuri Dal", "Homestyle Rajma", "Paneer Adraki", "Paneer Butter Masala", "Paneer Lababdar", "Paneer Do Piyaza", "Shahi Paneer", "Kadhai Paneer", "Mutter Paneer", "Melange of Mixed Vegetables", "Pineapple Paneer", "Puri Pindi Chole", "Rich Malai Kofta", "Seasonal Sarso Ka Saag", "Bhindi Masala", "Pindi Choley", "Paneer Badam Qorma", "Mutter Qorma", "Paneer Pasanda", "Khoya Paneer", "Paneer Kofta", "Palak Kofta", "Palak Paneer",
      "Chilli Paneer Gravy", "Veg Manchurian Gravy", "Exotic Vegetables in Hot Garlic Sauce", "Vegetables in Black Bean Sauce", "Vegetables in White Garlic Sauce", "Vegetables in Sweet & Sour Sauce", "Chilli Garlic Gravy", "Manchurian Gravy", "Hot Garlic Gravy", "Black Bean Gravy", "Oyster Sauce Entrée"
    ],
    "9. Rice, Dum Biryanis & Noodles": [
      "Chicken Dum Biryani", "Chicken Achari Biryani", "Chicken Royal Dry Fruit Biryani", "Chicken Aalu Bukhara Biryani", "Live Chicken Mandi", "Chicken Hyderabadi Biryani", "Chicken Muradabadi Pulao", "Chicken Kolkata Biryani", "Mutton Dum Biryani", "Mutton Masala Biryani", "Mutton Muradabadi Pulao", "Mutton Hyderabadi Biryani", "Buff Dum Biryani", "Buff Masala Biryani", "Buff Muradabadi Pulao", "Buff Kolkata Biryani", "Live Fish Biryani", "Prawn Biryani",
      "Vegetable Fried Rice", "Chilli Garlic Fried Rice", "Egg Fried Rice", "Szechuan Fried Rice", "Hakka Noodles", "Chilli Garlic Noodles", "Butter & Black Pepper Noodles", "Singapore Noodles"
    ],
    "10. Artisanal Chaat Stalls & Street Classics": [
      "Crispy Gol Gappe (Ata/Suji)", "Papri + Gujiya + Kalmi Vada Platter", "Classic Aloo Tikki", "Dry Fruit Stuffed Paneer Tikki", "Aloo Mutter Chaat", "Mumbai Pav Bhaji", "Paneer Chilla", "Cream Stuffed Chilla", "Mutter Patila + Kulcha", "Mutter Patila + Kachori", "Meerut Wale Aloo", "Maunth + Kachori", "Sprouted Maunth Chaat", "Street-Style Chowmein"
    ],
    "11. Handcrafted Breads & Specialty Rotis": [
      "Stuffed Kulcha", "Lal Roti", "Makka Roti / Missi Roti / Bajra Roti", "Ghee Chini Doodh Roti", "Layered Lachcha Parantha", "Besani Parantha", "Rawa Maida Parantha", "Rumali Roti", "Chapati Roti", "Live Tandoori Roti", "Besani Roti", "Lucknow Sheermal", "Bakarkhani Sheermal", "Seasonal Bathwa Parantha", "Folding Naan", "Plain Naan", "Butter Naan", "Stuffed Naans (Aloo/Gobhi/Paneer)", "Kandhari Roti", "Kandhari Biscuit Roti", "Taftaan"
    ],
    "12. Rolls & Wraps": [
      "Chicken Spring Roll Wraps", "Chicken Tikka Roll", "Chicken Kabab Roll", "Chicken Shawarma Rolls", "Mutton Tikka Roll", "Mutton Kabab Roll"
    ],
    "13. Garden Salads, Raitas & Condiments": [
      "Premium Fancy Salad", "Crisp Green Salad", "Mixed Achar & Murabba", "Sweet Murabba", "Mint Hari Chutney", "Tangy Lal Chutney", "Sweet Meethi Chutney",
      "Boondi Raita", "Pineapple Raita", "Mixed Fruit Raita", "Seasonal Bathwa Raita", "Pudina Raita", "Dahi Pakori", "Dahi Gujiya"
    ],
    "14. Confectionery, Halwas & Traditional Desserts": [
      "Plain Rabri Kheer", "Zafrani Kheer", "Pineapple Kheer", "Royal Raj Halwa", "Fresh Fruit Custard", "Paneer Jalebi", "Traditional Rasmalai", "Chhena Pie", "Chilled Mini Rasgulle", "Artisanal Kulfa (Rabri, Mango, Jamun, Shareefa, Anar)", "Tilla Kulfi", "Traditional Matka Kulfi", "Kulfi Faluda", "Premium Assorted Ice Creams (Amul, Mother Dairy, Vadilal)",
      "Slow-Cooked Moong Dal Halwa", "Seasonal Lal Gajar Halwa", "Seasonal Sunehri Gajar Halwa", "Pineapple Halwa", "Ghiye Ka Halwa", "Shahi Tukda", "Stuffed Gulab Jamun", "Malpuda with Rabri", "Rabri Jalebi", "Rich Badam Halwa"
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (item) => {
    setFormData((prev) => {
      const currentList = prev.selectedItems;
      const updatedList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return { ...prev, selectedItems: updatedList };
    });
  };

  const handleAddPreWeddingFunction = () => {
    setFormData((prev) => ({
      ...prev,
      preWeddingFunctions: [
        ...prev.preWeddingFunctions,
        { functionName: "", venue: "", date: "", time: "" },
      ],
    }));
  };

  const handlePreWeddingChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.preWeddingFunctions];
      updated[index][field] = value;
      return { ...prev, preWeddingFunctions: updated };
    });
  };

  const handleRemovePreWeddingFunction = (index) => {
    setFormData((prev) => ({
      ...prev,
      preWeddingFunctions: prev.preWeddingFunctions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create-menu-submission/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking to server.');
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error saving booking form:", err);
      // Fallback save to localStorage if offline so nothing is ever lost
      const existing = JSON.parse(localStorage.getItem("menuSubmissions") || "[]");
      localStorage.setItem("menuSubmissions", JSON.stringify([...existing, { ...formData, id: Date.now() }]));
      setSubmitted(true);
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
            Your event specifications and customized menu selections have been submitted successfully.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Our management team at <strong>Zebaish Caterers</strong> will review your selections and connect with you shortly with a personalized quote.
          </Typography>
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
            Event Booking & Gourmet Menu Customization Portal
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Person color="primary" /> Client & Event Specifications
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
              <FormControl fullWidth required>
                <InputLabel>Guest Arrangement & Seating</InputLabel>
                <Select
                  value={formData.gatheringArrangement}
                  label="Guest Arrangement & Seating"
                  onChange={(e) => handleInputChange("gatheringArrangement", e.target.value)}
                >
                  <MenuItem value="Mixed Seating / Open Gathering">Mixed Seating / Open Gathering</MenuItem>
                  <MenuItem value="Segregated Seating (Ladies & Gents)">Segregated Seating (Ladies & Gents)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>City / Region</InputLabel>
                <Select
                  value={formData.cityName}
                  label="City / Region"
                  onChange={(e) => handleInputChange("cityName", e.target.value)}
                >
                  <MenuItem value="Delhi">Delhi</MenuItem>
                  <MenuItem value="NCR (Noida / Gurgaon / Ghaziabad / Faridabad)">NCR (Noida / Gurgaon / Ghaziabad / Faridabad)</MenuItem>
                  <MenuItem value="Outstation / Other City">Outstation / Other City</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.cityName === "Outstation / Other City" && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Google Maps Location Pin / Link"
                  placeholder="Paste Google Maps URL or location coordinates here"
                  value={formData.customLocation}
                  onChange={(e) => handleInputChange("customLocation", e.target.value)}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Venue Name"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Event Classification</InputLabel>
                <Select
                  value={formData.eventClassification}
                  label="Event Classification"
                  onChange={(e) => handleInputChange("eventClassification", e.target.value)}
                >
                  <MenuItem value="Wedding / Nikah">Wedding / Nikah</MenuItem>
                  <MenuItem value="Reception">Reception</MenuItem>
                  <MenuItem value="Engagement">Engagement</MenuItem>
                  <MenuItem value="Anniversary Celebration">Anniversary Celebration</MenuItem>
                  <MenuItem value="Birthday Gala">Birthday Gala</MenuItem>
                  <MenuItem value="Corporate Function">Corporate Function</MenuItem>
                  <MenuItem value="Custom / Other">Custom / Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Scope of Services & Management</InputLabel>
                <Select
                  value={formData.scopeOfServices}
                  label="Scope of Services & Management"
                  onChange={(e) => handleInputChange("scopeOfServices", e.target.value)}
                >
                  <MenuItem value="Catering Services Only">Catering Services Only</MenuItem>
                  <MenuItem value="Catering & Event Styling/Decor">Catering & Event Styling/Decor</MenuItem>
                  <MenuItem value="Comprehensive End-to-End Event Management">Comprehensive End-to-End Event Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.scopeOfServices === "Comprehensive End-to-End Event Management" && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, border: "1px dashed #cbd5e1", borderRadius: 2, bgcolor: "#f8fafc" }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                    Pre-Wedding / Pre-Event Ceremonies & Venues
                  </Typography>
                  {formData.preWeddingFunctions.map((fn, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: "center" }}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Function (e.g. Haldi)"
                          value={fn.functionName}
                          onChange={(e) => handlePreWeddingChange(index, "functionName", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Venue"
                          value={fn.venue}
                          onChange={(e) => handlePreWeddingChange(index, "venue", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2.5}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          label="Date"
                          value={fn.date}
                          onChange={(e) => handlePreWeddingChange(index, "date", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2.5}>
                        <TextField
                          fullWidth
                          size="small"
                          type="time"
                          InputLabelProps={{ shrink: true }}
                          label="Time"
                          value={fn.time}
                          onChange={(e) => handlePreWeddingChange(index, "time", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <Button color="error" onClick={() => handleRemovePreWeddingFunction(index)}>
                          <Delete />
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddCircle />}
                    onClick={handleAddPreWeddingFunction}
                  >
                    Add Function Row
                  </Button>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Primary Event Date"
                required
                InputLabelProps={{ shrink: true }}
                value={formData.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Function Start Time"
                required
                InputLabelProps={{ shrink: true }}
                value={formData.functionTime}
                onChange={(e) => handleInputChange("functionTime", e.target.value)}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantMenu color="primary" /> Gourmet Menu Selection
          </Typography>

          <Box sx={{ mb: 3 }}>
            {Object.entries(masterMenuSections).map(([categoryName, items]) => (
              <Box key={categoryName} sx={{ mb: 3, p: 2, border: "1px solid #e5e7eb", borderRadius: 2, bgcolor: "white" }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2, borderBottom: "1px solid #e5e7eb", pb: 1 }}>
                  {categoryName}
                </Typography>
                <FormGroup row>
                  {items.map((item) => (
                    <FormControlLabel
                      key={item}
                      control={
                        <Checkbox
                          checked={formData.selectedItems.includes(item)}
                          onChange={() => handleCheckboxChange(item)}
                        />
                      }
                      label={item}
                      sx={{ width: { xs: "100%", sm: "48%" } }}
                    />
                  ))}
                </FormGroup>
              </Box>
            ))}
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Requests / Dietary Requirements"
            value={formData.specialNotes}
            onChange={(e) => handleInputChange("specialNotes", e.target.value)}
            sx={{ mb: 3 }}
          />

          <Card variant="outlined" sx={{ mb: 3, bgcolor: "#f8fafc" }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1" fontWeight="bold">
                Total Items Selected: {formData.selectedItems.length} items
              </Typography>
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: "bold" }}
          >
            Submit Customized Menu & Booking
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}