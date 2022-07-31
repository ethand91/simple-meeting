import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import CopyToClipBoard from 'react-copy-to-clipboard';

import { create } from './api-room';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  }
}));

export default function Create () {
  const classes = useStyles();
  const [ values, setValues ] = useState({
    open: false,
    roomKey: '',
    error: '',
    openTooltip: false
  });

  const clickSubmit = async () => {
    console.log('create room');
    const data = await create();

    if (data.error) {
      setValues({ ...values, error: data.error });

      return;
    }

    console.log('got data', data);
    setValues({ ...values, roomKey: data.key, open: true });
  };

  const handleClipBoardClicked = () => {
    setValues({ ...values, openTooltip: true });
  };

  const closeTooltip = () => {
    setValues({ ...values, openTooltip: false });
  };

  return (
    <div>
      <Card className={ classes.card }>
        <CardContent>
          <Typography>
            Room Generator
          </Typography>
          <br/> {
            values.error &&
            (
              <Typography component="p" color="error">
                <Icon color="error" className={ classes.error }>error</Icon>
                { values.error }
              </Typography>
            )
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={ clickSubmit } className={ classes.submit }>Create Room</Button>
        </CardActions>
      </Card>

      <Dialog open={ values.open } disableBackdropClick={ true }>
        <DialogContent>
          <DialogContentText>
            New room was created succesfully access it via the following url: 
            <br />
            <Typography variant="contained">
              Copy URL:
            </Typography>
            <br /><br/>
            <Tooltip
              arrow
              open={ values.openTooltip }
              onClose={ closeTooltip }
              disableHoverListener
              placement="top"
              title="Copied!"
            >

              <CopyToClipBoard text={ `https://${window.location.hostname}:3000/room/${values.roomKey}` }>
                <InputAdornment position="end">
                  <IconButton
                    onClick={ handleClipBoardClicked }
                  >
                    <AssignmentIcon />
                  </IconButton>
                </InputAdornment>
              </CopyToClipBoard>
            </Tooltip>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Link to={ `/room/${values.roomKey}` }>
            Go To Room
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
