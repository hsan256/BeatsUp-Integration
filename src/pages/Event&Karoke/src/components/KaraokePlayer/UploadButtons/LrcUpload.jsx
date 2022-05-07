import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { AttachFileRounded } from '@mui/icons-material';
import { setUploadError } from '../uploadErrorSlice';
import { parseLrcFile } from '../../../js/lrcFileParser';
import { setSong, setSongSrc } from '../songSlice';

LrcUpload.propTypes = {
  uploadButtonClass: PropTypes.object
};

export default function LrcUpload(props) {
  const dispatch = useDispatch();
  const uploadButtonClass = props.uploadButtonClass;
  const [lrcKey, setLrcKey] = useState(Date.now());

  const onLrcUploadInput = (event) => {
    const files = event.target.files;

    if (files.length === 0) {
      dispatch(setUploadError('File upload failed'));
    }
    else {
      const file = files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (loadEvent) => {
        let lrcFileData = loadEvent.target.result;
        try {
          let parsedSong= parseLrcFile(lrcFileData);
          dispatch(setSong(parsedSong));
          dispatch(setSongSrc(null));
        } catch(error) {
          dispatch(setUploadError(error.message));
        }
        setLrcKey(Date.now());
      });
      reader.readAsText(file);
      dispatch(setUploadError(null));
    }
  };

  return (
    <Button sx={uploadButtonClass} component="label"
      onInput={onLrcUploadInput} endIcon={<AttachFileRounded/>}>
      .LRC
      <input type="file" hidden key={lrcKey}/>
    </Button>
  );
}