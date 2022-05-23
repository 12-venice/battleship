import { User } from 'src/store/reducers/user';
import { btnProps } from '../Button/types';

export type ToastType = {
    id?: string;
    title?: string;
    message?: string;
    user?: User;
    buttons?: btnProps[];
};

export type Props = {
    toastList: ToastType[];
    position: string;
    autoDelete: boolean;
    autoDeleteTime: number;
};
