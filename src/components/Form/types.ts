import { Dispatch } from 'react';

export type fieldsProps = {
    type?: string;
    title?: string;
    defaultValue?: string | number;
    name: string;
    className?: string;
    validateType?: string;
    validateMsgTrue?: string;
    validateMsgFalse?: string;
};

type SetStateAction<S> = S | ((prevState: S) => S);

export type formProps = {
    inputs: fieldsProps[];
    setData: Dispatch<SetStateAction<{}>>;
    submitTitle: string;
    disabled?: boolean;
};
