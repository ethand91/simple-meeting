import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Menu = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography varaint="h6" color="inherit">
        Simple Meeting
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Menu;
