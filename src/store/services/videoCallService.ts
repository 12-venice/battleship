import Peer from 'simple-peer';
import {
    getVideoCall,
    updatePeer,
    updateSignal,
    updateStatus,
    updateStream,
    videoCallStatus,
} from '../reducers/videocall';
import { store } from '../store';

export const VideoCallService = {
    updatePeer: (data: Peer.Instance) => store.dispatch(updatePeer(data)),
    updateSignal: (data: MediaStream) => store.dispatch(updateSignal(data)),
    updateStream: (data: MediaStream) => store.dispatch(updateStream(data)),
    updateStatus: (data: videoCallStatus) => store.dispatch(updateStatus(data)),
    getVideoCall: () => store.dispatch(getVideoCall()),
};
