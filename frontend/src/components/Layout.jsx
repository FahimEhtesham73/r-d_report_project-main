import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Navigation from "./Navigation";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            R&D Reports
          </Typography>
          <Navigation isMobile={isMobile} user={user} />
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
    </Box>
  );
}
