// Конфликт линтеров
/* eslint-disable object-curly-newline */
import { Dispatch, FC, MouseEventHandler, SetStateAction } from 'react';

import { CommentProps } from '../comment/types';

type TopicProps = {
    name?: string;
    date?: string;
    theme?: string;
    description?: string;
    comments?: CommentProps[];
    _id: string;
    setTopicId: Dispatch<SetStateAction<string>>;
    deleteFunc: (_id: string) => void;
    editFunc: (_id: string, theme: string, description: string) => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;

export type Props = FC<TopicProps>;
