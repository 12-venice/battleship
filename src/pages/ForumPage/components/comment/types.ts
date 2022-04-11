import { FC } from 'react';

export type CommentProps = {
    name?: string;
    date?: string;
    description?: string;
};

export type Props = FC<CommentProps>;
