import { User } from 'src/store/reducers/user';

export type Props = {
    user?: User | null;
    avatarPosition?: 'right' | 'left';
};
