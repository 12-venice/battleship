import { FC } from 'react';

export type CommentProps = {
    user: { display_name: string };
    createdAt: string;
    description: string;
    _id: string;
};

export type Props = FC<CommentProps>;
