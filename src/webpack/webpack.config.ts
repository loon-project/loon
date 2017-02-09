import * as webpack from "webpack";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as ChunkManifestPlugin from "chunk-manifest-webpack-plugin";
import * as ManifestPlugin from "webpack-manifest-plugin";
import {TypedContext} from "../server/TypedContext";


// const chunk = new webpack.optimize.CommonsChunkPlugin({
//     names: ["vendor", "manifest"],
//     minChunks: Infinity
// });
//
// const chunkManifest = new ChunkManifestPlugin({
//     filename: "chunk-manifest.json",
//     manifestVariable: "webpackManifest"
// });

const css = new ExtractTextPlugin(TypedContext.isProduction() ? "[name].[contenthash].css" : "[name].css");

const manifest = new ManifestPlugin();

const env = new webpack.DefinePlugin({
    'process.env.NODE_ENV': TypedContext.env
});

module.exports = {

    target: 'web',

    cache: TypedContext.isProduction(),

    entry: {
    },

    output: {
        path: `${TypedContext.publicDir}/assets`,
        filename: TypedContext.isProduction() ? '[name].[chunkhash].js' : '[name].js'
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader' })
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader?presets[]=es2015'
            },

            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'url'
            }
        ]
    },
    plugins: [env, css, manifest]
};