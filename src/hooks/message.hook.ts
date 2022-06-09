/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback } from 'react';
import { notificationService } from 'src/store/services/notificationService';

export const useMessage = () =>
    useCallback((message, type?) => {
        if (message && message !== 'TokenExpiredError') {
            notificationService.addNotification({
                message,
                type: type || 'warning',
            });
        }
    }, []);
