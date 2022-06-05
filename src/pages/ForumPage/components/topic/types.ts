import { Dispatch, FC, MouseEventHandler, SetStateAction } from 'react';

export type TopicProps = {
    user: { display_name: string };
    createdAt: string;
    theme: string;
    description?: string;
    _id: string;
    isActiveTopic: string;
    setTopicId: Dispatch<SetStateAction<string>>;
    deleteFunc: (_id: string) => void;
    editFunc: (_id: string, theme: string, description: string) => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;

export type Props = FC<TopicProps>;
