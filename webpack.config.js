const path = require('path')
const { spawn } = require('child_process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require('webpack')
const rules = require('./webpack.rules')

const mode = process.env.NODE_ENV || 'development';
const production = mode === 'production'
const development = mode === 'development'

const renderer = {
  context: path.resolve(__dirname, 'src/renderer'),
  target: 'electron-renderer',

  // In production mode webpack applies internal optimization/minification:
  // no additional plugins necessary.
  // For advanced options: babel-minify-webpack-plugin:
  // https://webpack.js.org/plugins/babel-minify-webpack-plugin

  mode,
  stats: 'errors-only',
  module: { rules },
  entry: { renderer: ['./renderer.js'] },
  node: { global: true },

  resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json'))
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
    conditionNames: ['svelte']
	},

  plugins: [
    new webpack.ExternalsPlugin('commonjs', ['level']),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyPlugin({
      patterns: [
        { from: "index.html" },
        { from: "global.scss" },
        { from: "favicon.png" }
      ]
    })
  ]
}

const main = {
  context: path.resolve(__dirname, 'src/main'),
  target: 'electron-main',
  mode,
  stats: 'errors-only',
  entry: { main: './main.js' },
  plugins: [
    // NOTE: Required. Else "Error: No native build was found for ..."
    new webpack.ExternalsPlugin('commonjs', ['level'])
  ]
}

const server = {
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    setupMiddlewares: (middlewares, devServer) => {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
        .on('close', code => process.exit(code))
        .on('error', error => console.error(error))

      return middlewares
    }
  }
}

module.exports = [
  main,
  Object.assign(
    {},
    renderer,
    development ? server : {},
    { devtool: production ? false : 'source-map' }
  )
]
