/* eslint-disable no-param-reassign */
// @ts-nocheck
// Отключены для теста
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */

import { btnProps } from 'src/components/Button/types';
import { User } from './user';

export interface Notification {
    id?: string;
    title?: string;
    message?: string;
    user?: User;
    type?: 'danger' | 'warning' | 'success';
    buttons?: btnProps[];
    autoDelete?: boolean;
    autoDeleteTime?: number;
    loader?: boolean;
}

export interface DelI {
    selector: string;
    element: string;
}

export type NotificationState = Notification[];

const actions: Record<string, string> = {
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
    SMART_DELETE_NOTIFICATION: 'SMART_DELETE_NOTIFICATION',
    RESET_NOTIFICATION: 'RESET_NOTIFICATION',
};

interface BaseActionType<T> {
    type: T;
}
interface ItemActionType extends BaseActionType<keyof typeof actions> {
    data: Notification | string | DelI;
}

const defaultState: NotificationState = [];

export function notificationReducer(
    state: NotificationState = defaultState,
    { type, data }: ItemActionType,
): NotificationState {
    switch (type) {
        case actions.ADD_NOTIFICATION: {
            state.push(data as Notification);
            return [...state];
        }
        case actions.DELETE_NOTIFICATION: {
            const index = state.findIndex(
                (toast) => toast.id === (data as string),
            );
            state.splice(index, 1);
            return [...state];
        }
        case actions.SMART_DELETE_NOTIFICATION: {
            const index = state.findIndex(
                (toast) => toast[data.selector] === data.element,
            );
            state.splice(index, 1);
            return [...state];
        }
        case actions.RESET_NOTIFICATION: {
            state = defaultState;
            return [...state];
        }
        default:
            return state;
    }
}

export function addNotification(data: Notification): ItemActionType {
    return { type: actions.ADD_NOTIFICATION, data };
}

export function deleteNotification(data: string): ItemActionType {
    return { type: actions.DELETE_NOTIFICATION, data };
}

export function smartDeleteNotification(data: DelI): ItemActionType {
    return { type: actions.SMART_DELETE_NOTIFICATION, data };
}

export function resetNotification(): ItemActionType {
    return { type: actions.RESET_NOTIFICATION, data: '' };
}
