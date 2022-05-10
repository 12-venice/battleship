import { MouseEventHandler, ReactElement, useRef } from 'react';
import { Button } from 'src/components/Button';
import { Props } from 'src/components/ModalWindow/types';
import { useFullscreen } from './useFullScreen';
import styles from './Fullscreen.scss';

export const FullScreenView: Props = ({ children }) => {
    const element = useRef(null);
    let isFullscreen: null;
    let setIsFullscreen;

    try {
        [isFullscreen, setIsFullscreen] = useFullscreen(element);
    } catch (e) {
        isFullscreen = null;
        setIsFullscreen = undefined;
    }

    const handleExitFullscreen = () => document.exitFullscreen();
    const selectIcon = () => {
        if (isFullscreen) {
            return <i className="material-icons small">fullscreen_exit</i>;
        }
        return <i className="material-icons small">fullscreen</i>;
    };

    return (
        <div className={styles.fullscreen__background} ref={element}>
            <Button
                className={styles.fullscreen__button}
                skin="quad"
                color="green"
                title={selectIcon() as ReactElement}
                onClick={
                    (isFullscreen
                        ? handleExitFullscreen
                        : setIsFullscreen) as MouseEventHandler
                }
            />
            <div className={styles.fullscreen__content}>{children}</div>
        </div>
    );
};
