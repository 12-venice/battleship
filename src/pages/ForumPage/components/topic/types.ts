import { MouseEvent, FC } from "react";

import { CommentProps } from "../comment/types"

type TopicProps = {
    name?: string;
    date?: string;
    theme?: string;
    description?: string;
    comments?: CommentProps[];
};

export type handleClickType = (event: MouseEvent<HTMLDivElement>) => void
  
export type Props = FC<TopicProps>;