import { useEffect, useRef } from 'react';
import { drawMatrix } from './helpers/drawMatrix';
import type { Props } from './types';

export const Area = ({ areaWidth, fillColor }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        drawMatrix({ ctx, areaWidth, fillColor });
    }, [areaWidth, fillColor]);

    return <canvas ref={canvasRef} width={areaWidth} height={areaWidth} />;
};
