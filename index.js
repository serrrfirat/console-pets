import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import config from './config.js';
import autoCommenter from './auto-comment.js';

class ConsolePets {
  constructor() {
    this.pets = ['cat', 'dog', 'robot', 'dragon', 'hamster', 'alien'];
    this.defaultPet = 'cat';
    this.config = config.get();
  }

  refreshConfig() {
    this.config = config.get();
  }

  async getPetArt(petType, mood) {
    try {
      const pet = (await import(`./pets/${petType}.js`)).default;
      return pet[mood] || pet.happy;
    } catch (error) {
      // Fallback to cat if pet not found
      const cat = (await import('./pets/cat.js')).default;
      return cat[mood] || cat.happy;
    }
  }

  async show(petType, mood = 'happy') {
    const type = petType || this.config.defaultPet || this.defaultPet;
    const art = await this.getPetArt(type, mood);

    const color = mood === 'happy' ? 'green' : 'red';
    const emoji = mood === 'happy' ? '😊' : '😢';

    console.log(); // Empty line

    if (this.config.colors) {
      art.forEach(line => console.log(chalk[color](line)));
      console.log(chalk[color](`   ${emoji}   `));
    } else {
      art.forEach(line => console.log(line));
      console.log(`   ${emoji}   `);
    }

    console.log(); // Empty line
  }

  async happy(petType) {
    await this.show(petType, 'happy');
  }

  async sad(petType) {
    await this.show(petType, 'sad');
  }

  async random() {
    // Use pets from config if available, otherwise use all pets
    const configPets = this.config.autoComment?.pets;
    const availablePets = configPets && configPets.length > 0 ? configPets : this.pets;
    const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
    await this.happy(randomPet);
  }

  async randomSad() {
    // Use pets from config if available, otherwise use all pets
    const configPets = this.config.autoComment?.pets;
    const availablePets = configPets && configPets.length > 0 ? configPets : this.pets;
    const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
    await this.sad(randomPet);
  }

  setPet(petType) {
    if (this.pets.includes(petType)) {
      config.set('defaultPet', petType);
      this.refreshConfig();
      console.log(`Default pet set to ${petType} ${this.getPetEmoji(petType)}`);
    } else {
      console.error(`Invalid pet type. Available pets: ${this.pets.join(', ')}`);
    }
  }

  getPetEmoji(petType) {
    const emojis = {
      cat: '🐱',
      dog: '🐶',
      robot: '🤖',
      dragon: '🐉',
      hamster: '🐹',
      alien: '👽'
    };
    return emojis[petType] || '🐱';
  }

