import path from 'path';
import webpack, { Configuration } from 'webpack';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { STATS_OPTIONS, VENDORS } from '../assets/config';
import { IS_DEV, DIST_DIR } from '../assets/env';

const config: Configuration = {
    target: 'web',
    entry: {
        vendors: VENDORS,
    },
    output: {
        library: '[name]_[hash]',
        filename: '[name]_[hash].js',
        path: path.join(DIST_DIR, 'client', '_'),
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.join(DIST_DIR, 'webpack', 'vendors-manifest.json'),
        }),
        new MiniCssExtractPlugin({ filename: '[name]_[hash].css' }),
        !IS_DEV && new CompressionWebpackPlugin({ minRatio: 1 }),
    ].filter(Boolean),
    stats: STATS_OPTIONS,
};

// eslint-disable-next-line import/no-default-export
export default config;
