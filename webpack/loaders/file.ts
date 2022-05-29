const fileRegex = /^(?!.*\.inline).*\.(svg|jpe?g|png|gif|eot|woff2?|ttf)$/;

export default {
    client: {
        loader: 'file-loader',
        test: fileRegex,
    },
    server: {
        loader: 'file-loader',
        test: fileRegex,
    },
};
