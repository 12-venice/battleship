import { MouseEvent, FC } from "react";

type TopicProps = {
    name?: string;
    date?: string;
    theme?: string;
    description?: string;
};

export type handleClickType = (event: MouseEvent<HTMLDivElement>) => void
  
export type Props = FC<TopicProps>;