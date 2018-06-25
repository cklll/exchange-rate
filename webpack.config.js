module.exports = {
    entry: './client/index.js',
    output: {
        path: __dirname + '/client/',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'stage-0', 'react']
            }
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },
        {
            test: /\.(gif|svg|jpg|png)$/,
            loader: "file-loader",
        },]
    }
}