import { User } from 'src/store/reducers/user';

export type ToastType = {
    id: string;
    message: string;
    socketId?: string;
    user: User;
};
