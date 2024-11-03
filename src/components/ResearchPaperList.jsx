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

export default function ResearchPaperList({ projectId, canAdd }) {
  const [open, setOpen] = useState(false);
  const [paper, setPaper] = useState({
    title: '',
    publishedYear: '',
    dataset: '',
    accuracy: '',
    precision: '',
    recall: ''
  });

  const { data: reports } = api.useGetReportsQuery(projectId);
  const [updateReport] = api.useUpdateReportMutation();

  const handleAddPaper = async () => {
    try {
      const report = reports.find(r => r.project === projectId);
      if (report) {
        await updateReport({
          id: report._id,
          researchPapers: [...report.researchPapers, paper]
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

  const papers = reports?.flatMap(report => report.researchPapers) || [];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Research Papers</Typography>
        {canAdd && (
          <Button variant="contained" onClick={() => setOpen(true)}>
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
          <Button onClick={handleAddPaper} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}