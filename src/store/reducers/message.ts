/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable default-param-last */
/* eslint-disable indent */

type TypeMSG = 'comment' | 'subcomment' | 'message' | '';

export type TypeMSGState = {
    type: TypeMSG;
    topic?: string;
    comment?: string;
    theme?: string;
    description?: string;
    message?: string;
};

const actions: Record<string, string> = {
    SET_MESSAGE: 'SET_MESSAGE',
    SET_TOPIC: 'SET_TOPIC',
    SET_COMMENT: 'SET_COMMENT',
};

interface BaseActionType<T> {
    type: T;
}

const defaultState: TypeMSGState = {
    type: '',
    topic: '',
    comment: '',
    theme: '',
    description: '',
    message: '',
};

interface ItemActionType extends BaseActionType<keyof typeof actions> {
    topic?: string;
    comment?: string;
    theme?: string;
    description?: string;
    message?: string;
}

export function MSGReducer(
    state: TypeMSGState = defaultState,
    { type, topic, comment, theme, description, message }: ItemActionType,
): TypeMSGState {
    switch (type) {
        case actions.SET_MESSAGE:
            return {
                ...state,
                ...{
                    type: 'message',
                    topic: '',
                    comment: '',
                    theme: '',
                    description: '',
                    message: '',
                },
            };
        case actions.SET_TOPIC:
            return {
                ...state,
                ...{
                    type: 'comment',
                    topic,
                    comment: '',
                    theme,
                    description,
                    message: '',
                },
            };
        case actions.SET_COMMENT:
            return {
                ...state,
                ...{
                    type: 'subcomment',
                    topic,
                    comment,
                    theme: '',
                    description: '',
                    message,
                },
            };
        default:
            return state;
    }
}

export function selectMessage(): ItemActionType {
    return { type: actions.SET_MESSAGE };
}
export function selectTopic({
    topic,
    theme,
    description,
}: {
    topic: string;
    theme: string;
    description: string;
}): ItemActionType {
    return { type: actions.SET_TOPIC, topic, theme, description };
}
export function selectComment({
    comment,
    topic,
    message,
}: {
    comment: string;
    topic: string;
    message: string;
}): ItemActionType {
    return { type: actions.SET_COMMENT, topic, comment, message };
}
