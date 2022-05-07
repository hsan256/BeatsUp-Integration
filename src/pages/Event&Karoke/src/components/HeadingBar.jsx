import React from 'react';
import PropTypes from 'prop-types';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const classes = {
  headingBar: {
    backgroundColor: (theme) => theme.palette.primary.main
  },
  title: {
    flexGrow: 1,
  }
};

HeadingBar.propTypes = {
  parentCallback: PropTypes.func,
  isLightTheme: PropTypes.bool
};

export default function HeadingBar(props) {
  const onTrigger = () => {
    props.parentCallback();
  };
  const icon = props.isLightTheme ? <Brightness3Icon/> : <Brightness7Icon/>;

  return (
    <AppBar>
      <Toolbar sx={classes.headingBar}>
        <Typography variant='h6' sx={classes.title}>
          Rearaoke
        </Typography>
        <Button color='inherit' aria-label='Change Theme' endIcon={icon} onClick={onTrigger}>
          {props.isLightTheme ? 'Change to Dark Theme' : 'Change to Light Theme'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}