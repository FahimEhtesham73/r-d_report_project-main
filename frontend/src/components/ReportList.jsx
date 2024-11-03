import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { FaFilePdf, FaFileWord, FaFileVideo, FaFileAudio, FaFile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../store/api";
import { MdDownload } from "react-icons/md";

const getFileIcon = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return null;
  }
  if (mimeType === "application/pdf") {
    return <FaFilePdf style={{ fontSize: '24px' }} />;
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return <FaFileWord style={{ fontSize: '24px' }} />;
  }
  if (mimeType.startsWith("video/")) {
    return <FaFileVideo style={{ fontSize: '24px' }} />;
  }
  if (mimeType.startsWith("audio/")) {
    return <FaFileAudio style={{ fontSize: '24px' }} />;
  }
  return <FaFile style={{ fontSize: '24px' }} />;
};

const FilePreview = ({ file }) => {
  const isImage = file.mimeType.startsWith("image/");
  const fileIcon = getFileIcon(file.mimeType);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {isImage ? (
        <img
          src={`/${file.path}`}
          alt={file.filename}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ) : (
        fileIcon
      )}
      <ListItemText
        title={file.filename.replace(/^\d+-/, '')}
        primary={file.filename.replace(/^\d+-/, '').length > 10
          ? file.filename.replace(/^\d+-/, '').slice(0, 10) + '...'
          : file.filename.replace(/^\d+-/, '')}
        secondary={<Typography variant="body2">{file.size} bytes</Typography>}
      />
    </Box>
  );
};

export default function ReportList({ projectId, canAdd }) {
  const navigate = useNavigate();
  const { data: reports, isLoading } = api.useGetReportsQuery(projectId);
  const [deleteReport] = api.useDeleteReportMutation(); // API hook for deleting reports
  const [openDialog, setOpenDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);

  const handleDelete = async (reportId) => {
    try {
      await deleteReport(reportId);
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to delete report:", error);
    }
  };

  const confirmDelete = (reportId) => {
    setReportToDelete(reportId);
    setOpenDialog(true);
  };

  if (isLoading) {
    return <Typography variant="h6" sx={{ textAlign: 'center' }}>Loading reports...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Reports</Typography>
        {canAdd && (
          <Button
            variant="contained"
            onClick={() => navigate("/reports/new", { state: { projectId } })}
            sx={{ borderRadius: 3 }}
          >
            Add Report
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ padding: 2 }}>
        <List>
          {reports?.map((report) => (
            <ListItem key={report._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <ListItemText
                primary={<Typography variant="h6">{report.title}</Typography>}
                secondary={
                  <Box>
                    <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>
                      Status: {report.status}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Accuracy: {report.accuracy}%<br />
                      Author: {report.author?.name || 'Unknown'}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {canAdd && (
                  <>
                    <IconButton onClick={() => navigate(`/reports/${report._id}/edit`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => confirmDelete(report._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </ListItemSecondaryAction>

              {report.files && report.files.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {report.files.map((file) => (
                    <Grid item xs={12} sm={3} md={3} key={file._id}>
                      <Paper sx={{ padding: 1, display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: 1 }}>
                        <FilePreview file={file} />
                        <IconButton
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `/${file.path}`;
                            link.download = file.filename;
                            link.click();
                          }}
                        >
                          <MdDownload style={{ fontSize: '24px' }} />
                        </IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this report? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(reportToDelete)} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
