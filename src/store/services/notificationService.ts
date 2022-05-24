
import { ToastType } from 'src/components/Toast/types';
import { store } from '../../client';
import { addNotification, deleteNotification, Notification, resetNotification } from '../reducers/notifications';
import { v4 as uuidv4 } from 'uuid';

const newToast = (data: ToastType): Notification => {
    const id = uuidv4()
    return ({
        id: id,
        user: data.user ?? undefined,
        title: data.title ?? '',
        message: data.message ?? '',
        buttons: data.buttons ?? undefined,
        type: data.type ?? undefined
    })
};

export const notificationService = {
    addNotification: (data: Notification) => store.dispatch(addNotification(newToast(data))),
    deleteNotification: (data: string) => store.dispatch(deleteNotification(data)),
    resetNotification: () => store.dispatch(resetNotification()),
};