  async run(command) {
    return new Promise((resolve, reject) => {
      exec(command, async (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          console.error(stderr);
          await this.sad();
          reject(error);
        } else {
          console.log(stdout);
          await this.happy();
          resolve(stdout);
        }
      });
    });
  }



  listPets() {
    console.log('\n🐾 Available Pets:');
    this.pets.forEach(pet => {
      const emoji = this.getPetEmoji(pet);
      const current = pet === this.config.defaultPet ? ' (current)' : '';
      console.log(`  ${emoji} ${pet}${current}`);
    });
    console.log();
  }

  // Auto-commenting features
  async createFile(filePath, content = '') {
    return await autoCommenter.createFile(filePath, content);
  }

  async createFileWithTemplate(filePath) {
    const ext = path.extname(filePath);
    const template = autoCommenter.getFileTemplate(ext);
    return await this.createFile(filePath, template);
  }

  async addCommentToFile(filePath) {
    return await autoCommenter.addCommentToExistingFile(filePath);
  }

  // Configuration management
  async createProjectConfig() {
    const success = config.createProjectConfig();
    if (success) {
      console.log('✅ Created .console-pets.config.js in your project!');
      console.log('Edit this file to customize Console Pets behavior.');
      await this.happy();
    } else {
      console.log('❌ Failed to create project config file.');
      await this.sad();
    }
    return success;
  }

  showConfig() {
    console.log('\n🔧 Console Pets Configuration:');
    console.log('================================');

    const currentConfig = config.get();

    console.log(`Default Pet: ${currentConfig.defaultPet} ${this.getPetEmoji(currentConfig.defaultPet)}`);
    console.log(`Colors: ${currentConfig.colors ? '✅' : '❌'}`);

    console.log('\nAuto-Comment Settings:');
    console.log(`  Show on Create: ${currentConfig.autoComment?.showOnCreate ? '✅' : '❌'}`);
    console.log(`  File Types: ${currentConfig.autoComment?.fileTypes?.join(', ')}`);
    console.log(`  Position: ${currentConfig.autoComment?.position || 'top'}`);

    console.log('\nConfig Files:');
    console.log(`  Global: ~/.console-pets.json`);
    console.log(`  Project: ./.console-pets.config.js ${fs.existsSync(config.projectConfigPath) ? '✅' : '❌'}`);
    console.log();
  }

  async toggleShowOnCreate() {
    const current = config.get('autoComment')?.showOnCreate !== false; // Default true
    const newValue = !current;

    // If project config exists, remind user to edit it manually
    if (fs.existsSync(config.projectConfigPath)) {
      console.log('⚠️  Project config file detected (.console-pets.config.js)');
      console.log('Please edit the file directly to change auto-comment settings:');
      console.log(`   autoComment.showOnCreate: ${newValue}`);
      console.log('');
      console.log('Or remove the project config to use global settings.');

      if (newValue) {
        await this.happy();
      } else {
        await this.sad();
      }
      return;
    }

    config.set('autoComment.showOnCreate', newValue);
    this.refreshConfig();

    console.log(`Show on create ${newValue ? 'enabled' : 'disabled'} ✨`);

    if (newValue) {
      await this.happy();
      console.log('New files will now have pet comments! 🎉');
    } else {
      await this.sad();
      console.log('New files will be created without pet comments.');
    }
  }

  async setupScripts() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');

      if (!fs.existsSync(packagePath)) {
        console.error('❌ No package.json found in current directory');
        await this.sad();
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (!packageJson.scripts) {
        console.error('❌ No scripts section found in package.json');
        await this.sad();
        return false;
      }

      let modified = false;
      const originalScripts = { ...packageJson.scripts };

      Object.keys(packageJson.scripts).forEach(scriptName => {
        const scriptCommand = packageJson.scripts[scriptName];

        // Skip if already has console-pets
        if (scriptCommand.includes('console-pets')) {
          return;
        }

        // Add console-pets at the beginning
        packageJson.scripts[scriptName] = `npx console-pets && ${scriptCommand}`;
        modified = true;
      });

      if (!modified) {
        console.log('✅ All scripts already have console-pets!');
        await this.happy();
        return true;
      }

      // Write back to package.json
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

      console.log('✅ Added console-pets to package.json scripts!');
      console.log('\nModified scripts:');
      Object.keys(originalScripts).forEach(scriptName => {
        if (!originalScripts[scriptName].includes('console-pets')) {
          console.log(`  ${scriptName}: ${originalScripts[scriptName]}`);
          console.log(`  → ${packageJson.scripts[scriptName]}`);
        }
      });

      await this.happy();
      return true;
    } catch (error) {
      console.error('❌ Failed to setup scripts:', error.message);
      await this.sad();
      return false;
    }
  }

  async removeScripts() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');

      if (!fs.existsSync(packagePath)) {
        console.error('❌ No package.json found in current directory');
        await this.sad();
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (!packageJson.scripts) {
        console.error('❌ No scripts section found in package.json');
        await this.sad();
        return false;
      }

      let modified = false;
      const originalScripts = { ...packageJson.scripts };

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

      if (!modified) {
        console.log('✅ No console-pets found in scripts');
        await this.happy();
        return true;
      }

      // Write back to package.json
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

      console.log('✅ Removed console-pets from package.json scripts!');
      console.log('\nModified scripts:');
      Object.keys(originalScripts).forEach(scriptName => {
        if (originalScripts[scriptName] !== packageJson.scripts[scriptName]) {
          console.log(`  ${scriptName}: ${originalScripts[scriptName]}`);
          console.log(`  → ${packageJson.scripts[scriptName]}`);
        }
      });

      await this.happy();
      return true;
    } catch (error) {
      console.error('❌ Failed to remove from scripts:', error.message);
      await this.sad();
      return false;
    }
  }
}

export default new ConsolePets();