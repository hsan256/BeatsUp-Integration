import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Slider } from '@mui/material';
import { VolumeUpRounded, VolumeDownRounded } from '@mui/icons-material';
import { setSongVolume } from '../songSlice';

const classes = {
  volumeSlider: {
    marginLeft: (theme) => theme.spacing(1),
    marginRight: (theme) => theme.spacing(1),
    width: '4vw'
  }
};

VolumeSlider.propTypes = {
  disabled: PropTypes.bool
};

export default function VolumeSlider(props) {
  const dispatch = useDispatch();
  let volume = useSelector((state) => state.song.value.volume);
  volume = volume !== null ? Math.round(volume * 100) : 100;

  const onVolumechange = (event, newVolume) => {
    dispatch(setSongVolume(newVolume / 100));
  };

  return (
    <>
      <VolumeDownRounded/>
      <Slider sx={classes.volumeSlider} aria-label="Volume"
        value={volume}  valueLabelDisplay="auto"
        onChange={onVolumechange} disabled={props.disabled}/>
      <VolumeUpRounded/>
    </>
  );
}