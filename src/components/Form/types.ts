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

export type formProps = {
    fields: { type: string; title: string }[];
    setData: () => void;
    submit: JSX.Element;
};
