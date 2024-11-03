import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { api } from '../store/api';
import { toast } from 'react-toastify';

export default function ResearchPaperList({ projectId, canAdd,canDelete }) {
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState({
    title: '',
    publishedYear: '',
    dataset: '',
    accuracy: '',
    precision: '',
    recall: ''
  });
  const [deletePaperId, setDeletePaperId] = useState(null); // State for deleting paper

  const { data: reports = [], isLoading, isError, error } = api.useGetReportsQuery(projectId);
  const [updateReport, { isLoading: isUpdating }] = api.useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = api.useDeleteReportMutation(); // Hook for deleting

  console.log("Project ID:", projectId);

  const handleAddPaper = async () => {
    try {
      const report = reports.find(r => r.project._id === projectId || r.project === projectId);
      if (report) {
        await updateReport({
          id: report._id,
          researchPapers: [...report.researchPapers, paper]
        })
        .unwrap()
        .then((response) => {
          console.log('Research paper added successfully:', response);
        })
        .catch((error) => {
          console.error('Failed to add research paper:', error);
        });
      }
      setOpen(false);
      setPaper({
        title: '',
        publishedYear: '',
        dataset: '',
        accuracy: '',
        precision: '',
        recall: ''
      });
    } catch (error) {
      console.error('Failed to add research paper:', error);
    }
  };

  const handleDeletePaper = async (paperId) => {
    const report = reports.find(r => r.project._id === projectId || r.project === projectId);
    if (report) {
      try {
        await updateReport({
          id: report._id,
          researchPapers: report.researchPapers.filter(p => p._id !== paperId) // Filter out the paper to be deleted
        })
        .unwrap()
        .then((response) => {
          toast("Research paper deleted successfully", { type: "success" });
          console.log('Research paper deleted successfully:', response);
        })
        .catch((error) => {
          console.error('Failed to delete research paper:', error);
        });
      } catch (error) {
        console.error('Failed to delete research paper:', error);
      }
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {error.message}</Typography>;

  const papers = reports?.flatMap(report => report.researchPapers) || [];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Research Papers</Typography>
        {canAdd && (
          <Button variant="contained" onClick={() => setOpen(true)} disabled={isUpdating}>
            Add Paper
          </Button>
        )}
      </Box>

      <Paper>
        <List>
          {papers.map((paper, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={paper.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2">
                      Published: {paper.publishedYear}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Dataset: {paper.dataset}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2">
                      Metrics: Accuracy {paper.accuracy}%, Precision {paper.precision}%, Recall {paper.recall}%
                    </Typography>
                  </>
                }
              />
              {canDelete && <Button variant="outlined" color="error" onClick={() => handleDeletePaper(paper._id)} disabled={isDeleting}>
                Delete
              </Button>}
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Research Paper</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={paper.title}
            onChange={(e) => setPaper({ ...paper, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Published Year"
            type="number"
            fullWidth
            value={paper.publishedYear}
            onChange={(e) => setPaper({ ...paper, publishedYear: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Dataset"
            fullWidth
            value={paper.dataset}
            onChange={(e) => setPaper({ ...paper, dataset: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Accuracy (%)"
            type="number"
            fullWidth
            value={paper.accuracy}
            onChange={(e) => setPaper({ ...paper, accuracy: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Precision (%)"
            type="number"
            fullWidth
            value={paper.precision}
            onChange={(e) => setPaper({ ...paper, precision: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Recall (%)"
            type="number"
            fullWidth
            value={paper.recall}
            onChange={(e) => setPaper({ ...paper, recall: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPaper} variant="contained" disabled={isUpdating}>
            {isUpdating ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
