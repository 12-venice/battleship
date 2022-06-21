/* eslint-disable indent */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IS_DEV, DIST_DIR, SRC_DIR } from './env';
import fileLoader from './loaders/file';
import cssLoader from './loaders/css';
import jsLoader from './loaders/js';

const config: Configuration = {
    name: 'server',
    mode: IS_DEV ? 'development' : 'production',
    target: 'node',
    node: { __dirname: false },
    entry: [path.join(SRC_DIR, 'server')],

    module: {
        rules: [fileLoader.server, cssLoader.server, jsLoader.server],
    },

    optimization: {
        nodeEnv: false,
    },

    output: {
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        path: DIST_DIR,
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },

    devtool: 'source-map',

    plugins: [
        new NodemonPlugin({
            script: './dist/server.js',
            ignore: ['main.js', '*.js.map'],
            delay: 1,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        IS_DEV &&
            new NodemonPlugin({
                script: './dist/server.js',
                ignore: ['main.js', '*.js.map'],
                delay: 1,
            }),
    ],

    performance: {
        hints: IS_DEV ? false : 'warning',
    },

    externals: [
        nodeExternals({ allowlist: [/\.(?!(?:tsx?|json)$).{1,5}$/i] }),
        {
            express: 'commonjs express',
            react: 'commonjs react',
            'react-dom/server': 'commonjs react-dom/server',
            'react-router': 'commonjs react-router',
            'react-router-dom': 'commonjs react-router-dom',
        },
    ],
};

export default config;
