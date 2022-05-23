import { useCallback, useEffect, useReducer, useState } from 'react';
import { Toast } from 'src/components/Toast';
import { ToastType } from 'src/components/Toast/types';
import { v4 as uuidv4 } from 'uuid';

const newToast = (data: ToastType) => ({
    id: uuidv4(),
    user: data.user ?? undefined,
    title: data.title ?? undefined,
    message: data.message ?? '',
    buttons: data.buttons ?? undefined,
});

const init = (initialList: []) => ({ list: initialList });

const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return { list: state.list.push(newToast(action.payload)) };
        case 'reset':
            return init(action.payload);
        default:
            throw new Error();
    }
};

export const useMessage = () => {
    const [state, dispatch] = useReducer(reducer, [], init);

    const message = (data: ToastType) =>
        dispatch({ type: 'add', payload: data });

    const { list } = state;

    return { list, message };
};
