# Console Pets 🐾

> Cute ASCII pets for your console that react to command success/failure

A tiny, delightful library that shows adorable ASCII pets in your terminal. Perfect for adding some fun to your development workflow!

## Features

- 🐱 **6 cute pets**: Cat, Dog, Robot, Dragon, Hamster, Alien
- 😊 **2 moods**: Happy (success) and Sad (error)
- 🎨 **Colorful output** with emoji reactions
- 📝 **Auto-commenting**: Automatically add pet comments to new files
- 🔧 **Smart configuration** with project and global settings
- 🎯 **Multiple usage patterns**

## Installation

```bash
npm install console-pets
```

**ES Modules**: Console Pets now uses ES modules! Make sure your project has `"type": "module"` in package.json or use `.mjs` file extensions.

Console Pets automatically creates a `.console-pets.config.js` file in your project root when installed, so you can customize settings right away!

## Quick Start

```bash
# Show a happy cat
npx console-pets happy cat

# Show a sad dog
npx console-pets sad dog

# Random happy pet
npx console-pets random

# Create files with pet comments
npx console-pets create src/hello.js
npx console-pets create-template components/Button.tsx

# Setup project configuration
npx console-pets init

# Add console-pets to all your npm scripts
npx console-pets setup-scripts

# Run command with pet feedback
npx console-pets-run "npm test"
```

## Usage

### 1. NPM Scripts (Recommended)

**Automatic Setup (Easy):**
```bash
# Automatically add console-pets to all your scripts
npx console-pets setup-scripts
```

**Manual Setup:**
```json
{
  "scripts": {
    "dev": "npx console-pets && vite dev",
    "test": "npx console-pets && jest",
    "build": "npx console-pets && webpack",
    "lint": "npx console-pets && eslint ."
  }
}
```

### 2. Command Wrapper

Automatically show happy/sad pets based on command success:

```bash
npx console-pets-run "npm test"
npx console-pets-run "npm run build"
npx console-pets-run "git push"
```

### 3. Programmatic API

```javascript
import pet from 'console-pets';

// Show specific pets (async methods - use await)
await pet.happy('cat');     // Happy cat
await pet.sad('dog');       // Sad dog
await pet.random();         // Random happy pet
await pet.randomSad();      // Random sad pet

// Run commands with pet feedback
pet.run('npm test').then(() => {
  console.log('Tests passed!');
}).catch(() => {
  console.log('Tests failed!');
});

// Create files with auto-comments
await pet.createFile('src/utils.js');
await pet.createFileWithTemplate('components/Modal.tsx');
```

### 4. In Your Code

```javascript
import pet from 'console-pets';

try {
  // Your code here
  await buildProject();
  console.log("Build successful!");
  await pet.happy('robot');
} catch (error) {
  console.log("Build failed!");
  await pet.sad('robot');
}
```

## CLI Commands

```bash
# Show pets
console-pets happy <pet>     # Show happy pet
console-pets sad <pet>       # Show sad pet
console-pets random          # Random happy pet
console-pets random-sad      # Random sad pet

# File creation with auto-comments
console-pets create <file>           # Create file with pet comment (if showOnCreate enabled)
console-pets create-template <file>  # Create file with template + comment
console-pets add-comment <file>      # Add pet comment to existing file

# Configuration
console-pets set-pet <pet>   # Set default pet
console-pets list            # List all pets
console-pets config          # Show current configuration
console-pets init            # Create project config file
console-pets toggle-create   # Enable/disable comments on file creation

# Package.json integration
console-pets setup-scripts   # Add console-pets to all package.json scripts
console-pets remove-scripts  # Remove console-pets from all package.json scripts

# Command runner
console-pets-run "<command>" # Run command with pet feedback
```

## Auto-Commenting Feature ✨

Console Pets can automatically add cute pet comments to your files!

### Quick Setup

```bash
# Initialize project configuration
npx console-pets init

# Create files with auto-comments (if showOnCreate is enabled)
npx console-pets create src/utils.js
npx console-pets create-template components/Button.tsx

# Add comments to existing files
npx console-pets add-comment existing-file.js
```

