<<<<<<< HEAD
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
=======
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { IS_DEV } = require('../env');

export default {
    client: {
        test: /\.css$/,
        use: [
            IS_DEV && 'css-hot-loader',
            MiniCssExtractPlugin.loader,
            'css-loader',
        ].filter(Boolean),
    },
    server: {
        test: /\.css$/,
        loader: 'null-loader',
    },
};
>>>>>>> f4b2ccff2862a46473c437726ee4da943abdb25c
