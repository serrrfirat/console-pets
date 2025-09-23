#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

async function postInstall() {
// Get the directory where console-pets is being installed
const installDir = process.cwd();
const configPath = path.join(installDir, '.console-pets.config.js');

// Don't create config if we're in the console-pets development directory
// (Check if package.json has console-pets as the name)
try {
  const packagePath = path.join(installDir, 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg.name === 'console-pets') {
      // We're in the console-pets package itself, don't create config
      return;
    }
  }
} catch (error) {
  // Ignore error and proceed
}

// Check if config already exists
if (fs.existsSync(configPath)) {
  console.log('📝 Console Pets config already exists!');
  return;
}

// Create the config file
const configContent = `// Console Pets Configuration
// This file controls how Console Pets behaves in your project

export default {
  // Auto-commenting settings
  autoComment: {
    showOnCreate: true,         // Add comments when creating new files
    pets: ['cat', 'dog'],       // Pets to use (rotates randomly)
    fileTypes: [                // File extensions to auto-comment
      '.js', '.ts', '.jsx', '.tsx',
      '.html', '.css', '.vue'
    ],
    position: 'top',            // Where to place comments: 'top' or 'bottom'
    templates: [                // Comment templates ({pet} and {emoji} are replaced)
      'Made with love by your pet {pet} {emoji}',
      'Your coding companion {pet} was here {emoji}',
      '{pet} approves this code {emoji}'
    ]
  },

  // Display settings (inherits from global config)
  defaultPet: 'cat',           // Override global default pet
  colors: true                 // Enable/disable colors
};
`;

try {
  fs.writeFileSync(configPath, configContent);

  console.log('🐾 Console Pets installed successfully!');
  console.log('📝 Created .console-pets.config.js configuration file');
  console.log('');
  console.log('Quick start:');
  console.log('  npx console-pets happy cat');
  console.log('  npx console-pets setup-scripts');
  console.log('  npx console-pets create src/hello.js');
  console.log('');
  console.log('Edit .console-pets.config.js to customize settings!');

  // Show a happy pet to celebrate installation
  const pet = (await import('./index.js')).default;
  await pet.happy('cat');

} catch (error) {
  console.log('⚠️  Console Pets installed, but could not create config file');
  console.log('   Run "npx console-pets init" to create it manually');
}
}

postInstall().catch(console.error);