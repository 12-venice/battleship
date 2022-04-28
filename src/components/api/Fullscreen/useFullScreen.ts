import { MutableRefObject, useLayoutEffect, useState } from 'react';

export function useFullscreen(ref: MutableRefObject<HTMLElement | null>) {
    const [isFullscreen, setIsFullscreen] = useState(
        document.fullscreenElement,
    );

    const setFullscreen = () => {
        if (!ref.current) return;

        ref.current
            .requestFullscreen()
            .then(() => {
                setIsFullscreen(document.fullscreenElement);
            })
            .catch(() => setIsFullscreen(null));
    };

    useLayoutEffect(() => {
        document.onfullscreenchange = () =>
            setIsFullscreen(document.fullscreenElement);
    });

    return [isFullscreen, setFullscreen];
}
