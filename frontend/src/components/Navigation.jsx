import React, { useState } from "react";
import { Button, IconButton, Menu, MenuItem, Box, Hidden } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LogoutIcon from '@mui/icons-material/Logout';

const Navigation = ({ isMobile, user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path) => {
    if (path) navigate(path);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Hidden smDown>
        {/* Desktop Navigation */}
        {user && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" onClick={() => navigate("/")}>
              Dashboard
            </Button>
            {(user.userType === "admin" || user.userType === "projectLead") && (
              <Button color="inherit" onClick={() => navigate("/users")}>
                Users
              </Button>
            )}
            <Button color="inherit" onClick={() => navigate("/profile")}>
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              title="Logout"
            >
              Logout
            </Button>
          </Box>
        )}
      </Hidden>
      <Hidden smUp>
        {/* Mobile Navigation */}
        <IconButton
          color="inherit"
          onClick={handleMenuClick}
          aria-controls="menu-appbar"
          aria-haspopup="true"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => handleClose()}
        >
          {user && (
            <>
              <MenuItem onClick={() => handleClose("/")}>Dashboard</MenuItem>
              {(user.userType === "admin" ||
                user.userType === "projectLead") && (
                <MenuItem onClick={() => handleClose("/users")}>Users</MenuItem>
              )}
              <MenuItem onClick={() => handleClose("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={logout} title="Logout">
                <LogoutIcon sx={{ mr: 1,color: 'red' }} />
                Logout
              </MenuItem>
            </>
          )}
        </Menu>
      </Hidden>
    </Box>
  );
};

export default Navigation;
