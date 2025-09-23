#!/usr/bin/env node

import pet from './index.js';

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];
const target = args[2];

function showHelp() {
  console.log(`
🐾 Console Pets - Cute ASCII pets for your console!

Usage:
  console-pets <command> [options]
  console-pets-run "<command>"

Pet Commands:
  happy <pet>        Show happy pet (cat, dog, robot, dragon, hamster, alien)
  sad <pet>          Show sad pet
  random             Show random happy pet
  random-sad         Show random sad pet
  list               List all available pets
  set-pet <pet>      Set default pet

File Creation:
  create <file>      Create file with pet comments (if showOnCreate enabled)
  create-template <file>  Create file with pet comments and template code
  add-comment <file> Add pet comment to existing file

Configuration:
  config             Show current configuration
  init               Create project config file (.console-pets.config.js)
  toggle-create      Enable/disable comments on file creation

Package.json Scripts:
  setup-scripts      Add console-pets to all package.json scripts
  remove-scripts     Remove console-pets from all package.json scripts

Other:
  help               Show this help

Examples:
  console-pets happy cat
  console-pets create src/hello.js
  console-pets create-template components/Button.tsx
  console-pets add-comment existing-file.js
  console-pets init
  console-pets setup-scripts
  console-pets config
  console-pets-run "npm test"

Pet Types: cat 🐱, dog 🐶, robot 🤖, dragon 🐉, hamster 🐹, alien 👽
`);
}

async function main() {
  // Handle console-pets-run command
  if (process.argv[1].endsWith('console-pets-run') || command === 'run') {
    const commandToRun = command === 'run' ? subcommand : command;
    if (!commandToRun) {
      console.error('Please provide a command to run');
      process.exit(1);
    }

    try {
      await pet.run(commandToRun);
      process.exit(0);
    } catch (error) {
      process.exit(error.code || 1);
    }
    return;
  }

  // Handle regular console-pets commands
  switch (command) {
    case 'happy':
      await pet.happy(subcommand);
      break;

    case 'sad':
      pet.sad(subcommand);
      break;

    case 'random':
      pet.random();
      break;

    case 'random-sad':
      pet.randomSad();
      break;

    case 'set-pet':
      if (!subcommand) {
        console.error('Please specify a pet type');
        pet.listPets();
        process.exit(1);
      }
      pet.setPet(subcommand);
      break;

    case 'list':
      pet.listPets();
      break;


    case 'create':
      if (!subcommand) {
        console.error('Please specify a file path');
        console.error('Example: console-pets create src/hello.js');
        process.exit(1);
      }
      pet.createFile(subcommand);
      break;

    case 'create-template':
      if (!subcommand) {
        console.error('Please specify a file path');
        console.error('Example: console-pets create-template components/Button.tsx');
        process.exit(1);
      }
      pet.createFileWithTemplate(subcommand);
      break;

    case 'add-comment':
      if (!subcommand) {
        console.error('Please specify a file path');
        console.error('Example: console-pets add-comment existing-file.js');
        process.exit(1);
      }
      pet.addCommentToFile(subcommand);
      break;

    case 'config':
      pet.showConfig();
      break;

    case 'init':
      pet.createProjectConfig();
      break;

    case 'toggle-create':
      pet.toggleShowOnCreate();
      break;

    case 'setup-scripts':
      pet.setupScripts();
      break;

    case 'remove-scripts':
      pet.removeScripts();
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    case undefined:
      // Default behavior - show random happy pet
      pet.random();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main().catch(async error => {
  console.error('Error:', error.message);
  await pet.sad();
  process.exit(1);
});