# GRTA Console Pets Extension

This is a fork of [console-pets](https://github.com/manojahi/console-pets) with added **GRTA lobster** pet and extended mood system for OpenClaw orchestration monitoring.

## Features

### GRTA Lobster Pet 🦞
The GRTA (General Reasoning & Task Assistant) lobster displays different moods based on OpenClaw agent activity:

| Mood | Trigger |
|------|---------|
| 😊 Happy | Normal activity (3-5 active agents) |
| 🎉 Excited | High activity (6+ active agents) |
| 🤔 Thinking | Recent activity but quiet (2-5 min) |
| 😢 Sad | No active agents |
| 😴 Idle | No activity for 5+ minutes |
| 💤 Sleeping | Night hours (2am-6am) + no activity 30+ min |

### Usage

```bash
# Show GRTA lobster moods
npx console-pets happy lobster
npx console-pets sad lobster
npx console-pets thinking lobster
npx console-pets excited lobster
npx console-pets idle lobster
npx console-pets sleeping lobster

# Set GRTA as default pet
npx console-pets set-pet lobster

# List all pets (includes lobster 🦞)
npx console-pets list
```

### GRTA Watcher (for M5 Display)

Run the watcher to automatically update GRTA's mood based on OpenClaw activity:

```bash
# Start the watcher (updates every 10 seconds)
node grta-watcher.js

# Run in background
nohup node grta-watcher.js > grta.log 2>&1 &
```

## Installation

### For Your Project

```bash
cd /path/to/your/project
npm install serrrfirat/console-pets
```

### Global Installation

```bash
npm install -g serrrfirat/console-pets
```

## Development

```bash
# Install dependencies
npm install

# Test GRTA lobster
node cli.js happy lobster
node cli.js thinking lobster

# Run watcher test
node grta-watcher.js

# Test all moods
node -e "
import('./index.js').then(async (p) => {
  await p.default.happy('lobster');
  await p.default.sad('lobster');
  await p.default.thinking('lobster');
  await p.default.excited('lobster');
  await p.default.idle('lobster');
  await p.default.sleeping('lobster');
});
"
```

## Files Modified

- `pets/lobster.js` - GRTA lobster ASCII art with 6 moods
- `index.js` - Added lobster pet, new mood methods (thinking, excited, idle, sleeping)
- `cli.js` - Added CLI commands for new moods
- `grta-watcher.js` - New: Watcher script for OpenClaw integration

## Original Project

- [console-pets](https://github.com/manojahi/console-pets) by Manoj Ahirwar
- License: MIT

## License

MIT
