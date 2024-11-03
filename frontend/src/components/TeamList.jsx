import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useAddUserMutation, useDeleteUserMutation } from '../store/api';


export default function TeamList({ projectId, canManageTeam, members, lead }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loadingRemove, setLoadingRemove] = useState(null); // Holds member ID of the loading removal

  // Redux Toolkit Query hooks for API calls
  const [addMember, { isLoading: loadingAdd }] = useAddUserMutation();
  const [removeMember] = useDeleteUserMutation();

  const handleAddMember = async () => {
    try {
      await addMember({ projectId, email }).unwrap(); // Unwrap the promise to handle success/error
      setOpen(false);
      setEmail('');
      // Optionally refetch or update the members list here if necessary
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setLoadingRemove(memberId);
    try {
      await removeMember({ projectId, memberId }).unwrap(); // Unwrap the promise to handle success/error
      // Optionally refetch or update the members list here if necessary
    } catch (error) {
      console.error('Failed to remove member:', error);
    } finally {
      setLoadingRemove(null);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Team Members</Typography>
        {canManageTeam && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Member
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>{lead?.name[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={lead?.name}
              secondary="Project Lead"
            />
          </ListItem>
          {members?.map((member) => (
            <ListItem
              key={member._id}
              secondaryAction={
                canManageTeam && member._id !== lead?._id && (
                  <IconButton onClick={() => handleRemoveMember(member._id)} disabled={loadingRemove === member._id}>
                    {loadingRemove === member._id ? <CircularProgress size={24} /> : <DeleteIcon />}
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <Avatar>{member.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={member.name}
                secondary={member.email}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMember} variant="contained" disabled={loadingAdd}>
            {loadingAdd ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
