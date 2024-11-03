import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/";
      navigate(redirectPath);
    }
  }, [user, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError("");

    try {
      await login(formData);
      toast.success("Login successful");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "#4a148c" }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Please sign in to continue
        </Typography>
        <form onSubmit={handleSubmit}>
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
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading}
            sx={{
              mt: 2,
              backgroundColor: "#6a1b9a",
              color: "#fff",
              "&:hover": { backgroundColor: "#4a148c" },
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
                Processing...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
