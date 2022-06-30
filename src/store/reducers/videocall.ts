/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
/* eslint-disable no-fallthrough */
/* eslint-disable indent */
import Peer from 'simple-peer';

export type videoCallStatus = 'calling' | 'live' | 'end';

export type videoCall = {
    status: videoCallStatus;
    stream: MediaStream | null;
    signal: MediaStream | null;
    room: string;
};

const actions: Record<string, string> = {
    UPDATE_ROOM: 'UPDATE_ROOM',
    UPDATE_SIGNAL: 'UPDATE_SIGNAL',
    UPDATE_STREAM: 'UPDATE_STREAM',
    UPDATE_STATUS: 'UPDATE_STATUS',
    CONNECT_CLOSE: 'CONNECT_CLOSE',
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
    room: '',
};

export function videoCallReducer(
    state: videoCall = defaultState,
    { type, data }: ItemActionType,
): videoCall {
    switch (type) {
        case actions.UPDATE_ROOM: {
            return { ...state, ...{ room: data as string } };
        }
        case actions.UPDATE_SIGNAL: {
            return { ...state, ...{ signal: data as MediaStream } };
        }
        case actions.UPDATE_STREAM: {
            return { ...state, ...{ stream: data as MediaStream } };
        }
        case actions.UPDATE_STATUS: {
            return { ...state, ...{ status: data as videoCallStatus } };
        }
        case actions.CONNECT_CLOSE: {
            return { ...state, ...defaultState };
        }

        default:
            return state;
    }
}

export function updateRoom(data: string): ItemActionType {
    return { type: actions.UPDATE_ROOM, data };
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

export function connectClose(): ItemActionType {
    return { type: actions.CONNECT_CLOSE };
}
