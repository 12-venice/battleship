/* eslint-disable @typescript-eslint/ban-types */
export type fieldsProps = {
    type?: string;
    title?: string;
    defaultValue?: string | number | string[];
    name: string;
    className?: string;
    validateType?: string;
    validateMsgFalse?: string;
};

export type formProps = {
    inputs: fieldsProps[];
    setData: Function;
    submitTitle: string;
    disabled?: boolean;
    checking?: boolean;
    styleClass?: string;
};
