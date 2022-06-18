import { MouseEventHandler } from 'react';
import { User } from 'src/store/reducers/user';

export type TopicProps = {
    user: User;
    createdAt: string;
    theme: string;
    description: string;
    _id: string;
    deleteFunc: () => void;
    editFunc: () => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;
