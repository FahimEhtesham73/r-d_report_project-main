import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import CheckIcon from "@mui/icons-material/Check";
import { toast } from "react-toastify";

const EditProjectModal = ({ isOpen, closeModal, project }) => {
  const { users } = useAuth(); // Ensure users is an array of user objects
  const [title, setTitle] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [description, setDescription] = useState("");
  const [projectLead, setProjectLead] = useState("");
  const [duration, setDuration] = useState({ startDate: "", endDate: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateProject, { isLoading }] = api.useUpdateProjectMutation(); // Assuming you have an update mutation
  const navigate = useNavigate();
console.log(project?.projectMembers)
  useEffect(() => {
    if (project) {
      setTitle(project?.title);
      setUniqueId(project?.uniqueId);
      setDescription(project?.description);
      setProjectLead(project?.projectLead);
      setDuration(project?.duration);
      setSelectedUsers(project?.projectMembers);
    }
  }, [project]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedUsers(value);
  };

  const handleDelete = (userId) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uniqueId.trim()) {
      alert("Unique ID cannot be empty");
      return;
    }

    const projectData = {
      title,
      uniqueId,
      description,
      projectLead,
      projectMembers: selectedUsers, 
      duration,
    };

    try {
      await updateProject({ id: project._id, ...projectData }).unwrap();
      toast.success("Project updated successfully");
      navigate("/");
      closeModal();
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <Box>
        <DialogTitle>Edit Project</DialogTitle>
        <Button
          onClick={closeModal}
          sx={{ position: "absolute", top: 10, right: 10 }}
        >
          <CloseIcon />
        </Button>
      </Box>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 800,
          margin: "auto",
          mt: 4,
          p: 4,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unique ID"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required margin="dense">
                <InputLabel id="project-lead-label">Project Lead</InputLabel>
                <Select
                  labelId="project-lead-label"
                  value={projectLead}
                  onChange={(e) => setProjectLead(e.target.value)}
                  label="Project Lead"
                >
                  {users
                    .filter((user) => user.userType === "projectLead")
                    .map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name} (
                        {user.userType === "projectLead" ? "lead" : ""})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required margin="dense">
                <InputLabel id="user-select-label">Project Members</InputLabel>
                <Select
                  labelId="user-select-label"
                  multiple
                  value={selectedUsers}
                  onChange={handleSelectChange}
                >
                  {users.map((user) => (
                    <MenuItem
                      key={user._id}
                      value={user._id}
                      disabled={selectedUsers.includes(user._id)}
                    >
                      {selectedUsers.includes(user._id) && <CheckIcon />}
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedUsers.map((id) => {
                  const user = users.find((user) => user._id === id);
                  return (
                    user && (
                      <Chip
                        key={id}
                        label={`${
                          user.name.length > 5
                            ? user.name.slice(0, 5) + "..."
                            : user.name
                        }`}
                        onDelete={() => handleDelete(id)}
                      />
                    )
                  );
                })}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={duration.startDate}
                onChange={(e) =>
                  setDuration({ ...duration, startDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={duration.endDate}
                onChange={(e) =>
                  setDuration({ ...duration, endDate: e.target.value })
                }
                fullWidth
                required
                variant="outlined"
                margin="dense"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 3,
            }}
          >
            <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ color: "#fff", mr: 1 }} />
                Processing...
              </>
            ) : (
              "Update Project"
            )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Dialog>
  );
};

export default EditProjectModal;
