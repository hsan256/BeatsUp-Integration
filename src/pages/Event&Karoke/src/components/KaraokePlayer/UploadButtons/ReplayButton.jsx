import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { ReplayRounded } from '@mui/icons-material';
import { setSongPlaying, setSongSeekValue } from '../songSlice';

const classes = {
  replayButton: {
    '&:hover': {
      backgroundColor: 'darkgray'
    },
    backgroundColor: 'gray',
    color: 'white'
  }
};

ReplayButton.propTypes = {
  disabled: PropTypes.bool
};

export default function ReplayButton(props) {
  const dispatch = useDispatch();

  const replaySong = () => {
    dispatch(setSongPlaying(false));
    dispatch(setSongSeekValue(0));
  };

  return (
    <Button sx={classes.replayButton} disableRipple={true}
      onClick={replaySong} disabled={props.disabled}>
      <ReplayRounded/>
    </Button>
  );
}