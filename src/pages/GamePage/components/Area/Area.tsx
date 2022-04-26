/* eslint-disable react/jsx-no-useless-fragment */
import { useCallback, useEffect, forwardRef } from 'react';
import { drawMatrix } from './helpers/drawMatrix';
import { emptyMatrix } from './data';
import type { Props } from './types';

const Component = ({
    areaWidth,
    fillColor,
    canvasRef,
    matrix = emptyMatrix,
    ships,
}: Props) => {
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

    return <>{renderCanvas()}</>;
};

export const Area = forwardRef((props, canvasRef) => (
    <Component {...props} canvasRef={canvasRef} />
));
