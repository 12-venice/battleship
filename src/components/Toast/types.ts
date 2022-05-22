import { User } from 'src/store/reducers/user';
import { ButtonProps } from '../Button/types';

export type ToastType = {
    id: string;
    message?: string;
    user?: User;
    buttons?: ButtonProps[];
};
