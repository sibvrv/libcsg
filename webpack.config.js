const path = require('path');

// Plugins
const TSConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {DefinePlugin} = require("webpack");

// Variables
const sourcePath = path.join(__dirname, './src/');
const outPath = path.join(__dirname, `./dist/`);

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  console.log();

  return {
    context: sourcePath,
    entry: [
      'main.ts'
    ],
    output: {
      publicPath: '/',
      library: 'libcsg',
      libraryTarget: 'umd',
      path: outPath,
      filename: isProduction ? '[name].js' : '[name].js',
      chunkFilename: isProduction ? 'chunks/[name].[contenthash].js' : 'chunks/[name].[hash].js'
    },
    target: 'node',
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      plugins: [
        new TSConfigPathsPlugin()
      ],
      mainFields: ['module', 'browser', 'main']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ['ts-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        '__LIB_VERSION__': JSON.stringify({
          build: process.env.npm_package_version,
          time: new Date().toUTCString(),
          stamp: Math.floor(Date.now() / 1000)
        })
      })
    ],
    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map'
  };
};
