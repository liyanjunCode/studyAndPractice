const path = require('path');
const devConfig = require('./webpack.dev');
const proConfig = require('./webpack.pro');
const Merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = env => {
    const isDev = env.development;
    const base = {
        entry: path.resolve(__dirname, '../src/main.js'),
        output:  {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader:'css-loader',
                            options: {
                                importLoaders: 2
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                }
            ]
        },
        devServer: {
            open: true,
            hot: true,
            contentBase: path.resolve(__dirname, "../dist"),
            compress: true
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.resolve(__dirname, "../public/index.html"),
                minify: true,
                title: "my App"
            }),
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin()
        ]
    }
    return isDev ? Merge(base, devConfig) : Merge(base, proConfig);
}