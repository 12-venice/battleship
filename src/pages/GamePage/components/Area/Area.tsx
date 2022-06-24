// @ts-nocheck
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
            fireType,
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
                if (onClick) onClick(event);
            },
            [onClick],
        );

        const handlerMouseEnter = useCallback(
            (event) => {
                if (onCursorEnter) onCursorEnter(event);
            },
            [onCursorEnter],
        );

        const handlerMouseLeave = useCallback(
            (event) => {
                if (onCursorOver) onCursorOver(event);
            },
            [onCursorOver],
        );

        useEffect(() => {
            if (!canvasRef?.current) return;

            const renderCtx = canvasRef.current.getContext('2d');
            if (!renderCtx) return;

            drawMatrix({
                fireType,
                renderCtx,
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
                aria-hidden
                onMouseEnter={handlerMouseEnter}
                onMouseLeave={handlerMouseLeave}
                onClick={handlerClick}
            >
                {renderCanvas()}
            </div>
        );
    },
);
