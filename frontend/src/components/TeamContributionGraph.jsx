import React from 'react';
import { useGetReportsQuery } from '../store/api';
import { Box, Typography } from '@mui/material';

const TeamContributionGraph = ({ projectId }) => {
  const { data, isLoading, isError } = useGetReportsQuery(projectId);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading data</Typography>;

  // Group reports by author and store count along with author name
  const reportCounts = data.reduce((counts, report) => {
    const authorId = report.author._id;
    const authorName = report.author.name;

    if (!counts[authorId]) {
      counts[authorId] = { count: 0, name: authorName };
    }
    counts[authorId].count += 1;
    return counts;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Team Contribution by Reports</Typography>
      {Object.entries(reportCounts).map(([authorId, { count, name }]) => (
        <Box key={authorId} sx={{ my: 1 }}>
          <Typography variant="subtitle1">{`Author: ${name}`}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: `${count * 10}px`, // Adjust width scaling as needed
                height: '20px',
                backgroundColor: 'primary.main',
                borderRadius: '4px',
              }}
            />
            <Typography sx={{ ml: 1 }}>{count}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TeamContributionGraph;
