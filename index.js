const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const config = require('./config');
const autoCommenter = require('./auto-comment');

class ConsolePets {
  constructor() {
    this.pets = ['cat', 'dog', 'robot', 'dragon', 'hamster', 'alien'];
    this.defaultPet = 'cat';
    this.config = config.get();
  }

  refreshConfig() {
    this.config = config.get();
  }

  getPetArt(petType, mood) {
    try {
      const pet = require(`./pets/${petType}`);
      return pet[mood] || pet.happy;
    } catch (error) {
      // Fallback to cat if pet not found
      const cat = require('./pets/cat');
      return cat[mood] || cat.happy;
    }
  }

  show(petType, mood = 'happy') {
    const type = petType || this.config.defaultPet || this.defaultPet;
    const art = this.getPetArt(type, mood);

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

  happy(petType) {
    this.show(petType, 'happy');
  }

  sad(petType) {
    this.show(petType, 'sad');
  }

  random() {
    // Use pets from config if available, otherwise use all pets
    const configPets = this.config.autoComment?.pets;
    const availablePets = configPets && configPets.length > 0 ? configPets : this.pets;
    const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
    this.happy(randomPet);
  }

  randomSad() {
    // Use pets from config if available, otherwise use all pets
    const configPets = this.config.autoComment?.pets;
    const availablePets = configPets && configPets.length > 0 ? configPets : this.pets;
    const randomPet = availablePets[Math.floor(Math.random() * availablePets.length)];
    this.sad(randomPet);
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

  run(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(stdout);
          console.error(stderr);
          this.sad();
          reject(error);
        } else {
          console.log(stdout);
          this.happy();
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
  createFile(filePath, content = '') {
    return autoCommenter.createFile(filePath, content);
  }

  createFileWithTemplate(filePath) {
    const ext = path.extname(filePath);
    const template = autoCommenter.getFileTemplate(ext);
    return this.createFile(filePath, template);
  }

  addCommentToFile(filePath) {
    return autoCommenter.addCommentToExistingFile(filePath);
  }

  // Configuration management
  createProjectConfig() {
    const success = config.createProjectConfig();
    if (success) {
      console.log('✅ Created .console-pets.config.js in your project!');
      console.log('Edit this file to customize Console Pets behavior.');
      this.happy();
    } else {
      console.log('❌ Failed to create project config file.');
      this.sad();
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

  toggleShowOnCreate() {
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
        this.happy();
      } else {
        this.sad();
      }
      return;
    }

    config.set('autoComment.showOnCreate', newValue);
    this.refreshConfig();

    console.log(`Show on create ${newValue ? 'enabled' : 'disabled'} ✨`);

    if (newValue) {
      this.happy();
      console.log('New files will now have pet comments! 🎉');
    } else {
      this.sad();
      console.log('New files will be created without pet comments.');
    }
  }

  setupScripts() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');

      if (!fs.existsSync(packagePath)) {
        console.error('❌ No package.json found in current directory');
        this.sad();
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (!packageJson.scripts) {
        console.error('❌ No scripts section found in package.json');
        this.sad();
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
        this.happy();
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

      this.happy();
      return true;
    } catch (error) {
      console.error('❌ Failed to setup scripts:', error.message);
      this.sad();
      return false;
    }
  }

  removeScripts() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');

      if (!fs.existsSync(packagePath)) {
        console.error('❌ No package.json found in current directory');
        this.sad();
        return false;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (!packageJson.scripts) {
        console.error('❌ No scripts section found in package.json');
        this.sad();
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
        this.happy();
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

      this.happy();
      return true;
    } catch (error) {
      console.error('❌ Failed to remove from scripts:', error.message);
      this.sad();
      return false;
    }
  }
}

module.exports = new ConsolePets();