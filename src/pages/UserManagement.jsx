import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { api, useCreateUserMutation } from "../store/api";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export default function UserManagement() {
  const {user}=useAuth()
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nslId: "",
    password: "",
    userType: "member",
  });

  const { data: users, isLoading } = api.useGetUsersQuery();
  const [createUser, { isLoading: isLoadingCreateUser }] = useCreateUserMutation();

  const handleSubmit = async () => {
    try {
      await createUser(formData).unwrap();
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        nslId: "",
        password: "",
        userType: "member",
      });
      toast.success("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">User Management</Typography>
        {user?.userType === "admin" && (
          
        <Button variant="contained" onClick={() => setOpen(true)}>
        Add User
      </Button>)}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>NSL ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.nslId}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Add New User
          <Button
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="NSL ID"
            margin="normal"
            value={formData.nslId}
            onChange={(e) =>
              setFormData({ ...formData, nslId: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
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
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            fullWidth
            select
            label="Role"
            margin="normal"
            value={formData.userType}
            onChange={(e) =>
              setFormData({ ...formData, userType: e.target.value })
            }
          >
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="projectLead">Project Lead</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
  onClick={handleSubmit}
  variant="contained"
  disabled={isLoadingCreateUser}
>
  {isLoadingCreateUser ? (
    <Box display="flex" alignItems="center">
      <CircularProgress size={24} sx={{ mr: 1 }} />
      Processing
    </Box>
  ) : (
    "Add User"
  )}
</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
