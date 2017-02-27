module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  'rules': {
    'indent': ["error", "tab"],
    'no-tabs': 0,
    'no-new': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // enforce return statements in callbacks of array methods
    'array-callback-return': 1,
    // enforce consistent newlines before and after dots
    'dot-location': 1,
    // disallow the use of arguments.caller or arguments.callee
    'no-caller': 2,
    // disallow else blocks after return statements in if statements
    'no-else-return': 2,
    // disallow multiple spaces
    'no-multi-spaces': 2,
    //disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 2,
    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
    // enforce variables to be declared either together or separately in functions
    'one-var': ["error", "never"],
    //
    'key-spacing': [2, { align: "value" }],
  }
}
