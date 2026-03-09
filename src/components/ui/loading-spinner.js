"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useSelector } from 'react-redux';

export default function LinearIndeterminate() {
  const theme = useSelector((state) => state.theme);

  return (
    <div className={`min-h-screen flex items-start justify-start app ${theme}`}>
      <Box sx={{ width: '100%', marginTop: "10px" }}>
      <LinearProgress />
    </Box>
    </div>
  );
}