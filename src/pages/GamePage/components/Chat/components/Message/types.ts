import { User } from 'src/store/reducers/user';

export type messageType = {
    _id: string;
    text: string;
    user: User;
    createdAt: Date;
    delivered: boolean;
};
