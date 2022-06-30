/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import freeice from 'freeice';
import Peer, { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';
import { User } from 'src/store/reducers/user';
import { notificationService } from 'src/store/services/notificationService';
import { VideoCallService } from 'src/store/services/videoCallService';
import { audioConstraints, fakeVideo } from './config';
import { acceptCallType, cancelCallType } from './types';

let _peer: Peer.Instance | null;

const setPeer = (config: {}) => {
    _peer = new Peer(config);
};

export const getPeer = () => _peer;

export const destroyPeer = () => {
    if (_peer !== null) {
        _peer.destroy();
    }
    _peer = null;
};

export const CallPeer = async ({
    user,
    from,
    socket,
    room,
}: {
    user: User;
    from: string;
    socket: Socket;
    room: string;
}) => {
    const media = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
    });
    const audioTrack = media.getAudioTracks()[0];
    const stream = new MediaStream([audioTrack, fakeVideo()]);
    VideoCallService.updateSignal(stream);

    const config = {
        initiator: true,
        trickle: false,
        config: { iceServers: freeice() },
        stream,
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    };

    setPeer(config);

    VideoCallService.updateStatus('calling');
    VideoCallService.updateRoom(room);

    getPeer()?.on('signal', (data) => {
        console.log('Calling...');
        socket.emit('call:sent', {
            userToCall: user._id,
            signalData: data,
            from,
            room,
        });
    });

    getPeer()?.on('stream', (partnerStream: MediaStream) => {
        VideoCallService.updateStream(partnerStream);
    });

    socket.on('call:accept', (signal: SignalData) => {
        VideoCallService.updateStatus('live');
        getPeer()?.signal(signal);
    });
};

export const AcceptCall = async ({
    signal,
    from,
    socket,
    room,
}: acceptCallType) => {
    VideoCallService.updateRoom(room);
    VideoCallService.updateStatus('live');
    const media = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
    });
    const audioTrack = media.getAudioTracks()[0];
    const stream = new MediaStream([audioTrack, fakeVideo()]);
    VideoCallService.updateSignal(stream);

    const config = {
        initiator: false,
        trickle: false,
        config: { iceServers: freeice() },
        stream,
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    };

    setPeer(config);

    getPeer()?.on('signal', (data: SignalData) => {
        socket.emit('call:accept', { signal: data, to: from });
    });

    getPeer()?.on('stream', (partnerStream: MediaStream) => {
        VideoCallService.updateStream(partnerStream);
    });

    getPeer()?.signal(signal as unknown as SignalData);

    notificationService.smartDeleteNotification({
        selector: 'title',
        element: from.display_name,
    });
};

export const CancelCall = ({ from, socket }: cancelCallType) => {
    getPeer()?.destroy();
    destroyPeer();
    VideoCallService.connectClose();
    notificationService.smartDeleteNotification({
        selector: 'title',
        element: from.display_name,
    });
    socket.emit('call:cancel', { from });
};
