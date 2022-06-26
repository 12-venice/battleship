import { v4 as uuidv4 } from 'uuid';
import {
    addNotification,
    deleteNotification,
    DelI,
    Notification,
    resetNotification,
    smartDeleteNotification,
} from '../reducers/notifications';
import { store } from '../store';

const newToast = (data: Notification) => {
    const id = uuidv4();
    return {
        id,
        user: data.user ?? undefined,
        title: data.title ?? '',
        message: data.message ?? '',
        buttons: data.buttons ?? undefined,
        type: data.type ?? undefined,
        autoDelete: data.autoDelete ?? true,
        autoDeleteTime: data.autoDeleteTime ?? 3000,
        loader: data.loader ?? false,
    };
};

export const notificationService = {
    addNotification: (data: Notification) =>
        store.dispatch(addNotification(newToast(data))),
    deleteNotification: (data: string) =>
        store.dispatch(deleteNotification(data)),
    smartDeleteNotification: (data: DelI) =>
        store.dispatch(smartDeleteNotification(data)),
    resetNotification: () => store.dispatch(resetNotification()),
};
