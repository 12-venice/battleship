import {
    addUserOnline,
    removeUserOnline,
    setUserOnline,
    uOnline,
} from '../reducers/online';
import { store } from '../store';

export const OnlineService = {
    addUserOnline: (data: uOnline) => store.dispatch(addUserOnline(data)),
    removeUserOnline: (data: string) => store.dispatch(removeUserOnline(data)),
    setUserOnline: (data: uOnline[]) => store.dispatch(setUserOnline(data)),
};
