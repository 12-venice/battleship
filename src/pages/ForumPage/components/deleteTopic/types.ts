import { FC } from 'react';

type deleteTopicProps = {
    close: () => void;
    _id: string;
};

export type Props = FC<deleteTopicProps>;
