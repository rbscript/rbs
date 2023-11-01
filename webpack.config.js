const path = require('path');

module.exports = {
    target: 'node',
    entry: './src/rbs-loader.js',
    devtool: 'inline-source-map',
    module: {
	rules: [
	    {
		test: /\.js?$/,
		use: 'babel-loader',
		exclude: /node_modules/,
	    },
	],
    },
    resolve: {
	extensions: [ '.js' ],
    },
    output: {
	filename: 'rbs-loader-0.1.js',
	path: path.resolve(__dirname, 'dist')
    },
};
