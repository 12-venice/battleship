import { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { User } from 'src/store/reducers/user';

export type TopicProps = {
    user: User;
    createdAt: string;
    theme: string;
    message: string;
    _id: string;
    isActiveTopic: string;
    setTopicId: Dispatch<SetStateAction<string>>;
    deleteFunc: (_id: string) => void;
    editFunc: (_id: string, theme: string, message: string) => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;
