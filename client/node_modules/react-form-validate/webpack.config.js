/**
 * Created by wujianbo on 15/12/9.
 */
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixerOptions = {
    browsers: [
        'ie >= 8',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ]
};

module.exports = {
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                exclude: /(node_modules)/,
                loader: 'style-loader!css-loader!postcss-loader!less-loader'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    postcss: function () {
        return [autoprefixer(autoprefixerOptions)];
    },
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    output: {
        //        comments: false
        //    }
        //})
    ]
};