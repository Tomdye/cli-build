const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer-sunburst').BundleAnalyzerPlugin;
const path = require('path');
const basePath = process.cwd();
const cssModuleIdent = '[name]__[local]__[hash:base64:5]';
const cssModuleLoader = ExtractTextPlugin.extract([
	`css-loader?modules&sourceMap&localIdentName=${cssModuleIdent}`
]);

module.exports = function (args) {
	args = args || {};

	let plugins = [
		new webpack.ContextReplacementPlugin(/dojo-app[\\\/]lib/, { test: () => false }),
		new ExtractTextPlugin('main.css'),
		new CopyWebpackPlugin([
			{ context: 'src', from: '**/*', ignore: '*.ts' },
		]),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}),
		new HtmlWebpackPlugin ({
			inject: true,
			chunks: [ 'src/main' ],
			template: 'src/index.html'
		})
	];

	if (!args.watch) {
		plugins.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static',
			openAnalyzer: false,
			reportType: 'sunburst'
		}));
	}

	return {
		entry: {
			'src/main': [
				path.join(basePath, 'src/main.css'),
				path.join(basePath, 'src/main.ts')
			]
		},
		devtool: 'source-map',
		resolve: {
			root: [ basePath ],
			extensions: ['', '.ts', '.tsx', '.js', '.json'],
			alias: {
				rxjs: '@reactivex/rxjs/dist/amd'
			}
		},
		resolveLoader: {
			root: [ path.join(__dirname, 'node_modules') ]
		},
		module: {
			preLoaders: [
				{
					test: /dojo-.*\.js$/,
					loader: 'source-map-loader'
				}
			],
			loaders: [
				{ test: /src[\\\/].*\.ts?$/, loader: 'umd-compat-loader!ts-loader' },
				{ test: /\.js?$/, loader: 'umd-compat-loader' },
				{ test: /\.html$/, loader: 'html' },
				{ test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'file?name=[path][name].[hash:6].[ext]' },
				{ test: /src[\\\/].*\.css?$/, loader: cssModuleLoader },
				{ test: /\.css$/, exclude: /src[\\\/].*/, loader: ExtractTextPlugin.extract([ 'css-loader?sourceMap' ]) },
				{ test: /\.css\.json$/, exclude: /src[\\\/].*/, loader: 'json-css-module-loader' }
			]
		},
		plugins: plugins,
		output: {
			path: path.resolve('./dist'),
			filename: '[name].js'
		}
	};
}

	// { test: /src[\\\/].*\.ts?$/, loader: 'umd-compat-loader!ts-loader' },
	// { test: /\.js?$/, loader: 'umd-compat-loader' },
	// { test: /\.html$/, loader: 'html' },
	// { test: /\.(jpe|jpg|png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'file?name=[path][name].[hash:6].[ext]' },
	// { test: /\.styl$/, exclude: /\.module\.styl$/, loader: stylusLoader },
	// { test: /\.module\.styl$/, loader: stylusModuleLoader },
	// { test: /\.module\.styl\.json$/, loader: 'json-css-module-loader' },
	// { test: /\.module\.css$/, loader: ExtractTextPlugin.extract([ 'css-loader?sourceMap' ]) }
