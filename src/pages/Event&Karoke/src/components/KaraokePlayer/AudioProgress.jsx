import React from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress, Box } from '@mui/material';
import { secondsToString } from '../../js/time';

const classes = {
  audioProgress: {
    color: (theme) => theme.palette.primary.main,
    width: '40vw',
    height: (theme) =>theme.spacing(1),
    borderRadius: (theme) => theme.spacing(3)
  },
  audioFileStatus: {
    float: 'right'
  },
  progressText: {
    paddingTop: (theme) => theme.spacing(1)
  }
};

export default function AudioProgress() {
  const currentTime = useSelector((state) => state.song.value.currentTime);
  const duration = useSelector((state) => state.song.value.duration);
  const src = useSelector((state) => state.song.value.src);

  const time = currentTime === null ? '..' : secondsToString(currentTime);
  const totalTime = duration === null ? '..' : secondsToString(duration);
  const resetAudioFileleStatus = src === null ? 'No song loaded' : '';
  const progress = duration === null ? 0 : (currentTime / duration) * 100;

  return (
    <>
      <LinearProgress sx={classes.audioProgress} variant="determinate" value={progress}/>
      <Box component='div' sx={classes.progressText}>
        <span>{time} / {totalTime}</span>
        <Box component='span' sx={classes.audioFileStatus}>{resetAudioFileleStatus}</Box>
      </Box>
    </>
  );
}
