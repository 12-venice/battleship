import { FC } from 'react';

type addTopicProps = {
    close: () => void;
    _id: string;
    oldTheme: string;
    oldDescription: string;
};

export type Props = FC<addTopicProps>;
