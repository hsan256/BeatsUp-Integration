import React from 'react';
import { useLocation } from 'react-router';
import { Paper, Grid, Card, CardContent, Typography, Link } from '@mui/material';
import NowPlaying from './NowPlaying';
import UploadError from './UploadError';
import AudioProgress from './AudioProgress';
import LyricWindow from './LyricWindow';
import UploadButtons from './UploadButtons/UploadButtons';
import Audio from './Audio';

const classes = {
  karaokeContainer: {
    height: '100%'
  },
  karaokeHolder: {
    zIndex: '10',
  },
  paddedHeader: {
    paddingTop: (theme) => theme.spacing(2),
    paddingBottom: (theme) => theme.spacing(2)
  }
};

export default function KaraokeHolder() {
  // const location = useLocation();
  // const { single } = location.state;
  // console.log(single)
  
  return (
    <>
      <Grid sx={classes.karaokeContainer} container direction='column'
        alignItems='center' justifyContent='center'>
        <Grid item>
          <Paper variant='outlined' sx={classes.karaokeHolder}>
            <Card>
              <CardContent>
                <Typography variant='h3' align='center'>Rearaoke</Typography>
                <Typography variant='h4' sx={classes.paddedHeader}>Audio Control</Typography>
                <UploadError />
                <Grid container direction='row' wrap='nowrap' spacing={2}>
                  <Grid item>
                    <Audio/>
                    <UploadButtons/>
                  </Grid>
                  <Grid item>
                    <AudioProgress/>
                  </Grid>
                </Grid>
                <Typography variant='subtitle1'>Find .lrc files <Link rel='noopener noreferrer' target='_blank' href='https://www.lyricsify.com/'>here</Link></Typography>
                <Typography variant='subtitle1'>Convert Youtube videos to audio <Link rel='noopener noreferrer' target='_blank' href='https://320ytmp3.com/'>here</Link></Typography>
                <Typography variant='h4' sx={classes.paddedHeader}>Lyric Window</Typography>
                <NowPlaying/>
                <LyricWindow/>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}