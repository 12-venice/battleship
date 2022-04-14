// Возникает конфликт
/* eslint-disable implicit-arrow-linebreak */
import { useCallback } from 'react';
import M from 'materialize-css';

export const useMessage = () =>
    useCallback((text: string) => {
        if (M && text) {
            M.toast({ html: text });
        }
    }, []);
