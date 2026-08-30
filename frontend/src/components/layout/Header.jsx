import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";

import {
  Notifications,
  AccountCircle,
} from "@mui/icons-material";

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "#ffffff",
        color: "#000",
      }}
    >
      <Toolbar>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: "#C9A227",
            flexGrow: 1,
          }}
        >
          ZEBAISH ERP
        </Typography>

        <IconButton color="inherit">
          <Notifications />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "#C9A227", mr: 1 }}>
            F
          </Avatar>

          <Typography>
            Faisal
          </Typography>

          <AccountCircle sx={{ ml: 1 }} />
        </Box>

      </Toolbar>
    </AppBar>
  );
}