import * as React from 'react';
import { format } from 'date-fns';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import AudioPlayer from 'react-h5-audio-player';
import { Avatar, Grid, Paper, Stack } from '@mui/material';
import moment from 'moment';
import { withToast } from '../../../../utils/toast';
import 'react-toastify/dist/ReactToastify.css';
import Iconify from '../../../Iconify';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MusicPlayer({ collection, locked }) {
  const [open, setOpen] = React.useState(false);
  const [music, setMusic] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const notify = () => {
    const resolveWithSomeData = new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('Collection is LOCKED')), 0)
    );

    withToast(resolveWithSomeData);
  };

  return (
    <>
      {locked ? (
        <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />} onClick={notify}>
          View All
        </Button>
      ) : (
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          onClick={handleClickOpen}
        >
          View All
        </Button>
      )}

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Musics
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {collection.content.map((music, index) => {
            const au = document.createElement('audio');
            au.src = music.video;
            au.addEventListener(
              'loadedmetadata',
              async function () {
                const duration = moment.utc(au.duration * 1000).format('HH:mm:ss');
                music.duration = duration;
              },
              false
            );

            return (
              <Grid key={music._id}>
                <ListItem button selected={selectedIndex === index}>
                  <Stack direction="row" spacing={3}>
                    <Avatar alt="Remy Sharp" src={music.img} />
                    <ListItemText
                      primary={music.title}
                      secondary={music.duration}
                      onClick={(event) => {
                        setMusic(music.video);
                        handleListItemClick(event, index);
                      }}
                    />
                  </Stack>
                </ListItem>
                <Divider />
              </Grid>
            );
          })}
        </List>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          {/* https://codesandbox.io/s/dhn63 */}
          <AudioPlayer
            autoPlay
            src={music}
            onPlay={(e) => console.log('onPlay')}
            // other props here
          />
        </Paper>
      </Dialog>
    </>
  );
}
