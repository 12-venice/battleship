import {
    addUserOnline,
    removeUserOnline,
    setUserOnline,
} from '../reducers/online';
import { store } from '../store';

export const OnlineService = {
    addUserOnline: (data: string) => store.dispatch(addUserOnline(data)),
    removeUserOnline: (data: string) => store.dispatch(removeUserOnline(data)),
    setUserOnline: (data: string[]) => store.dispatch(setUserOnline(data)),
};
