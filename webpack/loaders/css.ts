import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { IS_DEV } from '../env';

export default {
    client: {
        test: /\.scss$/,
        use: [
            IS_DEV ? 'style-loader' :
            MiniCssExtractPlugin.loader,
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[local]',
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