### Example Output

**JavaScript File:**
```javascript
//    /\_   _/\
//   (  o.o  )
//    > ^ ^ <
// Your coding companion cat was here 🐱
function hello() {
  console.log('Hello from your pet!');
}
```

**HTML File:**
```html
<!--
    /\_   _/\
   (  o.o  )
    > ^ ^ <
   Made with love by your pet cat 🐱
-->
<!DOCTYPE html>
<html>
<head><title>Hello Pet</title></head>
<body><h1>Hello from your pet!</h1></body>
</html>
```

**CSS File:**
```css
/*
 *   ┌─────────┐
 *   │ ◉     ◉ │
 *   │    ▄    │
 *   │  \_____/  │
 *   └─┬─────┬─┘
 *     │ ■ ■ │
 *   ┌─┴─────┴─┐
 *   │ [ ] [ ] │
 *   └─────────┘
 *    /│\   /│\
 * Built with robot power 🤖
 */
body {
  font-family: Arial, sans-serif;
}
```

**Python File:**
```python
#    /\_   _/\
#   (  o.o  )
#    > ^ ^ <
# cat approves this code 🐱
def hello():
    print("Hello from your pet!")
```

### Supported File Types

- **JavaScript/TypeScript**: `.js`, `.ts`, `.jsx`, `.tsx`
- **Web**: `.html`, `.css`, `.scss`, `.vue`
- **Python**: `.py`

### Configuration

The auto-commenting feature is configured in `.console-pets.config.js`:

```javascript
module.exports = {
  autoComment: {
    showOnCreate: true,         // Add comments when creating new files
    pets: ['cat', 'dog'],       // Pets to rotate through
    fileTypes: ['.js', '.ts'],  // File extensions to comment
    position: 'top',            // 'top' or 'bottom'
    templates: [                // Custom comment templates
      'Made with love by your pet {pet} {emoji}',
      'Your coding companion {pet} was here {emoji}',
      '{pet} approves this code {emoji}'
    ]
  }
};
```

### Control Auto-Comments

```bash
# Enable/disable show on create (if no project config)
npx console-pets toggle-create

# Add comments to existing files anytime
npx console-pets add-comment myfile.js

# Or edit your project config directly
# Set autoComment.showOnCreate: false in .console-pets.config.js
```

## Available Pets 🐾

Here are all the cute pets available in Console Pets. Use the pet code (shown in parentheses) in commands and configuration:

### 🐱 Cat (code: `cat`)
**Happy:**
```
    /\_   _/\
   (  o.o  )
    > ^ ^ <
   /       \
  (  )   (  )
^^^   ^^^   ^^^
```

**Sad:**
```
    /\_   _/\
   (  -.-  )
    > v v <
   /       \
  (  )   (  )
^^^   ^^^   ^^^
```

### 🐶 Dog (code: `dog`)
**Happy:**
```
   /|     /|
  ( o   o )
   \  U  /
    ) _ (
   /     \
  ( \_____/ )
 ^^^       ^^^
```

**Sad:**
```
   /|     /|
  ( -   - )
   \  n  /
    ) _ (
   /     \
  ( \_____/ )
 ^^^       ^^^
```

### 🤖 Robot (code: `robot`)
**Happy:**
```
   ┌─────────┐
   │ ◉     ◉ │
   │    ▄    │
   │  \_____/  │
   └─┬─────┬─┘
     │ ■ ■ │
   ┌─┴─────┴─┐
   │ [ ] [ ] │
   └─────────┘
    /│\   /│\
```

**Sad:**
```
   ┌─────────┐
   │ ×     × │
   │    ▄    │
   │  /‾‾‾‾‾\  │
   └─┬─────┬─┘
     │ ■ ■ │
   ┌─┴─────┴─┐
   │ [ ] [ ] │
   └─────────┘
    /│\   /│\
```

### 🐉 Dragon (code: `dragon`)
**Happy:**
```
      /\     /\
     ( ◕   ◕  )
    /  \_____/  \
   <  ≋≋≋≋≋≋≋  >
    \    ∩    /
     \  \_/  /
      \____/
    ~~(     )~~
   ~~~  \_/  ~~~
```

