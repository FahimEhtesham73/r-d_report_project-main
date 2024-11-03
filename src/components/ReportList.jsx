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
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { FaFilePdf, FaFileWord, FaFileVideo, FaFileAudio, FaFile } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../store/api";
import { MdDownload } from "react-icons/md";

const getFileIcon = (mimeType) => {
  if (mimeType.startsWith("image/")) {
    return null; // Return null for images to use the preview
  }
  if (mimeType === "application/pdf") {
    return <FaFilePdf style={{ fontSize: '24px' }} />; // PDF icon
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return <FaFileWord style={{ fontSize: '24px' }} />; // DOCX icon
  }
  if (mimeType.startsWith("video/")) {
    return <FaFileVideo style={{ fontSize: '24px' }} />; // Video icon
  }
  if (mimeType.startsWith("audio/")) {
    return <FaFileAudio style={{ fontSize: '24px' }} />; // Audio icon
  }
  // Default icon for unknown file types
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
                      Author: {report.author?.name || 'Unknown'} {/* Display the author's name */}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                {canAdd && (
                  <IconButton onClick={() => navigate(`/reports/${report._id}/edit`)}>
                    <EditIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>

              {/* Display files if they exist */}
              {report.files && report.files.length > 0 && (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {report.files.map((file) => (
                    <Grid item xs={12} sm={3} md={3} key={file._id}>
                      <Paper sx={{ padding: 1, display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: 1 }}>
                        <FilePreview file={file} />
                        <IconButton
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = `/${file.path}`; // Ensure backend serves this file correctly
                            link.download = file.filename; // Specify the filename for download
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
    </Box>
  );
}
