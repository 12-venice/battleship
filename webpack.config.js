// Ругается на старый синтаксис
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: {
        bundle: './src/index.tsx',
    },

    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
    },
    resolve: {
        plugins: [new TsconfigPathsPlugin()],
        extensions: ['.tsx', '.ts', '.js'],
    },
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
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
    plugins: [
        new HtmlWebpackPlugin({
            template: './www/index.html',
            filename: 'index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
            },
        }),
        new MiniCssExtractPlugin({
            filename: 'style-[hash].css',
        }),
        new FaviconsWebpackPlugin({
            logo: './images/favicon.png',
            inject: true,
            mode: 'webapp',
            manifest: './manifest.json',
        }),
        new WorkboxPlugin.GenerateSW({
            mode: process.env.NODE_ENV,
            disableDevLogs: true,
            maximumFileSizeToCacheInBytes: 3000000,
            clientsClaim: true,
            skipWaiting: true,
            cleanupOutdatedCaches: true,
        }),
    ],
    devServer: {
        client: {
            overlay: false,
        },
        static: {
            directory: path.join(__dirname),
        },
        historyApiFallback: true,
        compress: true,
        port: 3000,
        proxy: {
            '/api/**': {
                target: 'http://localhost:5000',
                secure: false,
                changeOrigin: true,
            },
        },
    },
};
