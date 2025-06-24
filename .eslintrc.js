module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'unused-imports'],
  root: true,
  rules: {
    // Remove unused imports
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 
        vars: 'all', 
        varsIgnorePattern: '^_', 
        args: 'after-used', 
        argsIgnorePattern: '^_' 
      }
    ],
    // Other useful rules
    'no-unused-vars': 'off', // Turned off as it's handled by unused-imports
    '@typescript-eslint/no-unused-vars': 'off', // Turned off as it's handled by unused-imports
    'react/prop-types': 'off', // Not needed when using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
