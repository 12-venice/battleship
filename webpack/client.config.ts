/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack, { Configuration, Entry } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { IS_DEV, DIST_DIR, SRC_DIR } from './env';
import fileLoader from './loaders/file';
import cssLoader from './loaders/css';
import jsLoader from './loaders/js';
import WorkboxPlugin from 'workbox-webpack-plugin';

const config: Configuration = {
    name: 'client',
    target: 'web',
    mode: IS_DEV ? 'development' : 'production',
    entry: [
        IS_DEV && 'react-hot-loader/patch',
        IS_DEV && 'webpack-hot-middleware/client?reload=true',
        IS_DEV && 'css-hot-loader/hotModuleReplacement',
        path.join(SRC_DIR, 'client'),
    ].filter(Boolean) as unknown as Entry,

    module: {
        rules: [fileLoader.client, cssLoader.client, jsLoader.client],
    },

    output: {
        filename: '[name].js',
        path: DIST_DIR,
        publicPath: '/',
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: { 'react-dom': '@hot-loader/react-dom' },
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new FaviconsWebpackPlugin('./images/favicon.png'),
        ...(IS_DEV ? [new webpack.HotModuleReplacementPlugin()] : []),
        new WorkboxPlugin.GenerateSW({
            mode: process.env.NODE_ENV,
            disableDevLogs: true,
            maximumFileSizeToCacheInBytes: 3000000,
            clientsClaim: true,
            skipWaiting: true,
            cleanupOutdatedCaches: true,
        }),
    ],

    devtool: 'source-map',

    performance: {
        hints: IS_DEV ? false : 'warning',
    },

    optimization: {
        moduleIds: 'named',
        minimize: !IS_DEV,
        minimizer: !IS_DEV ? [new TerserPlugin()] : [],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
};

export default config;
