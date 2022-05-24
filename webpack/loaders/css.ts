const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { IS_DEV } = require('../env');

export default {
    client: 
    {
        test: /\.scss$/,
        use: [
            IS_DEV && 'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
        ].filter(Boolean),
    },
    server: {
        test: /\.scss$/,
        loader: 'null-loader',
    },
};
