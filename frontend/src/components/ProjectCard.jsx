import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, onDelete, showDelete }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {project.description}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Status: {project.status}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/projects/${project._id}`)}
        >
          View Details
        </Button>
        {showDelete && (
          <Button
            size="small"
            color="error"
            onClick={() => onDelete(project._id)}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
