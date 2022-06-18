import { User } from 'src/store/reducers/user';

export type CommentProps = {
    user: User;
    createdAt: string;
    message: string;
    _id: string;
    subcomments: CommentProps[];
};
