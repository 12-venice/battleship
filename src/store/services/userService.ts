import {
    setUser,
    User,
    loadFailed,
    loadPending,
    loadSuccess,
} from '../reducers/user';
import { store } from '../../index';

export const userService = {
    setUser: (user: User) => store.dispatch(setUser(user)),
    failed: () => store.dispatch(loadFailed()),
    pending: () => store.dispatch(loadPending()),
    success: () => store.dispatch(loadSuccess()),
};
