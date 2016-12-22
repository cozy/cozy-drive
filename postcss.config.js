module.exports = {
  plugins: [
    require('postcss-discard-comments')(),
    require('autoprefixer')(['last 2 versions']),
    require('css-mqpacker')(),
    require('postcss-discard-duplicates')(),
    require('postcss-discard-empty')()
  ]
}
