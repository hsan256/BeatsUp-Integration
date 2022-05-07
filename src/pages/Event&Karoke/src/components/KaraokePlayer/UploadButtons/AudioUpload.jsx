import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { MusicNoteRounded } from '@mui/icons-material';
import { setUploadError } from '../uploadErrorSlice';
import { setSongSrc } from '../songSlice';

AudioUpload.propTypes = {
  uploadButtonClass: PropTypes.object,
  disabled: PropTypes.bool
};

export default function AudioUpload(props) {
  const dispatch = useDispatch();
  const uploadButtonClass = props.uploadButtonClass;
  const disabled = props.disabled;
  const [audioKey, setAudioKey] = useState(Date.now());

  const onAudioUploadInput = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      dispatch(setUploadError('File upload failed'));
    }
    else {
      const file = files[0];
      let audioUrl = URL.createObjectURL(file);
      dispatch(setSongSrc(audioUrl));
    }
    setAudioKey(Date.now());
  };

  return (
    <Button sx={uploadButtonClass} component="label"
      onInput={onAudioUploadInput} endIcon={<MusicNoteRounded/>}
      disabled={disabled}>
      Audio
      <input type="file" hidden key={audioKey} />
    </Button>
  );
}