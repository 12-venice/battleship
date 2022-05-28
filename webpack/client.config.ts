/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import webpack, { Configuration, Entry } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { IS_DEV, DIST_DIR, SRC_DIR } from './env';

const config: Configuration = {
    entry: [
        IS_DEV && 'react-hot-loader/patch',
        // Entry для работы HMR
        IS_DEV && 'webpack-hot-middleware/client',
        IS_DEV && 'css-hot-loader/hotModuleReplacement',
        path.join(SRC_DIR, 'index'),
    ].filter(Boolean) as unknown as Entry,
    // module: {
    //     rules: [fileLoader.client, cssLoader.client, jsLoader.client],
    // },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true, // https://github.com/TypeStrong/ts-loader#transpileonly
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[hash]-[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]',
                            },
                            sourceMap: true,
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
        // filename: '[name].js',
        // publicPath: '/',
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: { 'react-dom': '@hot-loader/react-dom' },
        extensions: ['*', '.js', '.jsx', '.json', '.ts', '.tsx'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    plugins: [
        // new MiniCssExtractPlugin({ filename: '[name].css' }),
        // Plugin для HMR
        new webpack.DefinePlugin({
            __isBrowser__: "true"
          }),     
        new MiniCssExtractPlugin({
            filename: 'style-[hash].css',
        }),
        new FaviconsWebpackPlugin('./images/favicon.png'),
        new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),

    devtool: 'source-map',

    performance: {
        hints: IS_DEV ? false : 'warning',
    },
};

export default config;
