import path, { join, resolve } from 'path';
import webpack, { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

import { IS_DEV, DIST_DIR, SERVER_DIR } from '../assets/env';
import fileLoader from '../loaders/file';
import cssLoader from '../loaders/css';
import jsLoader from '../loaders/js';

const config: Configuration = {
    name: 'server',
    target: 'node',
    node: { __dirname: false },
    entry: path.join(SERVER_DIR, 'server'),
    module: {
        rules: [fileLoader.server, cssLoader.server, jsLoader.server],
    },
    output: {
        filename: 'server.js',
        libraryTarget: 'commonjs2',
        path: DIST_DIR,
        publicPath: '/static/',
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },

    plugins: [
        new webpack.ProvidePlugin({
            window: resolve(join(__dirname, './mock/window.mock')),
            localStorage: resolve(join(__dirname, './mock/localStorage.mock')),
            document: 'global/document',
        }),
    ],

    devtool: 'source-map',

    performance: {
        hints: IS_DEV ? false : 'warning',
    },

    externals: [nodeExternals({ allowlist: [/\.(?!(?:tsx?|json)$).{1,5}$/i] })],

    optimization: { nodeEnv: false },
};

// eslint-disable-next-line import/no-default-export
export default config;
