import { FC, MouseEventHandler } from 'react';

import { CommentProps } from '../comment/types';

type TopicProps = {
    name?: string;
    date?: string;
    theme?: string;
    description?: string;
    comments?: CommentProps[];
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;

export type Props = FC<TopicProps>;
