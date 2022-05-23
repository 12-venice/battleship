import { User } from 'src/store/reducers/user';
import { btnProps } from '../Button/types';

export type ToastType = {
    id?: string;
    title?: string;
    message?: string;
    user?: User;
    type?:  'danger' | 'warning' | 'success',
    buttons?: btnProps[];
};

export type Props = {
    position: string;
    autoDelete: boolean;
    autoDeleteTime: number;
};
