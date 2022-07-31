import React, { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  localVideo: {
    'z-index': 1,
    background: 'clear',
    position: 'absolute',
    'object-fit': 'cover',
    top: 0,
    left: 0
  },
  remoteVideo: {
    width: '100vw',
    height: '90vh',
    background: 'clear',
    position: 'absolute',
    'object-fit': 'cover',
    top: 0,
    left: 0,
  }
}));

export const Video = forwardRef ((props, ref) => {
  const classes = useStyles();

  return (
    <video
      className={ props.isLocal ? classes.localVideo : classes.remoteVideo }
      width={ props.width }
      height={ props.height }
      autoPlay={ props.isAutoPlay }
      muted={ props.isMuted }
      ref={ ref }
    ></video>
  );
});
