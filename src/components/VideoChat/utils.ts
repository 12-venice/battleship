/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import freeice from 'freeice';
import Peer, { SignalData } from 'simple-peer';
import { Socket } from 'socket.io-client';
import { User } from 'src/store/reducers/user';
import { notificationService } from 'src/store/services/notificationService';
import { VideoCallService } from 'src/store/services/videoCallService';
import { acceptCallType, cancelCallType } from './types';

export const CallPeer = async ({
    user,
    from,
    socket,
    room,
}: {
    user: User;
    from: string;
    socket: Socket;
    room: string,
}) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        config: { iceServers: freeice() },
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    });
    VideoCallService.updatePeer(peer);
    VideoCallService.updateStatus('calling');
    VideoCallService.updateRoom(room);

    peer.on('signal', (data) => {
        socket.emit('call:sent', {
            userToCall: user._id,
            signalData: data,
            from,
            room,
        });
    });
    peer.on('stream', (partnerStream: MediaStream) => {
        VideoCallService.updateStream(partnerStream);
        VideoCallService.updateStatus('live');
    });
    peer.on('close', () => {
        console.log('CLOSE');
        VideoCallService.updateStatus('end');
    });
    peer.on('error', (err) => {
        console.log('PEER ERROR: ', err);
        VideoCallService.updateStatus('end');
    });
};

export const AcceptCall = ({ signal, from, socket, room }: acceptCallType) => {
    VideoCallService.updateRoom(room);
    VideoCallService.updateStatus('calling');
    const peer = new Peer({
        initiator: false,
        trickle: false,
        config: { iceServers: freeice() },
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    });
    VideoCallService.updatePeer(peer);
    peer.on('signal', (data: SignalData) => {
        socket.emit('call:accept', { signal: data, to: from });
    });

    peer.on('stream', (partnerStream: MediaStream) => {
        VideoCallService.updateStream(partnerStream);
        VideoCallService.updateStatus('live');
    });
    peer.on('close', () => {
        console.log('CLOSE');
        VideoCallService.updateStatus('end');
    });
    peer.on('error', (err) => {
        console.log('PEER ERROR: ', err);
        VideoCallService.updateStatus('end');
    });
    peer.signal(signal as unknown as SignalData);
    notificationService.smartDeleteNotification({
        selector: 'title',
        element: from.display_name,
    });
};

export const CancelCall = ({ from, socket }: cancelCallType) => {
    VideoCallService.updateStatus('end');
    notificationService.smartDeleteNotification({
        selector: 'title',
        element: from.display_name,
    });
    socket.emit('call:cancel', { from });
};