**Sad:**
```
      /\     /\
     ( ×   ×  )
    /  \_____/  \
   <  ≋≋≋≋≋≋≋  >
    \    n    /
     \  \_/  /
      \____/
    ~~(     )~~
   ~~~  \_/  ~~~
```

### 🐹 Hamster (code: `hamster`)
**Happy:**
```
    ∩─────∩
   ( ◉   ◉ )
  /  \___/  \
 (    \_/    )
  \  (   )  /
   \_______/
  o_o (")(") o_o
```

**Sad:**
```
    ∩─────∩
   ( ×   × )
  /  \___/  \
 (    \_/    )
  \  ( ⌒ )  /
   \_______/
  o_o (")(") o_o
```

### 👽 Alien (code: `alien`)
**Happy:**
```
     .-.-.-.
    ( ◉   ◉ )
   ∩─────────∩
  (     ∪     )
   \  /─v─\  /
    \ \_____/ /
     \___∩___/
      ╱     ╲
     ╱       ╲
```

**Sad:**
```
     .-.-.-.
    ( ×   × )
   ∩─────────∩
  (     n     )
   \  /─^─\  /
    \ \_____/ /
     \___∩___/
      ╱     ╲
     ╱       ╲
```

## Examples

### React Project

```json
{
  "scripts": {
    "start": "npx console-pets && react-scripts start",
    "test": "npx console-pets && react-scripts test",
    "build": "npx console-pets && react-scripts build"
  }
}
```

### Express Server

```javascript
import pet from 'console-pets';
import express from 'express';

const app = express();

app.listen(3000, async () => {
  console.log('Server running on port 3000');
  await pet.happy('robot');
});

app.use(async (err, req, res, next) => {
  console.error('Server error:', err.message);
  await pet.sad('robot');
  res.status(500).send('Something broke!');
});
```

### Testing

```javascript
import pet from 'console-pets';

afterEach(async () => {
  if (global.testResults.success) {
    await pet.happy('cat');
  } else {
    await pet.sad('cat');
  }
});
```

### Build Scripts

```bash
#!/bin/bash
# build.sh

echo "Building project..."

if npm run build; then
  echo "✅ Build successful!"
  npx console-pets happy dragon
else
  echo "❌ Build failed!"
  npx console-pets sad dragon
  exit 1
fi
```


## Configuration

Console Pets automatically creates a `.console-pets.config.js` file in your project when installed. It also creates a global config file at `~/.console-pets.json` when first used:

```json
{
  "defaultPet": "cat",
  "colors": true
}
```

### Set Default Pet

```bash
npx console-pets set-pet dragon
npx console-pets list  # See all available pets
```

Now all commands without a specified pet will use your default:

```bash
npx console-pets random  # Uses dragon (your default)
```

## Real-World Integration

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    if npm test; then
      npx console-pets happy robot
      echo "::notice::Tests passed! 🤖"
    else
      npx console-pets sad robot
      echo "::error::Tests failed! 😢"
      exit 1
    fi
```

### Docker

```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Show pet when container starts
CMD ["sh", "-c", "npx console-pets happy alien && npm start"]
```

### Makefile

```makefile
.PHONY: test build deploy

test:
	@npx console-pets-run "npm test"

build:
	@npx console-pets-run "npm run build"

deploy: test build
	@npx console-pets-run "npm run deploy"
	@echo "🚀 Deployment complete!"
```

## Why Console Pets?

- **Motivation**: Makes terminal output more delightful
- **Team morale**: Shared smiles when builds succeed
- **Visual feedback**: Instant mood indicator for command results
- **Zero overhead**: Doesn't affect your actual code or performance
- **Universal**: Works with any language, framework, or tool

## Contributing

Pull requests welcome! Ideas for new pets or features:

- More pet types (whale, unicorn, etc.)
- Seasonal themes
- Animation frames
- More mood states
- Team/organization pets

## License

MIT © Manoj Ahirwar

---

Made with ❤️ and a lot of ☕

*Turn your terminal into a pet shop!* 🐾