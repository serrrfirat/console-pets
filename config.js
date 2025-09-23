import fs from 'fs';
import path from 'path';
import os from 'os';
import { createRequire } from 'module';

class Config {
  constructor() {
    this.globalConfigPath = path.join(os.homedir(), '.console-pets.json');
    this.projectConfigPath = path.join(process.cwd(), '.console-pets.config.js');
    this.config = this.loadConfig();
  }

  getDefaultConfig() {
    return {
      // Global settings
      defaultPet: 'cat',
      colors: true,

      // Auto-comment settings
      autoComment: {
        showOnCreate: true,  // Add comments when creating new files
        pets: ['cat', 'dog'], // Rotate between these
        fileTypes: ['.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss', '.vue', '.py'],
        commentStyles: {
          '.js': '// ',
          '.ts': '// ',
          '.jsx': '// ',
          '.tsx': '// ',
          '.py': '# ',
          '.html': '<!-- ',
          '.css': '/* ',
          '.scss': '// ',
          '.vue': '// '
        },
        position: 'top', // Where to place comments: 'top' or 'bottom'
        templates: [
          'Made with love by your pet {pet} {emoji}',
          'Your coding companion {pet} was here {emoji}',
          'Built with {pet} power {emoji}',
          'Crafted by {pet} {emoji}',
          '{pet} approves this code {emoji}'
        ]
      }
    };
  }

  loadConfig() {
    let config = this.getDefaultConfig();

    // Load global config
    try {
      if (fs.existsSync(this.globalConfigPath)) {
        const globalConfig = JSON.parse(fs.readFileSync(this.globalConfigPath, 'utf8'));
        config = { ...config, ...globalConfig };
      }
    } catch (error) {
      // Ignore global config errors
    }

    // Load project config (takes precedence)
    try {
      if (fs.existsSync(this.projectConfigPath)) {
        const require = createRequire(import.meta.url);
        delete require.cache[require.resolve(this.projectConfigPath)];
        const projectConfig = require(this.projectConfigPath);
        config = this.mergeDeep(config, projectConfig);
      }
    } catch (error) {
      // Ignore project config errors
    }

    return config;
  }

  mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  save(configType = 'global') {
    try {
      if (configType === 'global') {
        const globalConfig = {
          defaultPet: this.config.defaultPet,
          colors: this.config.colors
        };
        fs.writeFileSync(this.globalConfigPath, JSON.stringify(globalConfig, null, 2));
      }
    } catch (error) {
      console.error('Failed to save config:', error.message);
    }
  }

  createProjectConfig() {
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
      fs.writeFileSync(this.projectConfigPath, configContent);
      return true;
    } catch (error) {
      console.error('Failed to create project config:', error.message);
      return false;
    }
  }

  reload() {
    this.config = this.loadConfig();
  }

  get(key) {
    this.reload(); // Always get fresh config
    return key ? this.config[key] : this.config;
  }

  set(key, value) {
    if (key.includes('.')) {
      // Handle nested keys like 'autoComment.enabled'
      const keys = key.split('.');
      let obj = this.config;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    } else {
      this.config[key] = value;
    }
    this.save();
  }
}

export default new Config();