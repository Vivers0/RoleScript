module.exports = {
  env: {
    node: true,
  },
  extends: ['airbnb-base'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'semi': ['error', 'always'],
    'quotes': [2, 'single'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'windows'],
    'quote-props': 0,
    'consistent-return': 0,
    'import/newline-after-import': 0,
    'object-curly-newline': 0,
    'arrow-body-style': 0,
    'no-console': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'lines-between-class-members': 0,
    'class-methods-use-this': 0,
  },
};
