const eslintConfigCozyApp = require('eslint-config-cozy-app')

// Extract the base import/order rule configuration for readability
const baseImportOrderConfig = eslintConfigCozyApp[0].rules['import/order'][1]

// Define a new path group for internal customizations
const customPathGroup = {
  pattern:
    '{test/**,lib/**,hooks/**,components/**,modules/**,assets/**,models/**,config/**,constants/**,config/**,locales/**,styles/**}',
  group: 'internal'
}

// Descriptive variable for the updated pathGroups, incorporating the new customPathGroup
const updatedPathGroups = [
  ...baseImportOrderConfig.pathGroups, // Include all existing path groups
  customPathGroup // Add the new custom path group
]

// Apply the enhanced rule configuration
module.exports = [
  ...eslintConfigCozyApp, // Spread the existing ESLint config

  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    rules: {
      'import/order': [
        'warn', // Rule severity
        {
          ...baseImportOrderConfig, // Spread the base configuration
          pathGroups: updatedPathGroups // Use the updated path groups
        }
      ]
    }
  }
]
