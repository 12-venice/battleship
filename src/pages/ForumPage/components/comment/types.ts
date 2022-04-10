import { FC } from "react";

type CommentProps = {
    name?: string;
    date?: string;
    description?: string;
};
  
export type Props = FC<CommentProps>;