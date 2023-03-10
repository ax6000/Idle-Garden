var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  // ...
  mode:'production',
  output: {
    path: __dirname + '/dest',
    filename: 'bundle.js'
  },
    // ローダーの設定
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: [/\.vert$/, /\.frag$/],
          use: "raw-loader"
        },
        {
          test: /\.(gif|png|jpe?g|svg|xml)$/i,
          use: "file-loader"
        }
      ]
    },
  plugins: [
    new ZipPlugin({
      // OPTIONAL: defaults to the Webpack output path (above)
      // can be relative (to Webpack output path) or absolute
      path: 'zip',

      // OPTIONAL: defaults to the Webpack output filename (above) or,
      // if not present, the basename of the path
      filename: 'my_app.zip',

      // OPTIONAL: defaults to 'zip'
      // the file extension to use instead of 'zip'

      // OPTIONAL: defaults to the empty string
      // the prefix for the files included in the zip file
      pathPrefix: "src/",


      // OPTIONAL: defaults to the identity function
      // a function mapping asset paths to new paths
      pathMapper: function(assetPath) {
        // put all pngs in an `images` subdir
        if (assetPath.endsWith('.png'))
          return path.join(path.dirname(assetPath), 'images', path.basename(assetPath));
        return assetPath;
      },

      // OPTIONAL: defaults to including everything
      // can be a string, a RegExp, or an array of strings and RegExps
      include: [/\.js$/,/\.png$/,/\.mp3$/,/\.html$/],

      // OPTIONAL: defaults to excluding nothing
      // can be a string, a RegExp, or an array of strings and RegExps
      // if a file matches both include and exclude, exclude takes precedence

      // yazl Options

      // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
      fileOptions: {
        mtime: new Date(),
        mode: 0o100664,
        compress: true,
        forceZip64Format: false,
      },

      // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
      zipOptions: {
        forceZip64Format: false,
      },
    })
  ]
}