import { Dispatch, FC, MouseEventHandler, SetStateAction } from 'react';

import { CommentProps } from '../comment/types';
import { User } from '../../../../store/reducers/user';

export type TopicProps = {
    name?: string;
    date?: string;
    theme?: string;
    description?: string;
    comments?: CommentProps[];
    user?: User;
    id: string;
    isActiveTopic: string;
    setTopicId: Dispatch<SetStateAction<string>>;
    deleteFunc: (_id: string) => void;
    editFunc: (_id: string, theme: string, description: string) => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;

export type Props = FC<TopicProps>;
