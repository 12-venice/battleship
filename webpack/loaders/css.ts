/* eslint-disable import/no-default-export */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IS_DEV } from '../env';

export default {
    client: {
        test: /\.scss$/,
        use: [
            IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[local]',
                    },
                    sourceMap: true,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            [
                                'autoprefixer',
                                { overrideBrowserslist: ['last 2 versions'] },
                            ],
                        ],
                    },
                },
            },
            'sass-loader',
        ],
    },
    server: {
        test: /\.scss$/,
        use: [
            IS_DEV ? 'null-loader' : MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[local]',
                    },
                    sourceMap: true,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [['autoprefixer']],
                    },
                },
            },
            'sass-loader',
        ],
    },
};
