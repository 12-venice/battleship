import { FC } from 'react';

type UpdateAvatarProps = {
    close: () => void;
};

export type Url = string;
export type File = Blob | string | undefined | null;
export type FileInput = HTMLInputElement;
export type Props = FC<UpdateAvatarProps>;
