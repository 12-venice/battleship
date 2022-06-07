/* eslint-disable import/no-default-export */
import { IS_DEV } from '../env';

const fileRegex = /^(?!.*\.inline).*\.(svg|jpe?g|png|gif|eot|woff2?|ttf)$/;

export default {
    client: {
        loader: 'file-loader',
        test: fileRegex,
    },
    server: {
        loader: IS_DEV ? 'null-loader' : 'file-loader',
        test: fileRegex,
    },
};
