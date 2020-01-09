module.exports = function config(api) {
  return {
    presets: [
      ['@babel/preset-modules'],
      ['@babel/preset-react', { development: !api.env('production') }],
      ['@babel/preset-typescript'],
    ],
    plugins: [['@babel/plugin-transform-runtime']],
  }
}
