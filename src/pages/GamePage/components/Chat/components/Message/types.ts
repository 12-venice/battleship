import { User } from 'src/store/reducers/user';

export type messageType = {
    _id: string;
    text: string;
    user: User;
    date: Date;
    delivered: boolean;
};
