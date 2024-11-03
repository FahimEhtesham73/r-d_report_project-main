import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
export default function Dashboard() {
  const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects, isLoading, error } = api.useGetProjectsQuery();

  // Filter projects based on the search term
  const filteredProjects = projects?.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading projects: {error.message}
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search Projects"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        {(user.userType === "admin" || user.userType === "projectLead") && (
          <Button
            variant="contained"
            onClick={() => setIsOpenProjectModal(true)}
          >
            New Project
          </Button>
        )}

        <CreateProjectModal
          isOpen={isOpenProjectModal}
          closeModal={() => setIsOpenProjectModal(false)}
        />
      </Box>

      {((!projects || projects.length === 0) && (
        <Typography>No projects found</Typography>
      )) || (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
