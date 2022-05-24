const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { IS_DEV } = require('../env');

export default {
    client: {
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
    server: {
        test: /\.scss$/,
        loader: 'null-loader',
    },
};
