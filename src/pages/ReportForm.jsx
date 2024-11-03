import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { api } from "../store/api";
import { useAuth } from "../contexts/AuthContext";

export default function ReportForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    accuracy: "",
    status: "draft",
    project: location.state?.projectId || "",
    author: user?._id,
  });

  const [files, setFiles] = useState([]);
  const { data: report } = api.useGetReportQuery(id, { skip: !id });
  const [createReport, { isLoading: isLoadingCreate }] = api.useCreateReportMutation();
  const [updateReport, { isLoading: isLoadingUpdate }] = api.useUpdateReportMutation();


  const isLoading = isLoadingCreate || isLoadingUpdate;

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        description: report.description,
        accuracy: report.accuracy || "", // Set to empty string if accuracy is null
        status: report.status,
        project: report.project._id,
        author: report.author._id,
        researchPapers: report.researchPapers // Set the author if editing
      });
  
      // Check if files are present and set accordingly
      setFiles(
        report.files?.map(file => 
          typeof file === 'string' ? { name: file } : file
        ) || []
      );
    }
  }, [report]);

console.log({formData})

const handleSubmit = async (e) => {
  e.preventDefault();
  const formDataObj = new FormData();

  // Append the form data
  Object.keys(formData).forEach((key) => {
    formDataObj.append(key, formData[key]);
  });
  
  files.forEach((file) => {
    formDataObj.append("files", file);
  });

  // Convert accuracy to a number before submitting
  if (formData.accuracy) {
    formDataObj.set("accuracy", Number(formData.accuracy));
  }
  
  console.log([...formDataObj]); // Use spread operator to log FormData contents

  try {
    if (id) {
      // Pass formData directly
      await updateReport({ id, formData: formData })
        .unwrap()
        .then((response) => {
          console.log({ "response update": response });
        });
    } else {
      await createReport(formDataObj)
        .unwrap()
        .then((response) => {
          console.log({ "response create": response });
        });
      navigate(`/projects/${formData?.project}`);
    }
  } catch (error) {
    console.error("Failed to save report:", error);
  }
};


  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {id ? "Edit Report" : "New Report"}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Accuracy (%)"
              value={formData.accuracy}
              onChange={(e) =>
                setFormData({ ...formData, accuracy: e.target.value })
              }
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="in-review">In Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              style={{ display: "none" }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outlined" component="span">
                Upload Files
              </Button>
            </label>
            {files.length > 0 && (
  <Typography sx={{ mt: 1 }}>
    Selected files: {files.map((f) => f.name).join(", ")}
  </Typography>
)}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button onClick={() => navigate(-1)} disabled={isLoading}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Processing..." : id ? "Update" : "Create"} Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
