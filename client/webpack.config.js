module.exports = {
    entry: ['./src/Main.ts'],
    output: {
        filename: './dist/bundle.js'
    },
    resolve: {
        extensions: ['.ts','.js']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader',
                exclude: /node_modules/

            },
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            },],
        loaders: [
            {test: /.ts$/, loader: 'awesome-typescript-loader'}
        ]
    }
};