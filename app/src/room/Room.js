import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { login } from './api-room';
import { Video } from './../components/Video';
import { ChatLog } from './../components/chat/ChatLog';
import {
  getLocalMediaStream,
  initializePeerConnection
} from './../webrtc/webrtc';

const useStyles = makeStyles(theme => ({
  videoGrid: {
    position: 'relative'
  },
  chatLog: {
    flex: 1,
    maxWidth: '400px',
    marginLeft: 'auto'
  }
}));

export default function Room() {
  const params = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(undefined);
  const remoteVideoRef = useRef(undefined);
  const socketRef = useRef();
  const classes = useStyles();
  const [ values, setValues ] = useState({
    redirectToCreate: false,
    localMediaStream: undefined,
  });
  const [ messages, setMessages ] = useState([]);
  const peerConnection = initializePeerConnection();
  const remoteMediaStream = new MediaStream();

  useEffect(() => {
    console.log('init');
    const abortController = new AbortController();
    const signal = abortController.signal;

    login(params.roomKey, signal).then((data) => {
      if (data && data.error) {
        setValues({ ...values, redirectToCreate: true });

        return;
      }
    });

    return function cleanup() {
      abortController.abort();
    }
  }, [ params.roomKey ]);

  useEffect(() => {
    // init socket
    socketRef.current = io(`https://${window.location.hostname}:3002`, { reconnection: false });
    handleSocket(params.roomKey);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSocket = (roomKey) => {
    socketRef.current.once('connect', () => {
      console.log('socket connected');
      initializeLocalMedia(roomKey);
    });

    socketRef.current.once('disconnect', reason => {
      console.log('socket disconnected due to reason', reason);

      if (videoRef.current) {
        const mediaTracks = videoRef.current.srcObject.getTracks();

        for (const mediaTrack of mediaTracks) {
          mediaTrack.stop();
        }
      }

      navigate('/');
    });

    socketRef.current.once('init', async () => {
      try {
        console.log('init call');
      } catch (error) {
        console.error(error);
      }
    });

    socketRef.current.once('offer', async () => {
      try {
        console.log('create local offer');
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socketRef.current.emit('message', {
          action: 'offer',
          offer: peerConnection.localDescription
        });
      } catch (error) {
        console.error(error);
      }
    });

    socketRef.current.on('message', message => {
      console.log('remote message', message);

      handleRemoteMessage(message);
    });
  };

  const initializeLocalMedia = async (roomKey) => {
    try {
      const mediaStream = await getLocalMediaStream();
      console.log('local media devices initialized');

      await setValues({ ...values, localMediaStream: mediaStream });

      setTimeout(() => {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();


        handlePeerConnection(roomKey);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePeerConnection = (roomKey) => {
    console.log('peerConnection', peerConnection);

    peerConnection.onicecandidate = ({ candidate }) => {
      if (!candidate) return;

      console.log('new candidate', candidate);
      socketRef.current.emit('message', {
        action: 'candidate',
        candidate
      });
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log('iceconnectionstatechange', peerConnection.iceConnectionState);

      if (peerConnection.iceConnectionState === 'disconnected') {
        console.warn('state is disconnected');
      }

      if (peerConnection.iceConnectionState === 'disconnected' || peerConnection.isConnectionState === 'closed') {
        socketRef.current.disconnect();
      }
    };

    peerConnection.ontrack = ({ track }) => {
      console.log('on remote track', track.kind);

      remoteMediaStream.addTrack(track);

      if (track.kind === 'video') {
        remoteVideoRef.current.srcObject = remoteMediaStream;
        remoteVideoRef.current.load();
      }
    };

    for (const mediaTrack of videoRef.current.srcObject.getTracks()) {
      peerConnection.addTrack(mediaTrack);
    }

    console.log('init');
    socketRef.current.emit('init', roomKey);
  };

  const handleRemoteMessage = async (message) => {
    try {
      switch(message.action) {
        case 'offer':
            console.log('remote offer');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            socketRef.current.emit('message', {
              action: 'answer',
              answer
            });
          break;
        case 'answer':
          console.log('remote answer');
          await peerConnection.setRemoteDescription(message.answer);
          break;
        case 'candidate':
          console.log('remote ice');
          await peerConnection.addIceCandidate(message.candidate);
          break;
        case 'chat':
          message.data.isLocal = false;
          console.log('chat message', message.data);

          setMessages(prevMessages => [ ...prevMessages, message.data ]);
          break;
        default: console.warn('unknown action', message.action);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendNewChatMessage = message => {
    console.log('send', message);

    const data = { isLocal: true, message };
    setMessages(prevMessages => [ ...prevMessages, data ]);
    console.log(messages);

    socketRef.current.emit('message', {
      action: 'chat',
      data 
    });
  };

  if (values.redirectToCreate) {
    return <Navigate to="/"/>;
  }

  return (
    <div>
      <Grid container>
        <Grid item className={ classes.videoGrid }>
          { values.localMediaStream &&
            <Video
              height={ 150 }
              width={ 150 }
              isLocal={ true }
              isAutoplay={ true }
              isMuted={ true }
              ref={ videoRef }
            />
          }

          <Video
            isLocal={ false }
            isAutoPlay={ true }
            isMuted={ false }
            ref={ remoteVideoRef }
          />
        </Grid>

        <Grid className={ classes.chatLog }>
          <Grid item>
            <ChatLog
              className={ classes.chatLog }
              handleSendNewChatMessage={ handleSendNewChatMessage }
              messages={ messages }
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
