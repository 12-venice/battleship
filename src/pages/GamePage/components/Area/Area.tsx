/* eslint-disable react/jsx-no-useless-fragment */
import { useCallback, useEffect, forwardRef } from 'react';
import { drawMatrix } from './helpers/drawMatrix';
import { emptyMatrix } from './data';
import type { Props } from './types';

export const Area = forwardRef(
    (
        {
            areaWidth,
            fillColor,
            matrix = emptyMatrix,
            ships,
            onClick,
            onCursorEnter,
            onCursorOut,
            onCursorOver,
        }: Props,
        canvasRef,
    ) => {
        const handlerClick = useCallback(
            (event) => {
                // console.log('onMouseEnter', event);
                if (onClick) onClick(event);
            },
            [onClick],
        );

        const handlerMouseEnter = useCallback(
            (event) => {
                // console.log('onMouseEnter', event);
                if (onCursorEnter) onCursorEnter(event);
            },
            [onCursorEnter],
        );

        const handlerMouseLeave = useCallback(
            (event) => {
                // console.log('onMouseLeave', event);
                if (onCursorOver) onCursorOver(event);
            },
            [onCursorOver],
        );

        useEffect(() => {
            if (!canvasRef?.current) return;

            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            drawMatrix({
                ctx,
                areaWidth,
                fillColor,
                matrix,
                ships,
            });
        }, [canvasRef, areaWidth, fillColor, matrix, ships]);

        const renderCanvas = useCallback(
            () => (
                <div>
                    {canvasRef && (
                        <canvas
                            ref={canvasRef}
                            width={areaWidth}
                            height={areaWidth}
                        />
                    )}
                </div>
            ),
            [canvasRef, areaWidth],
        );

        return (
            <div
                onMouseEnter={handlerMouseEnter}
                onMouseLeave={handlerMouseLeave}
                onClick={handlerClick}
            >
                {renderCanvas()}
            </div>
        );
    },
);
