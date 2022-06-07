<<<<<<< HEAD:src/pages/GamePage/components/PlayerName/types.ts
import { User } from "src/store/reducers/user";

export type Props = {
    user: User | null
=======
import { User } from 'src/store/reducers/user';

export type Props = {
    user?: User | null;
>>>>>>> bd337570264a713a1a87763f6ca7369b80e2c18d:src/pages/GamePage/components/Header/components/PlayerName/types.ts
    /** Позиция аватара относительно имени игрока */
    avatarPosition?: 'right' | 'left';
};
