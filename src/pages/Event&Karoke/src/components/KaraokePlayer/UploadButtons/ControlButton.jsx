import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { PlayArrowRounded, Pause } from '@mui/icons-material';
import { setSongPlaying } from '../songSlice';

ControlButton.propTypes = {
  disabled: PropTypes.bool
};

export default function ControlButton(props) {
  const dispatch = useDispatch();
  let songPlaying = useSelector((state) => state.song.value.songPlaying);
  songPlaying = songPlaying !== null ? songPlaying : false;

  const playSong = () => {
    dispatch(setSongPlaying(true));
  };

  const pauseSong = () => {
    dispatch(setSongPlaying(false));
  };

  const classes = {
    controlButton: {
      '&:hover': {
        backgroundColor: songPlaying ? 'darksalmon' : 'darkgreen'
      },
      backgroundColor: songPlaying ? 'orange' : 'green',
      color: 'white'
    }
  };

  return (
    <Button sx={classes.controlButton} disabled={props.disabled}
      onClick={songPlaying ? pauseSong : playSong}
      disableRipple={true}>
      {songPlaying ? <Pause/> : <PlayArrowRounded/>}
    </Button>
  );
}