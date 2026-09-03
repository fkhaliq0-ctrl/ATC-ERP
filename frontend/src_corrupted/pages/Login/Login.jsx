import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: 5,
          width: 380,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          ATC ERP
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Outdoor Catering Management System
        </Typography>

        <TextField
          fullWidth
          label="Username"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/dashboard")}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}