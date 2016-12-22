module.exports = {
  plugins: [
    require('postcss-discard-comments')(),
    require('postcss-discard-duplicates')(),
    require('autoprefixer')(['last 2 versions']),
    require('css-mqpacker')()
  ]
}
