const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		'app/app': ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json'))
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.join(__dirname, '/dist'),
		publicPath: '/',
		filename: 'app/[contenthash].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: !prod
						},
						emitCss: prod,
						hotReload: !prod
					}
				}
			},
			{
				test: /\.(c|sa|sc)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(svg|png|jpg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[contenthash][ext]'
				}
			},
			{
				test: /\.otf$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[contenthash][ext]'
				}
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			}
		]
	},
	mode,
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [{ from: 'public' }]
		}),
		new EnvironmentPlugin([
			'FIREBASE_API_KEY',
			'FIREBASE_AUTH_DOMAIN',
			'FIREBASE_PROJECT_ID',
			'FIREBASE_STORAGE_BUCKET',
			'FIREBASE_MESSAGING_SENDER_ID',
			'FIREBASE_APP_ID'
		]),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			publicPath: '/'
		}),
		new MiniCssExtractPlugin({
			filename: 'app/[contenthash].css'
		})
	],
	optimization: {
		minimizer: [
			`...`,
			new CssMinimizerPlugin()
		]
	},
	devtool: prod ? false : 'source-map',
	devServer: {
		hot: true,
		historyApiFallback: true
	}
};