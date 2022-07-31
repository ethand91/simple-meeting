const getLocalMediaStream = async () =>
  await navigator.mediaDevices.getUserMedia({ audio: true, video: { width: 640, height: 480 } });

const initializePeerConnection = () => {
  const config = { iceServers: [{ urls: [ 'stun:stun1.l.google.com:19302' ] }] };
  const peerConnection = new RTCPeerConnection(config);

  return peerConnection;
};

export {
  getLocalMediaStream,
  initializePeerConnection
};
