import { useMemo, useCallback, useEffect } from 'react';
import { getCurrentShips } from './helpers/getCurrentShips';
import { CONTAINER_HEIGHT, shipsData, MARGIN } from './data';
import styles from './ShipsMenu.scss';
import type { Props } from './types';

export const ShipsMenu = ({
    ships = shipsData,
    imgWidth,
    onDragStart,
    onDragEnter,
    onDrop,
    onDragEnd,
    onDragOver,
    onContextMenu,
}: Props) => {
    const currentShips = useMemo(
        () => getCurrentShips({ ships, imgWidth }),
        [ships, imgWidth],
    );

    const handlerContextMenu = useCallback(
        (event) => {
            if (onContextMenu) onContextMenu(event);
        },
        [onContextMenu],
    );

    /** Начало перемещения */
    const handlerDragStart = useCallback(
        (event) => {
            if (onDragStart) onDragStart(event);
        },
        [onDragStart],
    );

    /** Перемещение блока по окну */
    const handlerDragOver = useCallback(
        (event) => {
            // prevent default to allow drop
            event.preventDefault();
            if (onDragOver) onDragOver(event);
        },
        [onDragOver],
    );

    /** Попадание блока в какую то область */
    const handlerDragEnter = useCallback(
        (event) => {
            if (onDragEnter) onDragEnter(event);
        },
        [onDragEnter],
    );

    /** Прекращение перемещения. Срабатывает раньше события dragend */
    const handlerDrop = useCallback(
        (event) => {
            if (onDrop) onDrop(event);
        },
        [onDrop],
    );

    /** Прекращение перемещения */
    const handlerDragEnd = useCallback(
        (event) => {
            if (onDragEnd) onDragEnd(event);
        },
        [onDragEnd],
    );

    useEffect(() => {
        document.addEventListener('dragstart', handlerDragStart);
        document.addEventListener('dragend', handlerDragEnd);
        document.addEventListener('dragover', handlerDragOver);
        document.addEventListener('dragenter', handlerDragEnter);
        document.addEventListener('drop', handlerDrop);
        return () => {
            document.removeEventListener('dragstart', handlerDragStart);
            document.removeEventListener('dragend', handlerDragEnd);
            document.removeEventListener('dragover', handlerDragOver);
            document.removeEventListener('dragenter', handlerDragEnter);
            document.removeEventListener('drop', handlerDrop);
        };
    }, [
        handlerDragStart,
        handlerDragEnd,
        handlerDragOver,
        handlerDragEnter,
        handlerDrop,
    ]);

    return (
        <div
            className={styles.container}
            style={{
                width: imgWidth * 8 + MARGIN * 7,
                height: CONTAINER_HEIGHT,
            }}
            onContextMenu={handlerContextMenu}
        >
            {currentShips.map(({ id, type, src, bottom, left, width }) => (
                <img
                    alt=""
                    key={id}
                    width={width}
                    id={id}
                    data-ship-id={id}
                    data-deck={type}
                    data-left={left}
                    data-bottom={bottom}
                    src={src}
                    style={{ bottom, left }}
                    draggable
                />
            ))}
        </div>
    );
};
