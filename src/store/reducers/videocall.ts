/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
/* eslint-disable no-fallthrough */
/* eslint-disable indent */
import { stream } from 'favicons';
import Peer from 'simple-peer';

export type videoCallStatus =
    | 'busy'
    | 'calling'
    | 'accept'
    | 'cancel'
    | 'live'
    | 'end';

export type videoCall = {
    status: videoCallStatus;
    stream: MediaStream | null;
    signal: MediaStream | null;
    peer: Peer.Instance | null;
};

const actions: Record<string, string> = {
    UPDATE_PEER: 'UPDATE_PEER',
    UPDATE_SIGNAL: 'UPDATE_SIGNAL',
    UPDATE_STREAM: 'UPDATE_STREAM',
    UPDATE_STATUS: 'UPDATE_STATUS',
    GET_VIDEOCALL: 'GET_VIDEOCALL',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    data?: string | MediaStream | Peer.Instance;
}

const defaultState: videoCall = {
    status: 'end',
    stream: null,
    signal: null,
    peer: null,
};

export function videoCallReducer(
    state: videoCall = defaultState,
    { type, data }: ItemActionType,
): videoCall {
    switch (type) {
        case actions.UPDATE_PEER: {
            return {
                peer: data as Peer.Instance,
                stream: state.stream,
                signal: state.signal,
                status: state.status
            }
        };
        case actions.UPDATE_SIGNAL: {
            return {
                peer: state.peer,
                stream: data as MediaStream,
                signal: state.signal,
                status: state.status
            }
        };
        case actions.UPDATE_STREAM: {
            return {
                peer: state.peer,
                stream: state.stream,
                signal: data as MediaStream,
                status: state.status
            }
        };
        case actions.UPDATE_STATUS: {
            return {
                peer: state.peer,
                stream: state.stream,
                signal: state.signal,
                status: data as videoCallStatus
            }
        };
        case actions.GET_VIDEOCALL: {
            return state;
        }

        default:
            return state;
    }
}

export function updatePeer(data: Peer.Instance): ItemActionType {
    return { type: actions.UPDATE_PEER, data };
}

export function updateSignal(data: MediaStream): ItemActionType {
    return { type: actions.UPDATE_SIGNAL, data };
}

export function updateStream(data: MediaStream): ItemActionType {
    return { type: actions.UPDATE_STREAM, data };
}

export function updateStatus(data: videoCallStatus): ItemActionType {
    return { type: actions.UPDATE_STATUS, data };
}

export function getVideoCall(): ItemActionType {
    return { type: actions.GET_VIDEOCALL };
}
