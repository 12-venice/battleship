import { User } from 'src/store/reducers/user';

export type CommentProps = {
    user: User;
    topic: string;
    createdAt: string;
    message: string;
    _id: string;
    subcomments: CommentProps[];
    deleteFunc: () => void;
    editFunc: () => void;
};
