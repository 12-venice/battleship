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
}: {
    user: User;
    from: string;
    socket: Socket;
}) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        config: { iceServers: freeice() },
        offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
    });
    VideoCallService.updatePeer(peer);

    peer.on('signal', (data) => {
        socket.emit('call:sent', {
            userToCall: user._id,
            signalData: data,
            from,
        });
    });
    peer.on('stream', (partnerStream: MediaStream) => {
        VideoCallService.updateStream(partnerStream);
    });
    peer.on('close', () => {
        console.log('CLOSE');
    });
    peer.on('error', (err) => {
        console.log('PEER ERROR: ', err);
    });
};

export const AcceptCall = ({ signal, from, socket }: acceptCallType) => {
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
    });
    peer.on('close', () => {
        console.log('CLOSE');
    });
    peer.on('error', (err) => {
        console.log('PEER ERROR: ', err);
    });
    peer.signal(signal as unknown as SignalData);
};

export const CancelCall = ({ fromUser, socket }: cancelCallType) => {
    notificationService.smartDeleteNotification({
        selector: 'title',
        element: fromUser.display_name,
    });
    socket.emit('call:cancel', { from });
};
