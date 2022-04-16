export type Props = {
    /** Имя игрока */
    name: string;
    /** Путь до изображения аватара */
    avatarSrc?: string;
    /** Позиция аватара относительно имени игрока */
    avatarPosition?: 'right' | 'left';
};
