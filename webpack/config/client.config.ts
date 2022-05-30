import path from 'path';
import webpack, { Configuration } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { IS_DEV, DIST_DIR, SRC_DIR } from '../assets/env';

import fileLoader from '../loaders/file';
import cssLoader from '../loaders/css';
import jsLoader from '../loaders/js';

const config: Configuration = {
    target: 'web',
    // mode: IS_DEV ? 'development' : 'production',
    entry: path.join(SRC_DIR, 'bundles', 'desktop.tsx'),
    module: {
        rules: [fileLoader.client, cssLoader.client, jsLoader.client],
    },
    output: {
        path: path.join(DIST_DIR, 'client', '_'),
        filename: '[name].js',
        publicPath: '/',
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: { 'react-dom': '@hot-loader/react-dom' },
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        // Plugin для HMR
        new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),

    devtool: 'source-map',

    performance: {
        hints: IS_DEV ? false : 'warning',
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
