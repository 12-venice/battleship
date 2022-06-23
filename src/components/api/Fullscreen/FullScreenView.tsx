// @ts-nocheck
import { FC, useEffect, useRef } from 'react';
import { useFullscreen } from './useFullScreen';
import styles from './Fullscreen.scss';

export const FullScreenView: FC<{ isFullscr: boolean }> = ({
    children,
    isFullscr,
}) => {
    const element = useRef(null);
    let isFullscreen: null;
    let setIsFullscreen: (() => void) | undefined;

    try {
        [isFullscreen, setIsFullscreen] = useFullscreen(element);
    } catch (e) {
        isFullscreen = null;
        setIsFullscreen = undefined;
    }
    const handleExitFullscreen = () => document.exitFullscreen();
    useEffect(() => {
        if (isFullscreen) {
            handleExitFullscreen();
        } else if (isFullscr) {
            setIsFullscreen();
        }
    }, [isFullscr]);

    return (
        <div className={styles.fullscreen__background} ref={element}>
            <div className={styles.fullscreen__content}>{children}</div>
        </div>
    );
};
