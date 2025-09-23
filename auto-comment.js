import fs from 'fs';
import path from 'path';
import config from './config.js';

class AutoCommenter {
  constructor() {
    this.petIndex = 0;
  }

  isShowOnCreateEnabled() {
    const currentConfig = config.get();
    return currentConfig.autoComment?.showOnCreate !== false; // Default to true if not set
  }

  shouldCommentFile(filePath, forCreation = true) {
    const ext = path.extname(filePath);
    const supportedTypes = config.get('autoComment')?.fileTypes || [];

    if (!supportedTypes.includes(ext)) return false;

    if (forCreation) {
      return this.isShowOnCreateEnabled();
    }

    return true; // Always allow manual commenting
  }

  getRandomPet() {
    const pets = config.get('autoComment')?.pets || ['cat'];
    const pet = pets[this.petIndex % pets.length];
    this.petIndex++;
    return pet;
  }

  getRandomTemplate() {
    const templates = config.get('autoComment')?.templates || [
      'Made with love by your pet {pet} {emoji}'
    ];
    return templates[Math.floor(Math.random() * templates.length)];
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

  getCommentStyle(filePath) {
    const ext = path.extname(filePath);
    const commentStyles = config.get('autoComment')?.commentStyles || {};

    return commentStyles[ext] || '// ';
  }

  async generateComment(filePath) {
    const pet = this.getRandomPet();
    const emoji = this.getPetEmoji(pet);
    const template = this.getRandomTemplate();
    const commentStyle = this.getCommentStyle(filePath);
    const ext = path.extname(filePath);

    // Get ASCII art for the SAME pet we selected
    const petArt = await this.getPetAsciiArt(pet);

    // Generate the text comment
    let textComment = template
      .replace('{pet}', pet)
      .replace('{emoji}', emoji);

    // Create the full comment with ASCII art
    let fullComment = '';

    if (ext === '.html') {
      // HTML comment style
      fullComment = '<!--\n';
      fullComment += petArt.map(line => '  ' + line).join('\n') + '\n';
      fullComment += `  ${textComment}\n`;
      fullComment += '-->';
    } else if (ext === '.css') {
      // CSS comment style
      fullComment = '/*\n';
      fullComment += petArt.map(line => ' * ' + line).join('\n') + '\n';
      fullComment += ` * ${textComment}\n`;
      fullComment += ' */';
    } else {
      // Single-line comment style (JS, TS, Python, etc.)
      fullComment = petArt.map(line => commentStyle + line).join('\n') + '\n';
      fullComment += commentStyle + textComment;
    }

    return fullComment;
  }

  async getPetAsciiArt(petType) {
    try {
      const petArt = (await import(`./pets/${petType}.js`)).default;
      // Always use happy mood for comments
      return petArt.happy || petArt.sad || ['No art available'];
    } catch (error) {
      // Fallback to cat if pet not found
      try {
        const catArt = (await import('./pets/cat.js')).default;
        return catArt.happy;
      } catch (e) {
        return ['🐾 Pet art not found'];
      }
    }
  }

  async addCommentToFile(filePath, content = '', forCreation = true) {
    if (!this.shouldCommentFile(filePath, forCreation)) {
      return content;
    }

    const comment = await this.generateComment(filePath);
    const position = config.get('autoComment')?.position || 'top';

    let newContent = content;

    if (position === 'top') {
      newContent = comment + '\n' + newContent;
    } else if (position === 'bottom') {
      newContent = newContent + '\n' + comment;
    }

    return newContent;
  }

  async createFile(filePath, initialContent = '') {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Add comment to content (for creation)
      const contentWithComment = await this.addCommentToFile(filePath, initialContent, true);

      // Write file
      fs.writeFileSync(filePath, contentWithComment);

      if (this.isShowOnCreateEnabled()) {
        console.log(`📝 Created ${filePath} with pet comment!`);

        // Show a happy pet
        const pet = (await import('./index.js')).default;
        const randomPet = this.getRandomPet();
        pet.happy(randomPet);
      } else {
        console.log(`📝 Created ${filePath}`);
      }

      return true;
    } catch (error) {
      console.error(`Failed to create file ${filePath}:`, error.message);
      return false;
    }
  }

  getFileTemplate(fileType) {
    const templates = {
      '.js': `function hello() {
  console.log('Hello from your pet!');
}

module.exports = { hello };`,

      '.ts': `export function hello(): void {
  console.log('Hello from your pet!');
}`,

      '.jsx': `import React from 'react';

export default function Component() {
  return (
    <div>
      <h1>Hello from your pet!</h1>
    </div>
  );
}`,

      '.tsx': `import React from 'react';

interface Props {
  message?: string;
}

export default function Component({ message = 'Hello from your pet!' }: Props) {
  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}`,

      '.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello Pet</title>
</head>
<body>
  <h1>Hello from your pet!</h1>
</body>
</html>`,

      '.css': `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}`,

      '.vue': `<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  name: 'PetComponent',
  data() {
    return {
      message: 'Hello from your pet!'
    }
  }
}
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>`,

      '.py': `def hello():
    """Say hello from your pet!"""
    print("Hello from your pet!")

if __name__ == "__main__":
    hello()`
    };

    return templates[fileType] || '';
  }

  async addCommentToExistingFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        console.error(`File ${filePath} does not exist`);
        return false;
      }

      // Check if file type is supported
      if (!this.shouldCommentFile(filePath, false)) {
        console.error(`File type not supported for ${filePath}`);
        return false;
      }

      // Read existing content
      const existingContent = fs.readFileSync(filePath, 'utf8');

      // Generate comment
      const comment = await this.generateComment(filePath);
      const position = config.get('autoComment')?.position || 'top';

      // Check if file already has a pet comment (look for ASCII art patterns)
      const asciiPatterns = [
        '/\\_/\\',    // Cat
        '( ^.^',     // Happy face patterns
        '┌─────┐',   // Robot
        '∩───∩',     // Hamster
        '👽',        // Alien emoji
        'Made with love by your pet', // Template text
        'Your coding companion',      // Template text
        'Built with'                  // Template text
      ];
      const hasPetComment = asciiPatterns.some(pattern => existingContent.includes(pattern));

      if (hasPetComment) {
        console.log(`${filePath} already has a pet comment! 🐾`);
        return false;
      }

      // Add comment to content
      let newContent;
      if (position === 'top') {
        newContent = comment + '\n' + existingContent;
      } else {
        newContent = existingContent + '\n' + comment;
      }

      // Write updated content
      fs.writeFileSync(filePath, newContent);

      console.log(`📝 Added pet comment to ${filePath}!`);

      // Show a happy pet
      const pet = require('./index');
      const randomPet = this.getRandomPet();
      pet.happy(randomPet);

      return true;
    } catch (error) {
      console.error(`Failed to add comment to ${filePath}:`, error.message);
      return false;
    }
  }
}

export default new AutoCommenter();