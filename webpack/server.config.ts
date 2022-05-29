/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack, { Configuration, Entry } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IS_DEV, DIST_DIR, SRC_DIR } from './env';
import fileLoader from './loaders/file';
import cssLoader from './loaders/css';
import jsLoader from './loaders/js';

const config: Configuration = {
    name: 'server',
    target: 'node',
    node: { __dirname: false },
    entry: [
        IS_DEV && 'webpack/hot/dev-server.js',
        path.join(SRC_DIR, 'server'),
    ].filter(Boolean) as unknown as Entry,

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
        publicPath: '/',
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        ...(IS_DEV ? [new webpack.HotModuleReplacementPlugin()] : []),
    ],

    devtool: 'source-map',

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
