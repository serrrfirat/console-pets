#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Clean up console-pets from package.json scripts
const packagePath = path.join(process.cwd(), 'package.json');

try {
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (packageJson.scripts) {
      let modified = false;

      Object.keys(packageJson.scripts).forEach(scriptName => {
        const scriptCommand = packageJson.scripts[scriptName];

        // Remove console-pets from the beginning
        if (scriptCommand.startsWith('npx console-pets && ')) {
          packageJson.scripts[scriptName] = scriptCommand.replace('npx console-pets && ', '');
          modified = true;
        } else if (scriptCommand.startsWith('console-pets && ')) {
          packageJson.scripts[scriptName] = scriptCommand.replace('console-pets && ', '');
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log('🧹 Cleaned up console-pets from package.json scripts');
      }
    }
  }
} catch (error) {
  // Silently ignore errors during uninstall cleanup
}