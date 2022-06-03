import { StringArray } from 'socketRoutes/usersOnline';
import {
    addUserOnline,
    removeUserOnline,
    setUserOnline,
} from '../reducers/online';
import { store } from '../store';

export const OnlineService = {
    addUserOnline: (data: { socketId: string; id: string }) =>
        store.dispatch(addUserOnline(data)),
    removeUserOnline: (data: { socketId: string }) =>
        store.dispatch(removeUserOnline(data)),
    setUserOnline: (data: StringArray) => store.dispatch(setUserOnline(data)),
};
