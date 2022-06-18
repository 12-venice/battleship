import { selectComment, selectMessage, selectTopic } from '../reducers/message';
import { store } from '../store';

export const messageService = {
    selectMessage: () => store.dispatch(selectMessage()),
    selectTopic: ({
        topic,
        theme,
        description,
    }: {
        theme: string;
        topic: string;
        description: string;
    }) => store.dispatch(selectTopic({ topic, theme, description })),
    selectComment: ({
        topic,
        comment,
        message,
    }: {
        comment: string;
        topic: string;
        message: string;
    }) => store.dispatch(selectComment({ topic, comment, message })),
};
