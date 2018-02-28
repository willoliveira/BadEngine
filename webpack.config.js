const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: './src/index.ts',
	devtool: 'cheap-eval-source-map',
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		port: 9000,
		hot: true
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js' ]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
};