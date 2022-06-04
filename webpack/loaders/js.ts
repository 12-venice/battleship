export default {
    client: 
    {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
    },
    server: {
        test: /\.ts(x?)$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/,
    },
};
