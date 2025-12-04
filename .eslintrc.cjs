module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  ignorePatterns: ['dist', 'build', '.eslintrc.cjs'],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': 'off', // We are using JSDoc instead
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 200, ignoreComments: true }],
  },
};
