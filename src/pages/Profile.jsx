import { toast } from 'react-toastify';
import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useChangePasswordMutation } from '../store/api';

export default function Profile() {
  const { user } = useAuth();
  const [changePassword, { isLoading: isLoadingChangePassword }] = useChangePasswordMutation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [open, setOpen] = useState(false); // State to control the modal

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        userId: user._id,
      }).unwrap();
      toast.success("Password changed successfully");
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setOpen(false); // Close the modal after successful change
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Profile</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>User Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>NSL ID:</strong> {user.nslId}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Typography><strong>Role:</strong> {user.userType}</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{ mt: 2 }}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for Changing Password */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              margin="normal"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="New Password"
              margin="normal"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isLoadingChangePassword}
          >
            {isLoadingChangePassword ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing
              </Box>
            ) : (
              "Change Password"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
