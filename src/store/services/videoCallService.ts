import {
    connectClose,
    updateRoom,
    updateSignal,
    updateStatus,
    updateStream,
    videoCallStatus,
} from '../reducers/videocall';
import { store } from '../store';

export const VideoCallService = {
    updateRoom: (data: string) => store.dispatch(updateRoom(data)),
    updateSignal: (data: MediaStream) => store.dispatch(updateSignal(data)),
    updateStream: (data: MediaStream) => store.dispatch(updateStream(data)),
    updateStatus: (data: videoCallStatus) => store.dispatch(updateStatus(data)),
    connectClose: () => store.dispatch(connectClose()),
};
