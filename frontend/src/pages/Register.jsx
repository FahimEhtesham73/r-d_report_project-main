import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  MenuItem,
  Grid,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    nslId: "",
    email: "",
    password: "",
    userType: "member",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
      toast.success("Registration successful");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        height: "95vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#0d47a1" }}
        >
          Create Your Account
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Join us and get started today!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant="outlined"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NSL ID"
                margin="normal"
                variant="outlined"
                value={formData.nslId}
                onChange={(e) =>
                  setFormData({ ...formData, nslId: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="User Type"
                select
                margin="normal"
                variant="outlined"
                value={formData.userType}
                onChange={(e) =>
                  setFormData({ ...formData, userType: e.target.value })
                }
              >
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="projectLead">Project Lead</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              backgroundColor: "#1565c0",
              color: "#fff",
              "&:hover": { backgroundColor: "#0d47a1" },
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            Register
          </Button>
          <Typography
            align="center"
            sx={{ mt: 3 }}
            variant="body2"
            color="textSecondary"
          >
            Already have an account?{" "}
            <Link
              onClick={() => navigate("/login")}
              sx={{
                color: "#1565c0",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
