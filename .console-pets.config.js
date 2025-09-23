// Console Pets Configuration
// This file controls how Console Pets behaves in your project

export default {
  // Auto-commenting settings
  autoComment: {
    showOnCreate: true,         // Add comments when creating new files
    pets: ['cat', 'dog'],       // Pets to use (rotates randomly)
    fileTypes: [                // File extensions to auto-comment
      '.js', '.ts', '.jsx', '.tsx',
      '.html', '.css', '.vue', '.py'
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
