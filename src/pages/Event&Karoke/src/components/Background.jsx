import React from 'react';
import { Box } from '@mui/material';

const classes = {
  bg: {
    position: 'fixed',
    top: '0',
    bottom: '0',
    zIndex: '-10',
    height: '100%',
    width: '100%',
    backgroundColor: (theme) => theme.palette.secondary.main
  }
};

export default function Background() {
  return (
    <Box component='canvas' id='bg' sx={classes.bg}/>
  );
}