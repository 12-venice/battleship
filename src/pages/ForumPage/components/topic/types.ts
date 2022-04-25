import { Dispatch, FC, MouseEventHandler, SetStateAction } from 'react';

type TopicProps = {
    name: string;
    date: string;
    theme: string;
    description?: string;
    id: string;
    setTopicId: Dispatch<SetStateAction<string>>;
    deleteFunc: (_id: string) => void;
    editFunc: (_id: string, theme: string, description: string) => void;
};

export type handleClickType = MouseEventHandler<HTMLDivElement>;

export type Props = FC<TopicProps>;
