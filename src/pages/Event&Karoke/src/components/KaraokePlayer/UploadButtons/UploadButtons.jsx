import React from 'react';
import { useSelector } from 'react-redux';
import { ButtonGroup, FormGroup } from '@mui/material';
import LrcUpload from './LrcUpload';
import AudioUpload from './AudioUpload';
import ControlButton from './ControlButton';
import ReplayButton from './ReplayButton';
import VolumeSlider from './VolumeSlider';


const classes = {
  controls: {
    flexDirection: 'row'
  },
  uploadButton: {
    backgroundColor: (theme) => theme.palette.primary.main,
    color: 'white'
  }
};

export default function UploadButtons() {
  const karaoke = useSelector((state) => state.song.value.karaoke);
  const src = useSelector((state) => state.song.value.src);
  const audioButtonDisabled = karaoke === null;
  const controlButtonsDisabled = audioButtonDisabled || src === null;

  return (
    <>
      <FormGroup sx={classes.controls}>
        <ButtonGroup disableElevation={true} variant="contained">
          <LrcUpload uploadButtonClass={classes.uploadButton}/>
          <AudioUpload uploadButtonClass={classes.uploadButton} disabled={audioButtonDisabled}/>
          <ControlButton disabled={controlButtonsDisabled}/>
          <ReplayButton disabled={controlButtonsDisabled}/>
        </ButtonGroup>
        <VolumeSlider disabled={controlButtonsDisabled}/>
      </FormGroup>
    </>
  );
}