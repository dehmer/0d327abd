const production = process.env.NODE_ENV === 'production'
const development = process.env.NODE_ENV !== 'production'

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['babel-loader']
}

const css = {
  // css-loader: resolve/load required/imported CSS dependencies from JavaScript
  // style-loader: wrap CSS string from css-loader with <style> tag
  // Note: loaders are applied from right to left, i.e. css-loader -> style-loader
  //
  test: /\.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}

const image = {
  test: /\.(png|svg|jpe?g|gif)$/i,
  use: [{
    loader: 'file-loader',
    options: {
      name: 'img/[name].[ext]'
    }
  }]
}

const font = {
  test: /\.(eot|svg|ttf|woff|woff2)$/,
  type: 'asset/resource'
}

const svelte = [
  {
    test: /\.svelte$/,
    use: {
      loader: 'svelte-loader',
      options: {
        compilerOptions: { dev: development },
        emitCss: production,
        hotReload: development
      }
    }
  },

  {
    // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
    test: /node_modules\/svelte\/.*\.mjs$/,
    resolve: {
      fullySpecified: false
    }
  }
]

module.exports = [js, css, image, font, ...svelte]
