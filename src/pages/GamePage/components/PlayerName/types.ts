import { User } from "src/store/reducers/user";

export type Props = {
    user: User | null
    /** Позиция аватара относительно имени игрока */
    avatarPosition?: 'right' | 'left';
};
