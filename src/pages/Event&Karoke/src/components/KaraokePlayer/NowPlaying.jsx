import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';

export default function NowPlaying() {
  const title = useSelector((state) => state.song.value.title);
  let artist = useSelector((state) => state.song.value.artist);
  const showNowPlaying = title !== null;
  let nowPlaying = <></>;

  if (showNowPlaying) {
    const songTitle = title !== '' ? title : 'Unnamed Song';
    if (artist !== null && artist !== '') {
      var songArtist =
        <>
          <span> by </span>
          <b>{artist}</b>
        </>;
    }
    nowPlaying =
      <Typography variant='h6'>
        <b>{songTitle}</b>{songArtist}
      </Typography>;
  }

  return nowPlaying;
}